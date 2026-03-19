import { prisma, logSection, logCount } from "./client";

export async function seedSources() {
  logSection("Research Sources");

  const sources = [
    {
      slug: "neumann-kinesiology-2017",
      title: "Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation",
      authors: "Neumann DA",
      year: 2017,
      sourceType: "textbook",
      description: "Comprehensive kinesiology textbook widely used in PT education. Covers detailed musculoskeletal anatomy and biomechanics.",
      confidence: 0.95,
    },
    {
      slug: "kendall-muscles-2005",
      title: "Muscles: Testing and Function with Posture and Pain",
      authors: "Kendall FP, McCreary EK, Provance PG, Rodgers MM, Romani WA",
      year: 2005,
      sourceType: "textbook",
      description: "Classic reference for manual muscle testing, muscle anatomy, and postural assessment.",
      confidence: 0.9,
    },
    {
      slug: "magee-orthopedic-2014",
      title: "Orthopedic Physical Assessment",
      authors: "Magee DJ",
      year: 2014,
      sourceType: "textbook",
      description: "Standard reference for orthopedic assessment techniques and clinical reasoning in PT.",
      confidence: 0.9,
    },
    {
      slug: "kisner-therapeutic-2017",
      title: "Therapeutic Exercise: Foundations and Techniques",
      authors: "Kisner C, Colby LA, Borstad J",
      year: 2017,
      sourceType: "textbook",
      description: "Foundational text on therapeutic exercise prescription, progressions, and clinical application.",
      confidence: 0.9,
    },
    {
      slug: "acsm-guidelines-2021",
      title: "ACSM's Guidelines for Exercise Testing and Prescription",
      authors: "American College of Sports Medicine",
      year: 2021,
      sourceType: "guideline",
      description: "Evidence-based guidelines for exercise prescription across healthy and clinical populations.",
      confidence: 0.9,
    },
  ];

  for (const s of sources) {
    await prisma.researchSource.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        authors: s.authors,
        year: s.year,
        sourceType: s.sourceType,
        description: s.description,
        confidence: s.confidence,
      },
      create: {
        slug: s.slug,
        title: s.title,
        authors: s.authors,
        year: s.year,
        sourceType: s.sourceType,
        description: s.description,
        status: "reviewed",
        confidence: s.confidence,
      },
    });
  }

  logCount("sources", sources.length);

  // Wire some sources to entities as examples
  logSection("Source–Entity links");
  const neumannSource = await prisma.researchSource.findUnique({ where: { slug: "neumann-kinesiology-2017" } });
  const kisnerSource = await prisma.researchSource.findUnique({ where: { slug: "kisner-therapeutic-2017" } });

  if (neumannSource) {
    // Link Neumann to a few muscles
    const keyMuscles = await prisma.muscle.findMany({
      where: { slug: { in: ["infraspinatus", "gluteus-maximus", "quadriceps"] } },
    });
    for (const m of keyMuscles) {
      const existing = await prisma.sourceOnEntity.findFirst({
        where: { sourceId: neumannSource.id, muscleId: m.id },
      });
      if (!existing) {
        await prisma.sourceOnEntity.create({
          data: {
            entityType: "Muscle",
            muscleId: m.id,
            sourceId: neumannSource.id,
            notes: "Anatomy reference",
          },
        });
      }
    }
    logCount("Neumann→muscle links", keyMuscles.length);
  }

  if (kisnerSource) {
    // Link Kisner to a few exercises
    const keyExercises = await prisma.exercise.findMany({
      where: { slug: { in: ["bridge", "squat", "sit-to-stand"] } },
    });
    for (const e of keyExercises) {
      const existing = await prisma.sourceOnEntity.findFirst({
        where: { sourceId: kisnerSource.id, exerciseId: e.id },
      });
      if (!existing) {
        await prisma.sourceOnEntity.create({
          data: {
            entityType: "Exercise",
            exerciseId: e.id,
            sourceId: kisnerSource.id,
            notes: "Exercise technique reference",
          },
        });
      }
    }
    logCount("Kisner→exercise links", keyExercises.length);
  }
}
