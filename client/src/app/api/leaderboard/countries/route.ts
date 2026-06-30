import { NextResponse } from "next/server";
import { getCountryLeaderboard } from "@/lib/players";

export async function GET() {
  return NextResponse.json({ rankings: await getCountryLeaderboard() });
}
