import { prisma, logSection, logCount } from "./client";

interface MovementDef {
  slug: string;
  name: string;
  description: string;
  plane: string | null;
  axis: string | null;
  jointSlug: string;
}

const movements: MovementDef[] = [
  // ── Glenohumeral ──────────────────────────────────────────────────────────
  {
    slug: "shoulder-flexion",
    name: "Shoulder Flexion",
    description: "Elevation of the arm anteriorly in the sagittal plane.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-extension",
    name: "Shoulder Extension",
    description: "Movement of the arm posteriorly in the sagittal plane.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-abduction",
    name: "Shoulder Abduction",
    description: "Elevation of the arm laterally in the frontal plane.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-adduction",
    name: "Shoulder Adduction",
    description: "Return of the arm toward the body in the frontal plane.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-internal-rotation",
    name: "Shoulder Internal Rotation",
    description: "Rotation of the humerus medially about its longitudinal axis.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-external-rotation",
    name: "Shoulder External Rotation",
    description: "Rotation of the humerus laterally about its longitudinal axis.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "glenohumeral",
  },
  // ── Scapulothoracic ───────────────────────────────────────────────────────
  {
    slug: "scapular-protraction",
    name: "Scapular Protraction",
    description: "Forward movement of the scapula around the thorax (abduction).",
    plane: "transverse",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  {
    slug: "scapular-retraction",
    name: "Scapular Retraction",
    description: "Backward movement of the scapula toward the spine (adduction).",
    plane: "transverse",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  // ── Humeroulnar ───────────────────────────────────────────────────────────
  {
    slug: "elbow-flexion",
    name: "Elbow Flexion",
    description: "Decreasing the angle between the forearm and upper arm.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "humeroulnar",
  },
  {
    slug: "elbow-extension",
    name: "Elbow Extension",
    description: "Increasing the angle between the forearm and upper arm.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "humeroulnar",
  },
  // ── Proximal Radioulnar ───────────────────────────────────────────────────
  {
    slug: "forearm-pronation",
    name: "Forearm Pronation",
    description: "Rotation of the forearm so the palm faces posteriorly (or downward).",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "proximal-radioulnar",
  },
  {
    slug: "forearm-supination",
    name: "Forearm Supination",
    description: "Rotation of the forearm so the palm faces anteriorly (or upward).",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "proximal-radioulnar",
  },
  // ── Radiocarpal ───────────────────────────────────────────────────────────
  {
    slug: "wrist-flexion",
    name: "Wrist Flexion",
    description: "Bending the wrist so the palm approaches the forearm.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "radiocarpal",
  },
  {
    slug: "wrist-extension",
    name: "Wrist Extension",
    description: "Bending the wrist so the dorsum approaches the forearm.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "radiocarpal",
  },
  {
    slug: "radial-deviation",
    name: "Radial Deviation",
    description: "Lateral movement of the wrist toward the radius (thumb side).",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "radiocarpal",
  },
  {
    slug: "ulnar-deviation",
    name: "Ulnar Deviation",
    description: "Medial movement of the wrist toward the ulna (pinky side).",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "radiocarpal",
  },
  // ── MCP ───────────────────────────────────────────────────────────────────
  {
    slug: "finger-flexion",
    name: "Finger Flexion (MCP)",
    description: "Bending the fingers at the metacarpophalangeal joints.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "mcp",
  },
  {
    slug: "finger-extension",
    name: "Finger Extension (MCP)",
    description: "Straightening the fingers at the metacarpophalangeal joints.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "mcp",
  },
  // ── First CMC (Thumb) ─────────────────────────────────────────────────────
  {
    slug: "thumb-opposition",
    name: "Thumb Opposition",
    description: "Complex movement bringing the thumb pad to contact the finger pads.",
    plane: null,
    axis: null,
    jointSlug: "first-cmc",
  },
  // ── Coxofemoral (Hip) ─────────────────────────────────────────────────────
  {
    slug: "hip-flexion",
    name: "Hip Flexion",
    description: "Bringing the thigh anteriorly toward the trunk in the sagittal plane.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "coxofemoral",
  },
  {
    slug: "hip-extension",
    name: "Hip Extension",
    description: "Moving the thigh posteriorly in the sagittal plane.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "coxofemoral",
  },
  {
    slug: "hip-abduction",
    name: "Hip Abduction",
    description: "Moving the thigh laterally away from midline in the frontal plane.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "coxofemoral",
  },
  {
    slug: "hip-adduction",
    name: "Hip Adduction",
    description: "Moving the thigh medially toward midline in the frontal plane.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "coxofemoral",
  },
  {
    slug: "hip-internal-rotation",
    name: "Hip Internal Rotation",
    description: "Rotation of the femur medially about its longitudinal axis.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "coxofemoral",
  },
  {
    slug: "hip-external-rotation",
    name: "Hip External Rotation",
    description: "Rotation of the femur laterally about its longitudinal axis.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "coxofemoral",
  },
  // ── Tibiofemoral (Knee) ───────────────────────────────────────────────────
  {
    slug: "knee-flexion",
    name: "Knee Flexion",
    description: "Bending the knee, decreasing the angle between the leg and thigh.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "tibiofemoral",
  },
  {
    slug: "knee-extension",
    name: "Knee Extension",
    description: "Straightening the knee, increasing the angle between the leg and thigh.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "tibiofemoral",
  },
  // ── Talocrural (Ankle) ────────────────────────────────────────────────────
  {
    slug: "ankle-dorsiflexion",
    name: "Ankle Dorsiflexion",
    description: "Bringing the dorsum of the foot toward the shin.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "talocrural",
  },
  {
    slug: "ankle-plantarflexion",
    name: "Ankle Plantarflexion",
    description: "Pointing the foot downward, away from the shin.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "talocrural",
  },
  // ── Subtalar ──────────────────────────────────────────────────────────────
  {
    slug: "foot-inversion",
    name: "Foot Inversion",
    description: "Turning the sole of the foot medially (inward).",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "subtalar",
  },
  {
    slug: "foot-eversion",
    name: "Foot Eversion",
    description: "Turning the sole of the foot laterally (outward).",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "subtalar",
  },
];

export async function seedMovements() {
  logSection("Movements");

  const jointMap = new Map<string, string>();
  const joints = await prisma.joint.findMany({ select: { id: true, slug: true } });
  for (const j of joints) jointMap.set(j.slug, j.id);

  for (const m of movements) {
    const jointId = jointMap.get(m.jointSlug);
    if (!jointId) throw new Error(`Joint not found: ${m.jointSlug}`);
    await prisma.movement.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        description: m.description,
        plane: m.plane,
        axis: m.axis,
        jointId,
      },
      create: {
        slug: m.slug,
        name: m.name,
        description: m.description,
        plane: m.plane,
        axis: m.axis,
        jointId,
        status: "draft",
        confidence: 0.8,
      },
    });
  }

  logCount("movements", movements.length);
}
