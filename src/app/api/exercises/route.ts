import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/exercises — List all exercises with filters
// Query params: ?region=shoulder&difficulty=beginner&equipment=resistance-band&q=bridge
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q");
  const difficulty = params.get("difficulty");
  const bodyPosition = params.get("bodyPosition");
  const evidenceLevel = params.get("evidenceLevel");
  const limit = Math.min(parseInt(params.get("limit") || "50"), 100);
  const offset = parseInt(params.get("offset") || "0");

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (difficulty) where.difficulty = difficulty;
  if (bodyPosition) where.bodyPosition = bodyPosition;
  if (evidenceLevel) where.evidenceLevel = evidenceLevel;

  const [exercises, total] = await Promise.all([
    prisma.exercise.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        description: true,
        dosing: true,
        emgNotes: true,
        evidenceLevel: true,
        difficulty: true,
        equipment: true,
        bodyPosition: true,
        confidence: true,
        status: true,
        muscles: {
          select: {
            role: true,
            notes: true,
            muscle: { select: { slug: true, name: true } },
          },
          orderBy: { role: "asc" },
        },
        movements: {
          select: {
            movement: {
              select: {
                slug: true,
                name: true,
                joint: { select: { slug: true, name: true, region: { select: { slug: true, name: true } } } },
              },
            },
          },
        },
        functionalTasks: {
          select: {
            functionalTask: { select: { slug: true, name: true, category: true } },
          },
        },
        cues: {
          select: { text: true, cueType: true },
          orderBy: { order: "asc" },
        },
        regressions: {
          select: { name: true, description: true },
          orderBy: { order: "asc" },
        },
        progressions: {
          select: { name: true, description: true },
          orderBy: { order: "asc" },
        },
        sources: {
          select: {
            notes: true,
            source: { select: { slug: true, title: true, authors: true, year: true, journal: true } },
          },
        },
      },
    }),
    prisma.exercise.count({ where }),
  ]);

  return NextResponse.json({
    data: exercises,
    meta: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}
