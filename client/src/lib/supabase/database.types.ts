export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          player_id: number;
          player_name: string;
          short_name: string | null;
          country: string;
          country_code: string | null;
          group_name: string | null;
          role: string | null;
          position_detail: string | null;
          jersey_number: number | null;
          birth_date: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          nationality_code: string | null;
          image_url: string;
          team_id: number | null;
          preferred_foot: string | null;
          active_status: number | null;
          rating: number;
          rd: number;
          volatility: number;
          comparisons: number;
        };
        Insert: {
          player_id: number;
          player_name: string;
          short_name?: string | null;
          country: string;
          image_url: string;
          rating?: number;
          rd?: number;
          volatility?: number;
          comparisons?: number;
        };
        Update: {
          rating?: number;
          rd?: number;
          volatility?: number;
          comparisons?: number;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: number;
          winner_id: number;
          loser_id: number;
          outcome: number;
          session_id: string;
          ip_hash: string | null;
          created_at: string;
          rating_period_id: number | null;
        };
        Insert: {
          winner_id: number;
          loser_id: number;
          outcome?: number;
          session_id: string;
          ip_hash?: string | null;
          rating_period_id?: number | null;
        };
        Update: {
          rating_period_id?: number | null;
        };
        Relationships: [];
      };
      rating_periods: {
        Row: {
          id: number;
          started_at: string;
          ended_at: string | null;
          vote_count: number | null;
        };
        Insert: {
          started_at?: string;
          ended_at?: string | null;
          vote_count?: number | null;
        };
        Update: {
          ended_at?: string | null;
          vote_count?: number | null;
        };
        Relationships: [];
      };
      rating_history: {
        Row: {
          id: number;
          player_id: number;
          rating_period_id: number;
          rating: number;
          rd: number;
          volatility: number;
          recorded_at: string;
        };
        Insert: {
          player_id: number;
          rating_period_id: number;
          rating: number;
          rd: number;
          volatility: number;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
