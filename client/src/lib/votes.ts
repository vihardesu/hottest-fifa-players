import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { VoteRecord } from "@/lib/types";

function mapVote(row: {
  id: number;
  winner_id: number;
  loser_id: number;
  session_id: string;
  created_at: string;
}): VoteRecord {
  return {
    id: String(row.id),
    winnerId: String(row.winner_id),
    loserId: String(row.loser_id),
    sessionId: row.session_id,
    timestamp: new Date(row.created_at).getTime(),
    processed: false,
  };
}

export function hashClientId(clientId: string): string {
  return createHash("sha256").update(clientId).digest("hex").slice(0, 32);
}

export async function appendVote(
  winnerId: string,
  loserId: string,
  sessionId: string,
  ratingPeriodId: number,
  ipHash: string,
): Promise<VoteRecord> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("votes")
    .insert({
      winner_id: Number(winnerId),
      loser_id: Number(loserId),
      outcome: 1,
      session_id: sessionId,
      ip_hash: ipHash,
      rating_period_id: ratingPeriodId,
    })
    .select("id, winner_id, loser_id, session_id, created_at")
    .single();

  if (error || !data) {
    throw new Error(`Failed to record vote: ${error?.message ?? "unknown error"}`);
  }

  return mapVote(data);
}

export async function getVotesForPeriod(ratingPeriodId: number): Promise<VoteRecord[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("votes")
    .select("id, winner_id, loser_id, session_id, created_at")
    .eq("rating_period_id", ratingPeriodId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load votes for period: ${error.message}`);
  }

  return (data ?? []).map(mapVote);
}

export async function getSessionVotesForDay(
  sessionId: string,
  day: string,
): Promise<VoteRecord[]> {
  const supabase = createAdminClient();
  const start = `${day}T00:00:00.000Z`;
  const end = `${day}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("votes")
    .select("id, winner_id, loser_id, session_id, created_at")
    .eq("session_id", sessionId)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load session votes: ${error.message}`);
  }

  return (data ?? []).map(mapVote);
}
