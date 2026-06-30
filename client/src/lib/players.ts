import fs from "fs";
import path from "path";
import type {
  LeaderboardEntry,
  MatchupPlayer,
  MatchupResponse,
  PlayerRecord,
  RatedPlayer,
} from "@/lib/types";
import { updateRatings } from "@/lib/elo";

const DEFAULT_ELO = 1500;
const MATCHUP_ELO_RANGE = 120;
const LEADERBOARD_LIMIT = 50;

type RankingListener = (rankings: LeaderboardEntry[]) => void;

interface PlayerState extends PlayerRecord {
  elo: number;
}

const listeners = new Set<RankingListener>();
const voteTimestamps = new Map<string, number>();
const RATE_LIMIT_MS = 1000;

let initialized = false;
let players = new Map<string, PlayerState>();

function dataPath(): string {
  return path.join(process.cwd(), "..", "data", "fifa_2026_players.json");
}

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

function toMatchupPlayer(player: PlayerState): MatchupPlayer {
  return {
    id: player.player_id,
    name: formatPlayerName(player.player_name),
    imageUrl: player.image_url,
    country: player.country,
    elo: player.elo,
  };
}

function getRankedPlayers(): RatedPlayer[] {
  return [...players.values()]
    .sort((a, b) => b.elo - a.elo || a.player_name.localeCompare(b.player_name))
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}

function getLeaderboard(limit = LEADERBOARD_LIMIT): LeaderboardEntry[] {
  return getRankedPlayers().slice(0, limit).map((player) => ({
    id: player.player_id,
    rank: player.rank,
    name: formatPlayerName(player.player_name),
    imageUrl: player.image_url,
    elo: player.elo,
  }));
}

function notifyListeners(): void {
  const rankings = getLeaderboard();
  listeners.forEach((listener) => listener(rankings));
}

export function ensurePlayersLoaded(): void {
  if (initialized) {
    return;
  }

  const raw = fs.readFileSync(dataPath(), "utf-8");
  const records = JSON.parse(raw) as PlayerRecord[];

  players = new Map(
    records.map((record) => [
      record.player_id,
      {
        ...record,
        elo: DEFAULT_ELO,
      },
    ]),
  );

  initialized = true;
}

export function subscribeToRankings(listener: RankingListener): () => void {
  ensurePlayersLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMatchup(): MatchupResponse {
  ensurePlayersLoaded();

  const pool = [...players.values()];
  const first = pool[Math.floor(Math.random() * pool.length)];
  const candidates = pool.filter(
    (player) =>
      player.player_id !== first.player_id &&
      Math.abs(player.elo - first.elo) <= MATCHUP_ELO_RANGE,
  );
  const opponentPool = candidates.length > 0 ? candidates : pool.filter((player) => player.player_id !== first.player_id);
  const second = opponentPool[Math.floor(Math.random() * opponentPool.length)];

  return {
    matchupId: `${first.player_id}-${second.player_id}-${Date.now()}`,
    players: [toMatchupPlayer(first), toMatchupPlayer(second)],
  };
}

export function submitVote(
  winnerId: string,
  loserId: string,
  clientId: string,
): { success: boolean; rateLimited?: boolean } {
  ensurePlayersLoaded();

  const now = Date.now();
  const lastVote = voteTimestamps.get(clientId) ?? 0;
  if (now - lastVote < RATE_LIMIT_MS) {
    return { success: false, rateLimited: true };
  }

  const winner = players.get(winnerId);
  const loser = players.get(loserId);

  if (!winner || !loser || winnerId === loserId) {
    return { success: false };
  }

  const updated = updateRatings(winner.elo, loser.elo);
  players.set(winnerId, { ...winner, elo: updated.winner });
  players.set(loserId, { ...loser, elo: updated.loser });
  voteTimestamps.set(clientId, now);
  notifyListeners();

  return { success: true };
}

export { getLeaderboard };
