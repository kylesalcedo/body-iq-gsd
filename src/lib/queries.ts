import { prisma } from "@/lib/prisma";

/** Common includes for validation metadata */
const validationSelect = {
  status: true,
  confidence: true,
  notes: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Regions ─────────────────────────────────────────────────────────────────

export async function getRegions() {
  return prisma.region.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { joints: true } },
    },
  });
}

export async function getRegion(slug: string) {
  return prisma.region.findUnique({
    where: { slug },
    include: {
      joints: {
        orderBy: { name: "asc" },
        include: {
          _count: { select: { movements: true } },
        },
      },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Joints ──────────────────────────────────────────────────────────────────

export async function getJoints() {
  return prisma.joint.findMany({
    orderBy: { name: "asc" },
    include: {
      region: { select: { slug: true, name: true } },
      _count: { select: { movements: true } },
    },
  });
}

export async function getJoint(slug: string) {
  return prisma.joint.findUnique({
    where: { slug },
    include: {
      region: { select: { slug: true, name: true } },
      movements: {
        orderBy: { name: "asc" },
        include: {
          _count: { select: { muscles: true, exercises: true } },
        },
      },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Movements ───────────────────────────────────────────────────────────────

export async function getMovements() {
  return prisma.movement.findMany({
    orderBy: { name: "asc" },
    include: {
      joint: {
        select: { slug: true, name: true, region: { select: { slug: true, name: true } } },
      },
      _count: { select: { muscles: true, exercises: true, functionalTasks: true } },
    },
  });
}

export async function getMovementsGroupedByRegion() {
  return prisma.region.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      joints: {
        orderBy: { name: "asc" },
        include: {
          movements: {
            orderBy: { name: "asc" },
            include: {
              _count: { select: { muscles: true, exercises: true, functionalTasks: true } },
            },
          },
        },
      },
    },
  });
}

export async function getMovement(slug: string) {
  return prisma.movement.findUnique({
    where: { slug },
    include: {
      joint: {
        select: { slug: true, name: true, region: { select: { slug: true, name: true } } },
      },
      muscles: {
        include: { muscle: true },
        orderBy: { role: "asc" },
      },
      functionalTasks: {
        include: { functionalTask: true },
      },
      exercises: {
        include: { exercise: true },
      },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Muscles ─────────────────────────────────────────────────────────────────

export async function getMuscles() {
  return prisma.muscle.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { movements: true, exercises: true } },
    },
  });
}

export async function getMuscle(slug: string) {
  return prisma.muscle.findUnique({
    where: { slug },
    include: {
      movements: {
        include: {
          movement: {
            select: { slug: true, name: true, joint: { select: { slug: true, name: true } } },
          },
        },
        orderBy: { role: "asc" },
      },
      exercises: {
        include: {
          exercise: { select: { slug: true, name: true } },
        },
        orderBy: { role: "asc" },
      },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Functional Tasks ────────────────────────────────────────────────────────

export async function getFunctionalTasks() {
  return prisma.functionalTask.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { movements: true, exercises: true } },
    },
  });
}

export async function getFunctionalTask(slug: string) {
  return prisma.functionalTask.findUnique({
    where: { slug },
    include: {
      movements: {
        include: {
          movement: {
            select: { slug: true, name: true, joint: { select: { slug: true, name: true } } },
          },
        },
      },
      exercises: {
        include: {
          exercise: { select: { slug: true, name: true } },
        },
      },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Exercises ───────────────────────────────────────────────────────────────

export async function getExercises() {
  return prisma.exercise.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { muscles: true, movements: true, cues: true, regressions: true, progressions: true } },
    },
  });
}

export async function getExercisesGroupedByRegion() {
  // Get all regions with their joints → movements → exercises
  const regions = await prisma.region.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      joints: {
        select: {
          id: true,
          movements: {
            select: {
              id: true,
              exercises: {
                select: { exerciseId: true },
              },
            },
          },
        },
      },
    },
  });

  // Collect unique exercise IDs per region
  const regionExerciseIds = new Map<string, Set<string>>();
  for (const region of regions) {
    const ids = new Set<string>();
    for (const joint of region.joints) {
      for (const movement of joint.movements) {
        for (const link of movement.exercises) {
          ids.add(link.exerciseId);
        }
      }
    }
    regionExerciseIds.set(region.slug, ids);
  }

  // Load all exercises with counts in one query
  const allExercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { muscles: true, movements: true, cues: true, regressions: true, progressions: true, sources: true } },
    },
  });

  const exerciseById = new Map(allExercises.map((e) => [e.id, e]));

  // Build grouped result
  const grouped = regions.map((region) => {
    const exerciseIds = regionExerciseIds.get(region.slug) ?? new Set();
    const exercises = Array.from(exerciseIds)
      .map((id) => exerciseById.get(id))
      .filter(Boolean)
      .sort((a, b) => a!.name.localeCompare(b!.name));
    return {
      slug: region.slug,
      name: region.name,
      exercises: exercises as NonNullable<(typeof exercises)[number]>[],
    };
  });

  // Collect all assigned exercise IDs to find unassigned ones
  const allAssigned = new Set<string>();
  for (const ids of regionExerciseIds.values()) {
    for (const id of ids) allAssigned.add(id);
  }
  const unassigned = allExercises.filter((e) => !allAssigned.has(e.id));
  if (unassigned.length > 0) {
    grouped.push({ slug: "unassigned", name: "Unassigned", exercises: unassigned });
  }

  return grouped;
}

