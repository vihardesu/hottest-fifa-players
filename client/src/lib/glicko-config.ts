/** Glicko-2 defaults from elo-strategy.md */
export const GLICKO_DEFAULTS = {
  rating: 1500,
  rd: 350,
  vol: 0.06,
  tau: 0.5,
} as const;

/** Pair players within ~150–200 rating points of each other. */
export const MATCHUP_RATING_WINDOW = 175;

/** Batch rating updates every few hours (override via RATING_PERIOD_MS). */
export const RATING_PERIOD_MS =
  Number(process.env.RATING_PERIOD_MS) || 3 * 60 * 60 * 1000;

export const LEADERBOARD_LIMIT = 50;

/** Guardrails */
export const RATE_LIMIT_MS = 1000;
export const DUPLICATE_VOTE_WINDOW_MS = 2000;
export const MAX_VOTES_PER_SESSION_PER_DAY = 100;
export const MAX_VOTES_PER_PLAYER_PER_SESSION_PER_DAY = 15;
