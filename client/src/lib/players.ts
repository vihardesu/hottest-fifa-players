import type {
  LeaderboardEntry,
  MatchupPlayer,
  MatchupResponse,
  PlayerRecord,
  RatedPlayer,
} from "@/lib/types";
import {
  LEADERBOARD_LIMIT,
  MATCHUP_RATING_WINDOW,
  DUPLICATE_VOTE_WINDOW_MS,
  MAX_VOTES_PER_PLAYER_PER_SESSION_PER_DAY,
  MAX_VOTES_PER_SESSION_PER_DAY,
  RATE_LIMIT_MS,
  GLICKO_DEFAULTS,
} from "@/lib/glicko-config";
import {
  applyRatingPeriod,
  displayRating,
  type GlickoPlayerState,
} from "@/lib/glicko";
import {
  appendVote,
  getSessionVotesForDay,
  getVotesForPeriod,
  hashClientId,
} from "@/lib/votes";
import {
  closeRatingPeriod,
  getActiveRatingPeriod,
  isRatingPeriodDue,
  writeRatingHistory,
} from "@/lib/rating-periods";
import { createAdminClient } from "@/lib/supabase/admin";

type RankingListener = (rankings: LeaderboardEntry[]) => void;

interface PlayerState extends PlayerRecord {
  rating: number;
  rd: number;
  vol: number;
}

interface SessionVoteState {
  lastVoteAt: number;
  lastWinnerId: string | null;
  lastLoserId: string | null;
}

const listeners = new Set<RankingListener>();
const voteTimestamps = new Map<string, number>();
const sessionState = new Map<string, SessionVoteState>();

let initialized = false;
let players = new Map<string, PlayerState>();
let activeRatingPeriodId: number | null = null;

