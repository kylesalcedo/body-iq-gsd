import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats — Database statistics for the knowledge graph
export async function GET() {
  const [
    regions,
    joints,
    movements,
    muscles,
    functionalTasks,
    exercises,
    sources,
    movementMuscleLinks,
    exerciseMuscleLinks,
    cues,
    regressions,
    progressions,
  ] = await Promise.all([
    prisma.region.count(),
    prisma.joint.count(),
    prisma.movement.count(),
    prisma.muscle.count(),
    prisma.functionalTask.count(),
    prisma.exercise.count(),
    prisma.researchSource.count(),
    prisma.movementMuscle.count(),
    prisma.exerciseMuscle.count(),
    prisma.cue.count(),
    prisma.regression.count(),
    prisma.progression.count(),
  ]);

  return NextResponse.json({
    data: {
      regions,
      joints,
      movements,
      muscles,
      functionalTasks,
      exercises,
      sources,
      relationships: {
        movementMuscleLinks,
        exerciseMuscleLinks,
        cues,
        regressions,
        progressions,
      },
    },
  });
}
