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

  // Wire sources broadly to entities
  logSection("Source–Entity links");
  const neumannSource = await prisma.researchSource.findUnique({ where: { slug: "neumann-kinesiology-2017" } });
  const kendallSource = await prisma.researchSource.findUnique({ where: { slug: "kendall-muscles-2005" } });
  const kisnerSource = await prisma.researchSource.findUnique({ where: { slug: "kisner-therapeutic-2017" } });
  const mageeSource = await prisma.researchSource.findUnique({ where: { slug: "magee-orthopedic-2014" } });
  const acsmSource = await prisma.researchSource.findUnique({ where: { slug: "acsm-guidelines-2021" } });

  async function linkSource(sourceId: string, entityType: string, entityId: string, field: string, notes: string) {
    const existing = await prisma.sourceOnEntity.findFirst({
      where: { sourceId, [field]: entityId },
    });
    if (!existing) {
      await prisma.sourceOnEntity.create({
        data: { entityType, [field]: entityId, sourceId, notes },
      });
    }
  }

  let count = 0;

  if (neumannSource) {
    // Neumann covers all muscles, movements, and regions
    const allMuscles = await prisma.muscle.findMany();
    for (const m of allMuscles) { await linkSource(neumannSource.id, "Muscle", m.id, "muscleId", "Anatomy reference"); count++; }
    const allMovements = await prisma.movement.findMany();
    for (const m of allMovements) { await linkSource(neumannSource.id, "Movement", m.id, "movementId", "Biomechanics reference"); count++; }
    const allRegions = await prisma.region.findMany();
    for (const r of allRegions) { await linkSource(neumannSource.id, "Region", r.id, "regionId", "Regional anatomy reference"); count++; }
  }

  if (kendallSource) {
    // Kendall covers all muscles (testing reference)
    const allMuscles = await prisma.muscle.findMany();
    for (const m of allMuscles) { await linkSource(kendallSource.id, "Muscle", m.id, "muscleId", "Muscle testing reference"); count++; }
  }

  if (kisnerSource) {
    // Kisner covers all exercises
    const allExercises = await prisma.exercise.findMany();
    for (const e of allExercises) { await linkSource(kisnerSource.id, "Exercise", e.id, "exerciseId", "Exercise technique reference"); count++; }
  }

  if (mageeSource) {
    // Magee covers all joints
    const allJoints = await prisma.joint.findMany();
    for (const j of allJoints) { await linkSource(mageeSource.id, "Joint", j.id, "jointId", "Joint assessment reference"); count++; }
  }

  if (acsmSource) {
    // ACSM covers all exercises (prescription guidelines)
    const allExercises = await prisma.exercise.findMany();
    for (const e of allExercises) { await linkSource(acsmSource.id, "Exercise", e.id, "exerciseId", "Exercise prescription guidelines"); count++; }
  }

  logCount("source–entity links", count);
}
