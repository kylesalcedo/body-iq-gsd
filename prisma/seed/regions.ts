import { prisma, logSection, logCount } from "./client";

export async function seedRegions() {
  logSection("Regions");

  const regions = [
    {
      slug: "shoulder",
      name: "Shoulder",
      description: "The shoulder complex including the glenohumeral, acromioclavicular, sternoclavicular, and scapulothoracic articulations.",
      status: "draft" as const,
      confidence: 0.85,
    },
    {
      slug: "elbow",
      name: "Elbow",
      description: "The elbow complex including the humeroulnar, humeroradial, and proximal radioulnar joints.",
      status: "draft" as const,
      confidence: 0.85,
    },
    {
      slug: "wrist",
      name: "Wrist",
      description: "The wrist complex including the radiocarpal and midcarpal joints.",
      status: "draft" as const,
      confidence: 0.85,
    },
    {
      slug: "hand",
      name: "Hand",
      description: "The hand including carpometacarpal, metacarpophalangeal, and interphalangeal joints.",
      status: "draft" as const,
      confidence: 0.8,
    },
    {
      slug: "hip",
      name: "Hip",
      description: "The hip joint (coxofemoral joint), a ball-and-socket synovial joint.",
      status: "draft" as const,
      confidence: 0.85,
    },
    {
      slug: "knee",
      name: "Knee",
      description: "The knee complex including the tibiofemoral and patellofemoral joints.",
      status: "draft" as const,
      confidence: 0.85,
    },
    {
      slug: "ankle",
      name: "Ankle",
      description: "The ankle complex including the talocrural and subtalar joints.",
      status: "draft" as const,
      confidence: 0.85,
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
