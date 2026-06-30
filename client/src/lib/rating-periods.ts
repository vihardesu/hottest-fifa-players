import { createAdminClient } from "@/lib/supabase/admin";
import { RATING_PERIOD_MS } from "@/lib/glicko-config";

export interface RatingPeriod {
  id: number;
  startedAt: number;
  endedAt: number | null;
  voteCount: number | null;
}

function mapPeriod(row: {
  id: number;
  started_at: string;
  ended_at: string | null;
  vote_count: number | null;
}): RatingPeriod {
  return {
    id: row.id,
    startedAt: new Date(row.started_at).getTime(),
    endedAt: row.ended_at ? new Date(row.ended_at).getTime() : null,
    voteCount: row.vote_count,
  };
}

export async function getActiveRatingPeriod(): Promise<RatingPeriod> {
  const supabase = createAdminClient();
  const { data: existing, error: existingError } = await supabase
    .from("rating_periods")
    .select("id, started_at, ended_at, vote_count")
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to load active rating period: ${existingError.message}`);
  }

  if (existing) {
    return mapPeriod(existing);
  }

  const { data: created, error: createError } = await supabase
    .from("rating_periods")
    .insert({ started_at: new Date().toISOString() })
    .select("id, started_at, ended_at, vote_count")
    .single();

  if (createError || !created) {
    throw new Error(`Failed to create rating period: ${createError?.message ?? "unknown error"}`);
  }

  return mapPeriod(created);
}

export function isRatingPeriodDue(period: RatingPeriod, now = Date.now()): boolean {
  return now - period.startedAt >= RATING_PERIOD_MS;
}

export async function closeRatingPeriod(
  periodId: number,
  voteCount: number,
): Promise<RatingPeriod> {
  const supabase = createAdminClient();
  const endedAt = new Date().toISOString();

  const { error: closeError } = await supabase
    .from("rating_periods")
    .update({ ended_at: endedAt, vote_count: voteCount })
    .eq("id", periodId);

  if (closeError) {
    throw new Error(`Failed to close rating period: ${closeError.message}`);
  }

  const { data: created, error: createError } = await supabase
    .from("rating_periods")
    .insert({ started_at: endedAt })
    .select("id, started_at, ended_at, vote_count")
    .single();

  if (createError || !created) {
    throw new Error(`Failed to open next rating period: ${createError?.message ?? "unknown error"}`);
  }

  return mapPeriod(created);
}

export async function writeRatingHistory(
  ratingPeriodId: number,
  snapshots: Array<{
    playerId: string;
    rating: number;
    rd: number;
    vol: number;
  }>,
): Promise<void> {
  if (snapshots.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  const rows = snapshots.map((snapshot) => ({
    player_id: Number(snapshot.playerId),
    rating_period_id: ratingPeriodId,
    rating: snapshot.rating,
    rd: snapshot.rd,
    volatility: snapshot.vol,
  }));

  const { error } = await supabase.from("rating_history").insert(rows);

  if (error) {
    throw new Error(`Failed to write rating history: ${error.message}`);
  }
}
