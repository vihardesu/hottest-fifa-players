import { NextResponse } from "next/server";
import { maybeRunRatingPeriod } from "@/lib/players";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const processed = await maybeRunRatingPeriod();
    return NextResponse.json({ ok: true, processed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rating period processing failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
