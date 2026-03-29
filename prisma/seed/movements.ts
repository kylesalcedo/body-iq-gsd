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
  // ── Atlantooccipital ──────────────────────────────────────────────────────
  {
    slug: "cervical-flexion-upper",
    name: "Upper Cervical Flexion",
    description: "Nodding motion — chin tuck. Flexion at the atlantooccipital joint.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "atlantooccipital",
  },
  {
    slug: "cervical-extension-upper",
    name: "Upper Cervical Extension",
    description: "Looking up at the atlanto-occipital joint. Chin poke motion.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "atlantooccipital",
  },
  // ── Atlantoaxial ──────────────────────────────────────────────────────────
  {
    slug: "cervical-rotation-upper",
    name: "Upper Cervical Rotation",
    description: "Head turning at C1-C2. Approximately 50% of total cervical rotation occurs here.",
    plane: "transverse",
    axis: "vertical",
    jointSlug: "atlantoaxial",
  },
  // ── Cervical Intervertebral ───────────────────────────────────────────────
  {
    slug: "cervical-flexion",
    name: "Cervical Flexion",
    description: "Bending the neck forward, bringing the chin toward the chest. Combined motion of C2-C7.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "cervical-intervertebral",
  },
  {
    slug: "cervical-extension",
    name: "Cervical Extension",
    description: "Bending the neck backward, looking upward. Combined motion of C2-C7.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "cervical-intervertebral",
  },
  {
    slug: "cervical-lateral-flexion",
    name: "Cervical Lateral Flexion",
    description: "Tilting the head/neck to the side, ear toward shoulder.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "cervical-intervertebral",
  },
  {
    slug: "cervical-rotation",
    name: "Cervical Rotation",
    description: "Turning the head to look over the shoulder. Combined rotation of C2-C7.",
    plane: "transverse",
    axis: "vertical",
    jointSlug: "cervical-intervertebral",
  },
  // ── Thoracic Intervertebral ───────────────────────────────────────────────
  {
    slug: "thoracic-rotation",
    name: "Thoracic Rotation",
    description: "Rotation of the trunk through the thoracic spine. Most rotational motion of the spine occurs here.",
    plane: "transverse",
    axis: "vertical",
    jointSlug: "thoracic-intervertebral",
  },
  {
    slug: "thoracic-extension",
    name: "Thoracic Extension",
    description: "Extension of the thoracic spine. Often limited by kyphosis and rib cage. Critical for overhead reaching.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thoracic-intervertebral",
  },
  {
    slug: "thoracic-flexion",
    name: "Thoracic Flexion",
    description: "Flexion (rounding) of the thoracic spine. Kyphotic motion.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thoracic-intervertebral",
  },
  {
    slug: "thoracic-lateral-flexion",
    name: "Thoracic Lateral Flexion",
    description: "Side bending of the thoracic spine. Coupled with rotation.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "thoracic-intervertebral",
  },
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
  {
    slug: "scapular-upward-rotation",
    name: "Scapular Upward Rotation",
    description: "Rotation of the scapula so the glenoid faces upward. Essential for overhead arm elevation.",
    plane: "frontal",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  {
    slug: "scapular-depression",
    name: "Scapular Depression",
    description: "Downward movement of the scapula away from the ears.",
    plane: "frontal",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  {
    slug: "scapular-elevation",
    name: "Scapular Elevation",
    description: "Upward movement of the scapula toward the ears (shoulder shrug).",
    plane: "frontal",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  {
    slug: "scapular-downward-rotation",
    name: "Scapular Downward Rotation",
    description: "Rotation of the scapula so the glenoid faces downward. Return from upward rotation.",
    plane: "frontal",
    axis: null,
    jointSlug: "scapulothoracic",
  },
  // ── Glenohumeral — Horizontal Plane ───────────────────────────────────────
  {
    slug: "shoulder-horizontal-adduction",
    name: "Shoulder Horizontal Adduction",
    description: "Movement of the arm across the body in the transverse plane from an abducted position.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "glenohumeral",
  },
  {
    slug: "shoulder-horizontal-abduction",
    name: "Shoulder Horizontal Abduction",
    description: "Movement of the arm away from the body in the transverse plane from a flexed or horizontally adducted position.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "glenohumeral",
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
  {
    slug: "finger-abduction",
    name: "Finger Abduction (MCP)",
    description: "Spreading the fingers apart at the metacarpophalangeal joints.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "mcp",
  },
  {
    slug: "finger-adduction",
    name: "Finger Adduction (MCP)",
    description: "Bringing the fingers together at the metacarpophalangeal joints.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "mcp",
  },
  // ── PIP ───────────────────────────────────────────────────────────────────
  {
    slug: "pip-flexion",
    name: "Finger Flexion (PIP)",
    description: "Bending the fingers at the proximal interphalangeal joints. Main power grip joint.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "pip",
  },
  {
    slug: "pip-extension",
    name: "Finger Extension (PIP)",
    description: "Straightening the fingers at the proximal interphalangeal joints.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "pip",
  },
  // ── DIP ───────────────────────────────────────────────────────────────────
  {
    slug: "dip-flexion",
    name: "Finger Flexion (DIP)",
    description: "Bending the fingers at the distal interphalangeal joints. Fine pinch control.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "dip",
  },
  {
    slug: "dip-extension",
    name: "Finger Extension (DIP)",
    description: "Straightening the fingers at the distal interphalangeal joints.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "dip",
  },
  // ── First CMC (Thumb) ─────────────────────────────────────────────────────
  {
    slug: "thumb-opposition",
    name: "Thumb Opposition",
    description: "Complex movement bringing the thumb pad to contact the finger pads. Combines flexion, abduction, and medial rotation.",
    plane: null,
    axis: null,
    jointSlug: "first-cmc",
  },
  {
    slug: "thumb-abduction",
    name: "Thumb Abduction",
    description: "Moving the thumb away from the palm in a plane perpendicular to the palm.",
    plane: "sagittal",
    axis: null,
    jointSlug: "first-cmc",
  },
  {
    slug: "thumb-adduction",
    name: "Thumb Adduction",
    description: "Moving the thumb back toward the palm from an abducted position.",
    plane: "sagittal",
    axis: null,
    jointSlug: "first-cmc",
  },
  // ── Thumb MCP ─────────────────────────────────────────────────────────────
  {
    slug: "thumb-mcp-flexion",
    name: "Thumb Flexion (MCP)",
    description: "Bending the thumb at the metacarpophalangeal joint.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thumb-mcp",
  },
  {
    slug: "thumb-mcp-extension",
    name: "Thumb Extension (MCP)",
    description: "Straightening the thumb at the metacarpophalangeal joint.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thumb-mcp",
  },
  // ── Thumb IP ──────────────────────────────────────────────────────────────
  {
    slug: "thumb-ip-flexion",
    name: "Thumb Flexion (IP)",
    description: "Bending the thumb at the interphalangeal joint. Final joint for pinch.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thumb-ip",
  },
  {
    slug: "thumb-ip-extension",
    name: "Thumb Extension (IP)",
    description: "Straightening the thumb at the interphalangeal joint.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "thumb-ip",
  },
  // ── Lumbar Intervertebral ──────────────────────────────────────────────────
  {
    slug: "lumbar-flexion",
    name: "Lumbar Flexion",
    description: "Forward bending of the lumbar spine. Primary trunk flexion movement.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "lumbar-intervertebral",
  },
  {
    slug: "lumbar-extension",
    name: "Lumbar Extension",
    description: "Backward bending of the lumbar spine. Arching the low back.",
    plane: "sagittal",
    axis: "medial-lateral",
    jointSlug: "lumbar-intervertebral",
  },
  {
    slug: "lumbar-lateral-flexion",
    name: "Lumbar Lateral Flexion",
    description: "Side bending of the lumbar spine.",
    plane: "frontal",
    axis: "anterior-posterior",
    jointSlug: "lumbar-intervertebral",
  },
  {
    slug: "lumbar-rotation",
    name: "Lumbar Rotation",
    description: "Rotation of the lumbar spine. Very limited (~5° per segment) due to facet orientation.",
    plane: "transverse",
    axis: "vertical",
    jointSlug: "lumbar-intervertebral",
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
  {
    slug: "knee-internal-rotation",
    name: "Knee Internal Rotation",
    description: "Internal rotation of the tibia on the femur. Occurs primarily with the knee flexed. Popliteus initiates 'unlocking' of the knee from full extension.",
    plane: "transverse",
    axis: "longitudinal",
    jointSlug: "tibiofemoral",
  },
  {
    slug: "knee-external-rotation",
    name: "Knee External Rotation",
    description: "External rotation of the tibia on the femur. Occurs primarily with the knee flexed. Biceps femoris is the primary external rotator.",
    plane: "transverse",
    axis: "longitudinal",
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
