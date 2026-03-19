import { NextRequest, NextResponse } from "next/server";
import { searchEntities } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ regions: [], joints: [], movements: [], muscles: [], tasks: [], exercises: [] });
  }
  const results = await searchEntities(q.trim());
  return NextResponse.json(results);
}
