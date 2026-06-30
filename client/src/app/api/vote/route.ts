import { after } from "next/server";
import { NextResponse } from "next/server";
import { getMatchup, maybeRunRatingPeriod, submitVote } from "@/lib/players";

function getSessionId(request: Request): string {
  const fromClient = request.headers.get("x-session-id")?.trim();
  if (fromClient && fromClient.length <= 64 && /^[\w-]+$/.test(fromClient)) {
    return fromClient;
  }

  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as { winnerId?: string; loserId?: string };
  const { winnerId, loserId } = body;

  if (!winnerId || !loserId) {
    return NextResponse.json({ success: false, error: "Missing player ids" }, { status: 400 });
  }

  const result = await submitVote(winnerId, loserId, getSessionId(request));

  if (result.rateLimited) {
    return NextResponse.json(
      { success: false, rateLimited: true, message: result.message },
      { status: 429 },
    );
  }

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 },
    );
  }

  if (result.periodDue) {
    after(() => maybeRunRatingPeriod());
  }

  return NextResponse.json({
    success: true,
    nextMatchup: await getMatchup(),
  });
}
