import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/muscles — List all muscles with optional region filter
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q");
  const limit = Math.min(parseInt(params.get("limit") || "100"), 200);
  const offset = parseInt(params.get("offset") || "0");

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { action: { contains: q, mode: "insensitive" } },
    ];
  }

  const [muscles, total] = await Promise.all([
    prisma.muscle.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        origin: true,
        insertion: true,
        action: true,
        innervation: true,
        bloodSupply: true,
        confidence: true,
        status: true,
        _count: {
          select: {
            movements: true,
            exercises: true,
          },
        },
      },
    }),
    prisma.muscle.count({ where }),
  ]);

  return NextResponse.json({
    data: muscles,
    meta: { total, limit, offset, hasMore: offset + limit < total },
  });
}