function formatPlayerName(name: string): string {
  return name
    .split(" ")
    .map((part) => {
      if (part === part.toUpperCase() && part.length > 1) {
        return part.charAt(0) + part.slice(1).toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSessionState(sessionId: string): SessionVoteState {
  const existing = sessionState.get(sessionId);

  if (!existing) {
    const fresh: SessionVoteState = {
      lastVoteAt: 0,
      lastWinnerId: null,
      lastLoserId: null,
    };
    sessionState.set(sessionId, fresh);
    return fresh;
  }

  return existing;
}

function weightedPick(pool: PlayerState[], weightFn: (player: PlayerState) => number): PlayerState {
  const weights = pool.map(weightFn);
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  if (total <= 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let threshold = Math.random() * total;
  for (let index = 0; index < pool.length; index += 1) {
    threshold -= weights[index];
    if (threshold <= 0) {
      return pool[index];
    }
  }

  return pool[pool.length - 1];
}

function toMatchupPlayer(player: PlayerState): MatchupPlayer {
  return {
    id: player.player_id,
    name: formatPlayerName(player.player_name),
    imageUrl: player.image_url,
    country: player.country,
    elo: displayRating(player.rating),
  };
}

function getRankedPlayers(): RatedPlayer[] {
  return [...players.values()]
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        a.player_name.localeCompare(b.player_name),
    )
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}

function getLeaderboardFromCache(limit = LEADERBOARD_LIMIT): LeaderboardEntry[] {
  return getRankedPlayers().slice(0, limit).map((player) => ({
    id: player.player_id,
    rank: player.rank,
    name: formatPlayerName(player.player_name),
    imageUrl: player.image_url,
    elo: displayRating(player.rating),
  }));
}

function notifyListeners(): void {
  const rankings = getLeaderboardFromCache();
  listeners.forEach((listener) => listener(rankings));
}

async function persistPlayerRatings(updates: Map<string, GlickoPlayerState>): Promise<void> {
  const supabase = createAdminClient();

  await Promise.all(
    [...updates.entries()].map(([id, state]) =>
      supabase
        .from("players")
        .update({
          rating: state.rating,
          rd: state.rd,
          volatility: state.vol,
        })
        .eq("player_id", Number(id)),
    ),
  );
}

async function loadFromDatabase(): Promise<void> {
  const supabase = createAdminClient();
  const { data: playerRows, error: playersError } = await supabase
    .from("players")
    .select("player_id, player_name, short_name, country, image_url, rating, rd, volatility");

  if (playersError) {
    throw new Error(`Failed to load players: ${playersError.message}`);
  }

  if (!playerRows || playerRows.length === 0) {
    throw new Error("No players found in Supabase. Seed the players table first.");
  }

  players = new Map(
    playerRows.map((row) => [
      String(row.player_id),
      {
        player_id: String(row.player_id),
        player_name: row.player_name,
        short_name: row.short_name ?? row.player_name,
        country: row.country,
        image_url: row.image_url,
        rating: row.rating ?? GLICKO_DEFAULTS.rating,
        rd: row.rd ?? GLICKO_DEFAULTS.rd,
        vol: row.volatility ?? GLICKO_DEFAULTS.vol,
      },
    ]),
  );

  const period = await getActiveRatingPeriod();
  activeRatingPeriodId = period.id;
}

export async function ensurePlayersLoaded(): Promise<void> {
  if (initialized) {
    return;
  }

  await loadFromDatabase();
  initialized = true;
}

export async function maybeRunRatingPeriod(): Promise<boolean> {
  await ensurePlayersLoaded();

  const period = await getActiveRatingPeriod();
  activeRatingPeriodId = period.id;

  if (!isRatingPeriodDue(period)) {
    return false;
  }

  const periodVotes = await getVotesForPeriod(period.id);
  const glickoStates = new Map<string, GlickoPlayerState>(
    [...players.entries()].map(([id, player]) => [
      id,
      { rating: player.rating, rd: player.rd, vol: player.vol },
    ]),
  );

  const updatedStates = applyRatingPeriod(
    glickoStates,
    periodVotes.map((vote) => ({
      winnerId: vote.winnerId,
      loserId: vote.loserId,
    })),
  );

  const changedIds = new Set<string>();
  const historySnapshots: Array<{
    playerId: string;
    rating: number;
    rd: number;
    vol: number;
  }> = [];

  for (const [id, state] of updatedStates) {
    const player = players.get(id);
    if (!player) {
      continue;
    }

    const changed =
      player.rating !== state.rating ||
      player.rd !== state.rd ||
      player.vol !== state.vol;

    players.set(id, { ...player, ...state });

    if (changed) {
      changedIds.add(id);
      historySnapshots.push({
        playerId: id,
        rating: state.rating,
        rd: state.rd,
        vol: state.vol,
      });
    }
  }

  await persistPlayerRatings(updatedStates);
  await writeRatingHistory(period.id, historySnapshots);
  const nextPeriod = await closeRatingPeriod(period.id, periodVotes.length);
  activeRatingPeriodId = nextPeriod.id;
  notifyListeners();

  return true;
}

export function subscribeToRankings(listener: RankingListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getMatchup(): Promise<MatchupResponse> {
  await ensurePlayersLoaded();
  await maybeRunRatingPeriod();

  const pool = [...players.values()];
  const first = weightedPick(pool, (player) => player.rd);
  const candidates = pool.filter(
    (player) =>
      player.player_id !== first.player_id &&
      Math.abs(player.rating - first.rating) <= MATCHUP_RATING_WINDOW,
  );
  const opponentPool =
    candidates.length > 0
      ? candidates
      : pool.filter((player) => player.player_id !== first.player_id);
  const second = weightedPick(opponentPool, (player) => player.rd);

  const pair = Math.random() > 0.5 ? [first, second] : [second, first];

  return {
    matchupId: `${pair[0].player_id}-${pair[1].player_id}-${Date.now()}`,
    players: [toMatchupPlayer(pair[0]), toMatchupPlayer(pair[1])],
  };
}

export async function submitVote(
  winnerId: string,
  loserId: string,
  sessionId: string,
): Promise<{ success: boolean; rateLimited?: boolean; message?: string }> {
  await ensurePlayersLoaded();

  const now = Date.now();
  const lastVote = voteTimestamps.get(sessionId) ?? 0;
  if (now - lastVote < RATE_LIMIT_MS) {
    return { success: false, rateLimited: true, message: "Voting too quickly." };
  }

  const winner = players.get(winnerId);
  const loser = players.get(loserId);

  if (!winner || !loser || winnerId === loserId) {
    return { success: false, message: "Invalid matchup." };
  }

  const session = getSessionState(sessionId);

  if (
    session.lastWinnerId === winnerId &&
    session.lastLoserId === loserId &&
    now - session.lastVoteAt < DUPLICATE_VOTE_WINDOW_MS
  ) {
    return { success: false, rateLimited: true, message: "Duplicate vote ignored." };
  }

  const day = todayKey();
  const persistedSessionVotes = await getSessionVotesForDay(sessionId, day);

  if (persistedSessionVotes.length >= MAX_VOTES_PER_SESSION_PER_DAY) {
    return {
      success: false,
      rateLimited: true,
      message: "Daily vote limit reached for this session.",
    };
  }

  const votesForWinner = persistedSessionVotes.filter(
    (vote) => vote.winnerId === winnerId || vote.loserId === winnerId,
  ).length;
  const votesForLoser = persistedSessionVotes.filter(
    (vote) => vote.winnerId === loserId || vote.loserId === loserId,
  ).length;

  if (
    votesForWinner >= MAX_VOTES_PER_PLAYER_PER_SESSION_PER_DAY ||
    votesForLoser >= MAX_VOTES_PER_PLAYER_PER_SESSION_PER_DAY
  ) {
    return {
      success: false,
      rateLimited: true,
      message: "Too many votes affecting these players today.",
    };
  }

  const period = await getActiveRatingPeriod();
  activeRatingPeriodId = period.id;

  await appendVote(
    winnerId,
    loserId,
    sessionId,
    period.id,
    hashClientId(sessionId),
  );

  session.lastVoteAt = now;
  session.lastWinnerId = winnerId;
  session.lastLoserId = loserId;
  voteTimestamps.set(sessionId, now);

  await maybeRunRatingPeriod();

  return { success: true };
}

export async function getLeaderboard(limit = LEADERBOARD_LIMIT): Promise<LeaderboardEntry[]> {
  await ensurePlayersLoaded();
  await maybeRunRatingPeriod();
  return getLeaderboardFromCache(limit);
}
