import { prisma, logSection, logCount } from "./client";

interface JointDef {
  slug: string;
  name: string;
  description: string;
  jointType: string;
  regionSlug: string;
}

const joints: JointDef[] = [
  // Cervical Spine
  {
    slug: "atlantooccipital",
    name: "Atlantooccipital Joint",
    description: "Condyloid joint between the atlas (C1) and the occipital condyles of the skull. Primary joint for head flexion/extension (nodding).",
    jointType: "condyloid",
    regionSlug: "cervical-spine",
  },
  {
    slug: "atlantoaxial",
    name: "Atlantoaxial Joint",
    description: "Pivot joint between the atlas (C1) and axis (C2). Primary joint for cervical rotation (head turning).",
    jointType: "pivot",
    regionSlug: "cervical-spine",
  },
  {
    slug: "cervical-intervertebral",
    name: "Cervical Intervertebral Joints (C2-C7)",
    description: "Facet joints and intervertebral discs of the lower cervical spine. Allow flexion, extension, lateral flexion, and rotation.",
    jointType: "gliding",
    regionSlug: "cervical-spine",
  },
  // Thoracic Spine
  {
    slug: "thoracic-intervertebral",
    name: "Thoracic Intervertebral Joints",
    description: "Facet joints and intervertebral discs of the thoracic spine (T1-T12). Primarily rotational with limited sagittal motion due to rib cage.",
    jointType: "gliding",
    regionSlug: "thoracic-spine",
  },
  {
    slug: "costovertebral",
    name: "Costovertebral Joints",
    description: "Joints between the ribs and thoracic vertebrae. Important for breathing mechanics and thoracic mobility.",
    jointType: "gliding",
    regionSlug: "thoracic-spine",
  },
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
    slug: "pip",
    name: "Proximal Interphalangeal Joints",
    description: "Hinge joints between proximal and middle phalanges of fingers 2-5. Allow flexion and extension only.",
    jointType: "hinge",
    regionSlug: "hand",
  },
  {
    slug: "dip",
    name: "Distal Interphalangeal Joints",
    description: "Hinge joints between middle and distal phalanges of fingers 2-5. Allow flexion and extension only.",
    jointType: "hinge",
    regionSlug: "hand",
  },
  {
    slug: "first-cmc",
    name: "First Carpometacarpal Joint",
    description: "Saddle joint of the thumb between the trapezium and first metacarpal. Allows opposition, flexion, extension, abduction, adduction.",
    jointType: "saddle",
    regionSlug: "hand",
  },
  {
    slug: "thumb-mcp",
    name: "Thumb Metacarpophalangeal Joint",
    description: "Condyloid joint of the thumb between the first metacarpal and proximal phalanx. Allows flexion, extension, and limited abduction/adduction.",
    jointType: "condyloid",
    regionSlug: "hand",
  },
  {
    slug: "thumb-ip",
    name: "Thumb Interphalangeal Joint",
    description: "Hinge joint between the proximal and distal phalanges of the thumb. Allows flexion and extension only.",
    jointType: "hinge",
    regionSlug: "hand",
  },
  // Lumbar Spine
  {
    slug: "lumbar-intervertebral",
    name: "Lumbar Intervertebral Joints",
    description: "Facet joints and intervertebral discs of the lumbar spine (L1-L5). Allow significant flexion/extension and lateral flexion, limited rotation.",
    jointType: "gliding",
    regionSlug: "lumbar-spine",
  },
  {
    slug: "lumbosacral",
    name: "Lumbosacral Joint (L5-S1)",
    description: "Junction between the lumbar spine and sacrum. High load-bearing joint, common site of disc pathology.",
    jointType: "gliding",
    regionSlug: "lumbar-spine",
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
