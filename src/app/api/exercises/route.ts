import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/exercises?region=shoulder&muscle=gluteus-maximus&task=walking&status=draft&confidence=0.8&role=primary
 * 
 * All params optional. Multiple values comma-separated.
 * Returns exercises matching ALL provided filters (AND logic).
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const regionSlugs = params.get("region")?.split(",").filter(Boolean) || [];
  const jointSlugs = params.get("joint")?.split(",").filter(Boolean) || [];
  const movementSlugs = params.get("movement")?.split(",").filter(Boolean) || [];
  const muscleSlugs = params.get("muscle")?.split(",").filter(Boolean) || [];
  const taskSlugs = params.get("task")?.split(",").filter(Boolean) || [];
  const roles = params.get("role")?.split(",").filter(Boolean) || [];
  const statuses = params.get("status")?.split(",").filter(Boolean) || [];
  const minConfidence = params.get("minConfidence") ? parseFloat(params.get("minConfidence")!) : undefined;
  const maxConfidence = params.get("maxConfidence") ? parseFloat(params.get("maxConfidence")!) : undefined;
  const query = params.get("q")?.trim() || "";

  // Build where clause
  const where: any = {};
  const AND: any[] = [];

  // Text search
  if (query.length >= 2) {
    AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  // Status filter
  if (statuses.length > 0) {
    AND.push({ status: { in: statuses } });
  }

  // Confidence filter
  if (minConfidence !== undefined) {
    AND.push({ confidence: { gte: minConfidence } });
  }
  if (maxConfidence !== undefined) {
    AND.push({ confidence: { lte: maxConfidence } });
  }

  // Region filter: exercises whose movements belong to joints in these regions
  if (regionSlugs.length > 0) {
    AND.push({
      movements: {
        some: {
          movement: {
            joint: {
              region: { slug: { in: regionSlugs } },
            },
          },
        },
      },
    });
  }

  // Joint filter
  if (jointSlugs.length > 0) {
    AND.push({
      movements: {
        some: {
          movement: {
            joint: { slug: { in: jointSlugs } },
          },
        },
      },
    });
  }

  // Movement filter
  if (movementSlugs.length > 0) {
    AND.push({
      movements: {
        some: {
          movement: { slug: { in: movementSlugs } },
        },
      },
    });
  }

  // Muscle filter (optionally with role)
  if (muscleSlugs.length > 0) {
    const muscleFilter: any = {
      muscle: { slug: { in: muscleSlugs } },
    };
    if (roles.length > 0) {
      muscleFilter.role = { in: roles };
    }
    AND.push({
      muscles: { some: muscleFilter },
    });
  } else if (roles.length > 0) {
    // Role filter without specific muscle
    AND.push({
      muscles: { some: { role: { in: roles } } },
    });
  }

  // Functional task filter
  if (taskSlugs.length > 0) {
    AND.push({
      functionalTasks: {
        some: {
          functionalTask: { slug: { in: taskSlugs } },
        },
      },
    });
  }

  if (AND.length > 0) {
    where.AND = AND;
  }

  // Explicit select locks the v1 contract (see docs/api-v1.md §Endpoint 3).
  // Mirrors /api/exercises/:slug so list and detail return identical per-item shapes.
  const exercises = await prisma.exercise.findMany({
    where,
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
      imageUrl: true,
      videoUrl: true,
      videoType: true,
      confidence: true,
      status: true,
      notes: true,
      muscles: {
        select: {
          role: true,
          notes: true,
          muscle: {
            select: {
              slug: true,
              name: true,
              origin: true,
              insertion: true,
              action: true,
              innervation: true,
            },
          },
        },
        orderBy: { role: "asc" },
      },
      movements: {
        select: {
          movement: {
            select: {
              slug: true,
              name: true,
              plane: true,
              axis: true,
              joint: {
                select: {
                  slug: true,
                  name: true,
                  region: { select: { slug: true, name: true } },
                },
              },
            },
          },
        },
      },
      functionalTasks: {
        select: {
          functionalTask: {
            select: {
              slug: true,
              name: true,
              description: true,
              category: true,
            },
          },
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
          source: {
            select: {
              slug: true,
              title: true,
              authors: true,
              year: true,
              journal: true,
              doi: true,
              sourceType: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    count: exercises.length,
    exercises,
  });
}
