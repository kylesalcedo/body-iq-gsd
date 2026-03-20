import { prisma, logSection, logCount } from "./client";

export async function seedRegions() {
  logSection("Regions");

  // Ordered top-to-bottom anatomically
  const regions = [
    {
      slug: "cervical-spine",
      name: "Cervical Spine",
      description: "The cervical vertebral column (C1-C7) including the atlantooccipital and atlantoaxial joints. Controls head and neck movement.",
      status: "draft" as const,
      confidence: 0.8,
      sortOrder: 10,
    },
    {
      slug: "thoracic-spine",
      name: "Thoracic Spine",
      description: "The thoracic vertebral column (T1-T12) and costovertebral joints. Primarily rotational movement with limited flexion/extension.",
      status: "draft" as const,
      confidence: 0.8,
      sortOrder: 20,
    },
    {
      slug: "shoulder",
      name: "Shoulder",
      description: "The shoulder complex including the glenohumeral, acromioclavicular, sternoclavicular, and scapulothoracic articulations.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 30,
    },
    {
      slug: "elbow",
      name: "Elbow",
      description: "The elbow complex including the humeroulnar, humeroradial, and proximal radioulnar joints.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 40,
    },
    {
      slug: "wrist",
      name: "Wrist",
      description: "The wrist complex including the radiocarpal and midcarpal joints.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 50,
    },
    {
      slug: "hand",
      name: "Hand",
      description: "The hand including carpometacarpal, metacarpophalangeal, and interphalangeal joints.",
      status: "draft" as const,
      confidence: 0.8,
      sortOrder: 60,
    },
    {
      slug: "lumbar-spine",
      name: "Lumbar Spine",
      description: "The lumbar vertebral column (L1-L5). Primary mover for trunk flexion/extension and lateral flexion.",
      status: "draft" as const,
      confidence: 0.8,
      sortOrder: 70,
    },
    {
      slug: "hip",
      name: "Hip",
      description: "The hip joint (coxofemoral joint), a ball-and-socket synovial joint.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 80,
    },
    {
      slug: "knee",
      name: "Knee",
      description: "The knee complex including the tibiofemoral and patellofemoral joints.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 90,
    },
    {
      slug: "ankle",
      name: "Ankle",
      description: "The ankle complex including the talocrural and subtalar joints.",
      status: "draft" as const,
      confidence: 0.85,
      sortOrder: 100,
    },
  ];

  for (const r of regions) {
    await prisma.region.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }

  logCount("regions", regions.length);
  return regions;
}
