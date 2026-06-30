import { NextResponse } from "next/server";
import { getMatchup } from "@/lib/players";

export async function GET() {
  return NextResponse.json(getMatchup());
}
