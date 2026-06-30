import { Glicko2, type Player } from "glicko2";
import { GLICKO_DEFAULTS } from "@/lib/glicko-config";

export interface GlickoPlayerState {
  rating: number;
  rd: number;
  vol: number;
}

export interface PendingVote {
  winnerId: string;
  loserId: string;
}

export function createGlickoEngine(): Glicko2 {
  return new Glicko2({
    tau: GLICKO_DEFAULTS.tau,
    rating: GLICKO_DEFAULTS.rating,
    rd: GLICKO_DEFAULTS.rd,
    vol: GLICKO_DEFAULTS.vol,
  });
}

/**
 * Apply all votes from a rating period using Glicko-2.
 * Players who did not play only receive RD inflation (step 6).
 */
export function applyRatingPeriod(
  playerStates: Map<string, GlickoPlayerState>,
  votes: PendingVote[],
): Map<string, GlickoPlayerState> {
  const glicko = createGlickoEngine();
  const glickoPlayers = new Map<string, Player>();

  for (const [id, state] of playerStates) {
    glickoPlayers.set(id, glicko.makePlayer(state.rating, state.rd, state.vol));
  }

  const matches: [Player, Player, number][] = [];
  for (const vote of votes) {
    const winner = glickoPlayers.get(vote.winnerId);
    const loser = glickoPlayers.get(vote.loserId);
    if (winner && loser) {
      matches.push([winner, loser, 1]);
    }
  }

  glicko.updateRatings(matches);

  const updated = new Map<string, GlickoPlayerState>();
  for (const [id, player] of glickoPlayers) {
    updated.set(id, {
      rating: player.getRating(),
      rd: player.getRd(),
      vol: player.getVol(),
    });
  }

  return updated;
}

export function displayRating(rating: number): number {
  return Math.round(rating);
}