export async function getExercise(slug: string) {
  return prisma.exercise.findUnique({
    where: { slug },
    include: {
      muscles: {
        include: { muscle: true },
        orderBy: { role: "asc" },
      },
      movements: {
        include: {
          movement: {
            select: { slug: true, name: true, joint: { select: { slug: true, name: true } } },
          },
        },
      },
      functionalTasks: {
        include: { functionalTask: true },
      },
      cues: { orderBy: { order: "asc" } },
      regressions: { orderBy: { order: "asc" } },
      progressions: { orderBy: { order: "asc" } },
      sources: { include: { source: true } },
      tags: { include: { tag: true } },
    },
  });
}

// ─── Sources ─────────────────────────────────────────────────────────────────

export async function getSources() {
  return prisma.researchSource.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: { select: { entities: true } },
    },
  });
}

export async function getSource(slug: string) {
  return prisma.researchSource.findUnique({
    where: { slug },
    include: {
      entities: true,
    },
  });
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchEntities(query: string) {
  const q = `%${query}%`;

  const [regions, joints, movements, muscles, tasks, exercises] = await Promise.all([
    prisma.region.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
    prisma.joint.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
    prisma.movement.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
    prisma.muscle.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
    prisma.functionalTask.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
    prisma.exercise.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 5 }),
  ]);

  return {
    regions: regions.map((r) => ({ ...r, entityType: "region" as const })),
    joints: joints.map((j) => ({ ...j, entityType: "joint" as const })),
    movements: movements.map((m) => ({ ...m, entityType: "movement" as const })),
    muscles: muscles.map((m) => ({ ...m, entityType: "muscle" as const })),
    tasks: tasks.map((t) => ({ ...t, entityType: "task" as const })),
    exercises: exercises.map((e) => ({ ...e, entityType: "exercise" as const })),
  };
}

// ─── Validation Queue ────────────────────────────────────────────────────────

export async function getValidationQueue() {
  const [
    draftItems,
    lowConfidenceItems,
    needsReviewItems,
  ] = await Promise.all([
    // Draft entities across all types
    Promise.all([
      prisma.region.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.joint.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.movement.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.muscle.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.functionalTask.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.exercise.findMany({ where: { status: "draft" }, select: { slug: true, name: true, status: true, confidence: true } }),
    ]),
    // Low confidence (< 0.6) across all types
    Promise.all([
      prisma.region.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.joint.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.movement.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.muscle.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.functionalTask.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.exercise.findMany({ where: { confidence: { lt: 0.6 } }, select: { slug: true, name: true, status: true, confidence: true } }),
    ]),
    // Needs review
    Promise.all([
      prisma.region.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.joint.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.movement.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.muscle.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.functionalTask.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
      prisma.exercise.findMany({ where: { status: "needs_review" }, select: { slug: true, name: true, status: true, confidence: true } }),
    ]),
  ]);

  const typeLabels = ["region", "joint", "movement", "muscle", "task", "exercise"] as const;

  const formatItems = (arrays: any[][], label: string) =>
    arrays.flatMap((arr, i) =>
      arr.map((item: any) => ({ ...item, entityType: typeLabels[i], category: label }))
    );

  return {
    draft: formatItems(draftItems, "draft"),
    lowConfidence: formatItems(lowConfidenceItems, "low-confidence"),
    needsReview: formatItems(needsReviewItems, "needs-review"),
  };
}
