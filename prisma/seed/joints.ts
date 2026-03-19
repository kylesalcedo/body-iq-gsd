import { prisma, logSection, logCount } from "./client";

interface JointDef {
  slug: string;
  name: string;
  description: string;
  jointType: string;
  regionSlug: string;
}

const joints: JointDef[] = [
  // Shoulder
  {
    slug: "glenohumeral",
    name: "Glenohumeral Joint",
    description: "Ball-and-socket joint between the humeral head and glenoid fossa of the scapula. Primary joint for shoulder motion.",
    jointType: "ball-and-socket",
    regionSlug: "shoulder",
  },
  {
    slug: "acromioclavicular",
    name: "Acromioclavicular Joint",
    description: "Gliding joint between the acromion of the scapula and the lateral end of the clavicle.",
    jointType: "gliding",
    regionSlug: "shoulder",
  },
  {
    slug: "scapulothoracic",
    name: "Scapulothoracic Articulation",
    description: "Functional articulation (not a true synovial joint) between the scapula and thoracic wall. Critical for overhead motion.",
    jointType: "functional",
    regionSlug: "shoulder",
  },
  // Elbow
  {
    slug: "humeroulnar",
    name: "Humeroulnar Joint",
    description: "Hinge joint between the trochlea of the humerus and the trochlear notch of the ulna. Primary joint for elbow flexion/extension.",
    jointType: "hinge",
    regionSlug: "elbow",
  },
  {
    slug: "proximal-radioulnar",
    name: "Proximal Radioulnar Joint",
    description: "Pivot joint between the radial head and the radial notch of the ulna. Allows pronation and supination.",
    jointType: "pivot",
    regionSlug: "elbow",
  },
  // Wrist
  {
    slug: "radiocarpal",
    name: "Radiocarpal Joint",
    description: "Condyloid joint between the distal radius and the proximal carpal row. Primary joint for wrist motion.",
    jointType: "condyloid",
    regionSlug: "wrist",
  },
  // Hand
  {
    slug: "mcp",
    name: "Metacarpophalangeal Joints",
    description: "Condyloid joints between the metacarpal heads and proximal phalanges. Allow flexion, extension, abduction, adduction.",
    jointType: "condyloid",
    regionSlug: "hand",
  },
  {
    slug: "first-cmc",
    name: "First Carpometacarpal Joint",
    description: "Saddle joint of the thumb between the trapezium and first metacarpal. Allows opposition.",
    jointType: "saddle",
    regionSlug: "hand",
  },
  // Hip
  {
    slug: "coxofemoral",
    name: "Hip Joint (Coxofemoral)",
    description: "Ball-and-socket joint between the femoral head and the acetabulum of the pelvis. Major weight-bearing joint.",
    jointType: "ball-and-socket",
    regionSlug: "hip",
  },
  // Knee
  {
    slug: "tibiofemoral",
    name: "Tibiofemoral Joint",
    description: "Modified hinge joint between the femoral condyles and tibial plateau. Primary joint for knee flexion/extension.",
    jointType: "hinge",
    regionSlug: "knee",
  },
  {
    slug: "patellofemoral",
    name: "Patellofemoral Joint",
    description: "Gliding joint between the patella and the femoral trochlea. Important for quadriceps mechanics.",
    jointType: "gliding",
    regionSlug: "knee",
  },
  // Ankle
  {
    slug: "talocrural",
    name: "Talocrural Joint",
    description: "Hinge joint between the tibia/fibula and the talus. Primary joint for dorsiflexion and plantarflexion.",
    jointType: "hinge",
    regionSlug: "ankle",
  },
  {
    slug: "subtalar",
    name: "Subtalar Joint",
    description: "Joint between the talus and calcaneus. Allows inversion and eversion of the foot.",
    jointType: "gliding",
    regionSlug: "ankle",
  },
];

export async function seedJoints() {
  logSection("Joints");

  const regionMap = new Map<string, string>();
  const regions = await prisma.region.findMany({ select: { id: true, slug: true } });
  for (const r of regions) regionMap.set(r.slug, r.id);

  for (const j of joints) {
    const regionId = regionMap.get(j.regionSlug);
    if (!regionId) throw new Error(`Region not found: ${j.regionSlug}`);
    await prisma.joint.upsert({
      where: { slug: j.slug },
      update: {
        name: j.name,
        description: j.description,
        jointType: j.jointType,
        regionId,
      },
      create: {
        slug: j.slug,
        name: j.name,
        description: j.description,
        jointType: j.jointType,
        regionId,
        status: "draft",
        confidence: 0.8,
      },
    });
  }

  logCount("joints", joints.length);
}
