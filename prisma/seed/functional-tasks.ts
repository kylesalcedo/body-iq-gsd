import { prisma, logSection, logCount } from "./client";

interface TaskDef {
  slug: string;
  name: string;
  description: string;
  category: string;
  movementSlugs: { slug: string; relevance: string }[];
}

const tasks: TaskDef[] = [
  {
    slug: "reaching-overhead",
    name: "Reaching Overhead",
    description: "Reaching above shoulder height to retrieve or place objects. Requires full shoulder flexion/abduction and scapular upward rotation.",
    category: "ADL",
    movementSlugs: [
      { slug: "shoulder-flexion", relevance: "essential" },
      { slug: "shoulder-abduction", relevance: "essential" },
      { slug: "scapular-protraction", relevance: "supportive" },
    ],
  },
  {
    slug: "pushing-up-from-chair",
    name: "Pushing Up from Chair",
    description: "Using arms and legs to rise from a seated position. Requires hip/knee extension and may use shoulder extension for arm push.",
    category: "ADL",
    movementSlugs: [
      { slug: "hip-extension", relevance: "essential" },
      { slug: "knee-extension", relevance: "essential" },
      { slug: "shoulder-extension", relevance: "supportive" },
      { slug: "elbow-extension", relevance: "supportive" },
    ],
  },
  {
    slug: "gripping-cup",
    name: "Gripping a Cup",
    description: "Cylindrical grasp to hold a cup or glass. Requires finger flexion and wrist stability.",
    category: "ADL",
    movementSlugs: [
      { slug: "finger-flexion", relevance: "essential" },
      { slug: "wrist-extension", relevance: "supportive" },
    ],
  },
  {
    slug: "opening-jar",
    name: "Opening a Jar",
    description: "Gripping and twisting to open a jar lid. Requires grip strength, forearm pronation/supination, and wrist stability.",
    category: "ADL",
    movementSlugs: [
      { slug: "finger-flexion", relevance: "essential" },
      { slug: "forearm-supination", relevance: "essential" },
      { slug: "forearm-pronation", relevance: "essential" },
      { slug: "wrist-flexion", relevance: "supportive" },
    ],
  },
  {
    slug: "typing",
    name: "Typing",
    description: "Sustained keyboard use requiring finger dexterity, wrist stability, and forearm positioning.",
    category: "occupational",
    movementSlugs: [
      { slug: "finger-flexion", relevance: "essential" },
      { slug: "finger-extension", relevance: "essential" },
      { slug: "wrist-extension", relevance: "supportive" },
    ],
  },
  {
    slug: "walking",
    name: "Walking",
    description: "Bipedal locomotion requiring coordinated hip, knee, and ankle motion with core stability.",
    category: "mobility",
    movementSlugs: [
      { slug: "hip-flexion", relevance: "essential" },
      { slug: "hip-extension", relevance: "essential" },
      { slug: "knee-flexion", relevance: "essential" },
      { slug: "knee-extension", relevance: "essential" },
      { slug: "ankle-dorsiflexion", relevance: "essential" },
      { slug: "ankle-plantarflexion", relevance: "essential" },
    ],
  },
  {
    slug: "stair-climbing",
    name: "Stair Climbing",
    description: "Ascending stairs requiring hip/knee flexion-extension power and ankle push-off.",
    category: "mobility",
    movementSlugs: [
      { slug: "hip-flexion", relevance: "essential" },
      { slug: "hip-extension", relevance: "essential" },
      { slug: "knee-extension", relevance: "essential" },
      { slug: "ankle-plantarflexion", relevance: "essential" },
    ],
  },
  {
    slug: "squat-to-stand",
    name: "Squat to Stand",
    description: "Rising from a deep squat position. Compound movement requiring lower extremity strength and balance.",
    category: "mobility",
    movementSlugs: [
      { slug: "hip-extension", relevance: "essential" },
      { slug: "knee-extension", relevance: "essential" },
      { slug: "ankle-dorsiflexion", relevance: "essential" },
    ],
  },
  {
    slug: "breathing",
    name: "Breathing",
    description: "Normal and deep respiratory function. Requires diaphragmatic excursion, rib cage expansion, and thoracic mobility.",
    category: "ADL",
    movementSlugs: [
      { slug: "thoracic-extension", relevance: "supportive" },
      { slug: "thoracic-lateral-flexion", relevance: "supportive" },
    ],
  },
  {
    slug: "single-leg-balance",
    name: "Single-Leg Balance",
    description: "Maintaining balance on one leg. Requires hip abductor strength, ankle stability, and proprioceptive control.",
    category: "mobility",
    movementSlugs: [
      { slug: "hip-abduction", relevance: "essential" },
      { slug: "ankle-dorsiflexion", relevance: "supportive" },
      { slug: "foot-inversion", relevance: "supportive" },
      { slug: "foot-eversion", relevance: "supportive" },
    ],
  },
  {
    slug: "posture-maintenance",
    name: "Posture Maintenance",
    description: "Maintaining upright spinal alignment during prolonged sitting or standing. Requires endurance of postural muscles across the cervical, thoracic, and lumbar spine.",
    category: "occupational",
    movementSlugs: [
      { slug: "cervical-flexion-upper", relevance: "essential" },
      { slug: "thoracic-extension", relevance: "essential" },
      { slug: "scapular-retraction", relevance: "supportive" },
    ],
  },
];

export async function seedFunctionalTasks() {
  logSection("Functional Tasks");

  const movementMap = new Map<string, string>();
  const movs = await prisma.movement.findMany({ select: { id: true, slug: true } });
  for (const m of movs) movementMap.set(m.slug, m.id);

  for (const t of tasks) {
    const task = await prisma.functionalTask.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        category: t.category,
      },
      create: {
        slug: t.slug,
        name: t.name,
        description: t.description,
        category: t.category,
        status: "draft",
        confidence: 0.75,
      },
    });

    // Link movements
    for (const ms of t.movementSlugs) {
      const movementId = movementMap.get(ms.slug);
      if (!movementId) throw new Error(`Movement not found: ${ms.slug}`);
      await prisma.movementFunctionalTask.upsert({
        where: { movementId_functionalTaskId: { movementId, functionalTaskId: task.id } },
        update: { relevance: ms.relevance },
        create: { movementId, functionalTaskId: task.id, relevance: ms.relevance },
      });
    }
  }

  logCount("functional tasks", tasks.length);
}
