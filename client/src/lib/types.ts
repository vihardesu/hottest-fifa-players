export interface PlayerRecord {
  player_id: string;
  player_name: string;
  short_name: string;
  country: string;
  image_url: string;
}

export interface RatedPlayer extends PlayerRecord {
  elo: number;
  rank: number;
}

export interface MatchupPlayer {
  id: string;
  name: string;
  imageUrl: string;
  country: string;
  elo: number;
}

export interface MatchupResponse {
  matchupId: string;
  players: [MatchupPlayer, MatchupPlayer];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  imageUrl: string;
  elo: number;
}

export interface VoteResponse {
  success: boolean;
  nextMatchup?: MatchupResponse;
  rateLimited?: boolean;
}

export interface RankingUpdateEvent {
  type: "initial" | "ranking_update";
  rankings: LeaderboardEntry[];
}
