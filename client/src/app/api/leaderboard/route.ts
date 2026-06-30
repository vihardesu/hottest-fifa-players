import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/players";

export async function GET() {
  return NextResponse.json({ rankings: await getLeaderboard() });
}
