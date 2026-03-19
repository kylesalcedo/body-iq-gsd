import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/exercises/filters
 * Returns all available filter options for the exercise finder.
 */
export async function GET() {
  const [regions, joints, movements, muscles, tasks] = await Promise.all([
    prisma.region.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.joint.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true, region: { select: { slug: true, name: true } } },
    }),
    prisma.movement.findMany({
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        joint: { select: { slug: true, name: true, region: { select: { slug: true } } } },
      },
    }),
    prisma.muscle.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.functionalTask.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true, category: true },
    }),
  ]);

  return NextResponse.json({
    regions,
    joints,
    movements,
    muscles,
    tasks,
    roles: ["primary", "secondary", "stabilizer", "synergist", "common_association"],
    statuses: ["draft", "needs_review", "reviewed", "verified", "disputed"],
  });
}
