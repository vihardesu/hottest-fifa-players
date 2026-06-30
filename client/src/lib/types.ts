export interface PlayerRecord {
  player_id: string;
  player_name: string;
  short_name: string;
  country: string;
  country_code: string | null;
  birth_date: string | null;
  height_cm: number | null;
  image_url: string;
}

export interface RatedPlayer extends PlayerRecord {
  rating: number;
  rank: number;
}

export interface MatchupPlayer {
  id: string;
  name: string;
  imageUrl: string;
  country: string;
  countryCode: string | null;
  birthDate: string | null;
  heightCm: number | null;
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
  country: string;
  countryCode: string | null;
  birthDate: string | null;
  heightCm: number | null;
  elo: number;
}

export interface CountryLeaderboardEntry {
  id: string;
  rank: number;
  country: string;
  countryCode: string;
  squadScore: number;
  playerCount: number;
  topPlayer: {
    id: string;
    name: string;
    imageUrl: string;
    elo: number;
  };
}

export interface CountryRankingUpdateEvent {
  type: "initial" | "ranking_update" | "error";
  rankings?: CountryLeaderboardEntry[];
  message?: string;
}

export interface VoteRecord {
  id: string;
  winnerId: string;
  loserId: string;
  sessionId: string;
  timestamp: number;
  processed: boolean;
}

export interface VoteResponse {
  success: boolean;
  nextMatchup?: MatchupResponse;
  rateLimited?: boolean;
  message?: string;
}

export interface RankingUpdateEvent {
  type: "initial" | "ranking_update" | "error";
  rankings?: LeaderboardEntry[];
  message?: string;
}
