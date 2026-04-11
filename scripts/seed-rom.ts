/**
 * Seed / update Movement.aromMin/aromMax/promMin/promMax/romNotes/romSource
 * with published normal Range-of-Motion values.
 *
 * Primary reference: American Academy of Orthopaedic Surgeons (AAOS) Joint
 * Motion: Method of Measuring and Recording. Supplemental references noted
 * per-movement (Norkin & White 2016, Bogduk & Mercer 2000, Ludewig & Reynolds
 * 2009, Kibler & Sciascia 2010).
 *
 * Conventions:
 *   - Cardinal movements start from anatomical neutral (aromMin/promMin = 0).
 *   - AROM values reflect standard goniometric measurement from published norms.
 *   - PROM is populated separately only when published PROM > AROM (e.g. knee
 *     flexion AROM 135° / PROM 150°). Otherwise PROM defaults to AROM because
 *     no standard published reference distinguishes them for that movement.
 *   - Scapular translations (elevation/depression/protraction/retraction) and
 *     thumb opposition are NOT measured in degrees — romNotes describes the
 *     clinical measurement approach and the integer fields are null.
 *
 * Run:
 *   npx tsx scripts/seed-rom.ts
 *
 * This script is idempotent — running it again overwrites ROM fields with
 * the canonical values defined below.
 */

import { prisma } from "../src/lib/prisma";

type RomEntry = {
  aromMin?: number;
  aromMax?: number;
  promMin?: number;
  promMax?: number;
  unit?: string; // defaults to "degrees"
  notes?: string;
  source: string;
};

const AAOS = "AAOS Joint Motion Method of Measuring and Recording";
const NORKIN = "Norkin & White 2016 (Measurement of Joint Motion, 5th ed.)";
const BOGDUK = "Bogduk & Mercer 2000 (Biomechanics of the cervical spine)";
const LUDEWIG = "Ludewig & Reynolds 2009 (Shoulder kinematics)";
const KIBLER = "Kibler & Sciascia 2010 (Scapular dyskinesis)";

const ROM: Record<string, RomEntry> = {
  // ─── Cervical Spine ────────────────────────────────────────────────────
  "cervical-flexion": {
    aromMin: 0, aromMax: 45, promMin: 0, promMax: 50,
    source: AAOS,
    notes: "Measured in upright sitting with goniometer or inclinometer. Chin-to-chest distance often used functionally.",
  },
  "cervical-extension": {
    aromMin: 0, aromMax: 45, promMin: 0, promMax: 55,
    source: AAOS,
    notes: "Wide individual variation; reported norms range 40-85°. Hypermobility common.",
  },
  "cervical-lateral-flexion": {
    aromMin: 0, aromMax: 45, promMin: 0, promMax: 45,
    source: AAOS,
    notes: "Per side. Ear to shoulder without ipsilateral shoulder elevation.",
  },
  "cervical-rotation": {
    aromMin: 0, aromMax: 60, promMin: 0, promMax: 80,
    source: `${AAOS} / ${NORKIN}`,
    notes: "Per side. AAOS gives 60°, Norkin gives 80°. ~50% of total cervical rotation occurs at C1-C2.",
  },

  // ─── Upper Cervical (Craniocervical junction) ──────────────────────────
  "cervical-flexion-upper": {
    aromMin: 0, aromMax: 10,
    promMin: 0, promMax: 10,
    source: BOGDUK,
    notes: "Segmental C0-C1/C1-C2 flexion. Clinically assessed via craniocervical flexion test (pressure biofeedback), not standard goniometry.",
  },
  "cervical-extension-upper": {
    aromMin: 0, aromMax: 25,
    promMin: 0, promMax: 25,
    source: BOGDUK,
    notes: "Segmental C0-C1/C1-C2 extension. Most upper cervical extension occurs at C0-C1.",
  },
  "cervical-rotation-upper": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: BOGDUK,
    notes: "Per side. Approximately 50% of total cervical rotation occurs at the atlantoaxial (C1-C2) joint. Assessed via flexion-rotation test.",
  },

  // ─── Thoracic Spine ────────────────────────────────────────────────────
  "thoracic-flexion": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: NORKIN,
    notes: "Inclinometer measurement of T1-T12. Limited by ribcage.",
  },
  "thoracic-extension": {
    aromMin: 0, aromMax: 25,
    promMin: 0, promMax: 30,
    source: NORKIN,
    notes: "Limited by ribcage and zygapophyseal joint orientation.",
  },
  "thoracic-lateral-flexion": {
    aromMin: 0, aromMax: 25,
    promMin: 0, promMax: 30,
    source: NORKIN,
    notes: "Per side. Limited by ribcage.",
  },
  "thoracic-rotation": {
    aromMin: 0, aromMax: 35,
    promMin: 0, promMax: 45,
    source: NORKIN,
    notes: "Per side. Thoracic rotation is the largest component of trunk rotation due to facet orientation; far greater than lumbar rotation.",
  },

  // ─── Lumbar Spine ──────────────────────────────────────────────────────
  "lumbar-flexion": {
    aromMin: 0, aromMax: 60,
    promMin: 0, promMax: 60,
    source: AAOS,
    notes: "Measured via inclinometer, modified Schober test, or fingertip-to-floor distance.",
  },
  "lumbar-extension": {
    aromMin: 0, aromMax: 25,
    promMin: 0, promMax: 35,
    source: AAOS,
    notes: "Some sources report 0-35°. Measured prone or standing.",
  },
  "lumbar-lateral-flexion": {
    aromMin: 0, aromMax: 25,
    promMin: 0, promMax: 25,
    source: AAOS,
    notes: "Per side.",
  },
  "lumbar-rotation": {
    aromMin: 0, aromMax: 15,
    promMin: 0, promMax: 15,
    source: NORKIN,
    notes: "Per side. Minimal (~5° per segment) due to vertically-oriented zygapophyseal facets. Most trunk rotation occurs in thoracic spine.",
  },

  // ─── Shoulder (Glenohumeral + Scapular combined motion) ────────────────
  "shoulder-flexion": {
    aromMin: 0, aromMax: 180,
    promMin: 0, promMax: 180,
    source: AAOS,
    notes: "Full flexion requires glenohumeral + scapulothoracic rhythm (approx. 2:1). Isolated glenohumeral flexion is ~120°.",
  },
  "shoulder-extension": {
    aromMin: 0, aromMax: 60,
    promMin: 0, promMax: 60,
    source: AAOS,
  },
  "shoulder-abduction": {
    aromMin: 0, aromMax: 180,
    promMin: 0, promMax: 180,
    source: AAOS,
    notes: "Full abduction requires ~60° scapular upward rotation. Isolated glenohumeral abduction is ~120°.",
  },
  "shoulder-adduction": {
    aromMin: 0, aromMax: 0,
    source: AAOS,
    notes: "From anatomical neutral, no further adduction available. Cross-body adduction is measured as Shoulder Horizontal Adduction.",
  },
  "shoulder-internal-rotation": {
    aromMin: 0, aromMax: 70,
    promMin: 0, promMax: 70,
    source: AAOS,
    notes: "Measured with shoulder abducted 90° and elbow flexed 90°. Behind-the-back measurement used clinically (hand to thoracic spine level).",
  },
  "shoulder-external-rotation": {
    aromMin: 0, aromMax: 90,
    promMin: 0, promMax: 90,
    source: AAOS,
    notes: "Measured with shoulder abducted 90° and elbow flexed 90°. Overhead throwing athletes often exceed 100°.",
  },
  "shoulder-horizontal-abduction": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: NORKIN,
    notes: "Measured from 90° shoulder flexion starting position, moving arm away from midline.",
  },
  "shoulder-horizontal-adduction": {
    aromMin: 0, aromMax: 135,
    promMin: 0, promMax: 135,
    source: NORKIN,
    notes: "Measured from 90° shoulder abduction starting position, arm crosses body.",
  },

  // ─── Scapulothoracic — not goniometric ─────────────────────────────────
  "scapular-elevation": {
    source: KIBLER,
    notes: "Not measured goniometrically. Clinically assessed as superior translation of scapula on thorax (~10-12 cm in shrug) or bilateral visual comparison for symmetry.",
  },
  "scapular-depression": {
    source: KIBLER,
    notes: "Clinically assessed as inferior translation of scapula from neutral. No standard degree measurement.",
  },
  "scapular-protraction": {
    source: KIBLER,
    notes: "Clinically assessed as distance of medial scapular border from thoracic spine. Full protraction ~15 cm of translation across the thorax.",
  },
  "scapular-retraction": {
    source: KIBLER,
    notes: "Clinically assessed as distance of medial scapular border from thoracic spine. No standard degree measurement.",
  },
  "scapular-upward-rotation": {
    aromMin: 0, aromMax: 60,
    promMin: 0, promMax: 60,
    unit: "degrees",
    source: LUDEWIG,
    notes: "Degrees of upward rotation during full arm elevation. Measured via 3D kinematic analysis or inclinometer at the scapular spine.",
  },
  "scapular-downward-rotation": {
    aromMin: 0, aromMax: 60,
    promMin: 0, promMax: 60,
    unit: "degrees",
    source: LUDEWIG,
    notes: "Return from full upward rotation to neutral (or ~5° below neutral in rest position).",
  },

  // ─── Elbow ─────────────────────────────────────────────────────────────
  "elbow-flexion": {
    aromMin: 0, aromMax: 150,
    promMin: 0, promMax: 160,
    source: AAOS,
    notes: "Some individuals reach 160°. Soft-tissue end-feel (biceps hitting biceps). Limited by muscle bulk.",
  },
  "elbow-extension": {
    aromMin: 0, aromMax: 0,
    promMin: 0, promMax: 10,
    source: AAOS,
    notes: "Normal extension ends at 0° (bony end-feel). 5-10° hyperextension is common, particularly in females.",
  },

  // ─── Forearm (Proximal + Distal Radioulnar Joint) ──────────────────────
  "forearm-pronation": {
    aromMin: 0, aromMax: 80,
    promMin: 0, promMax: 90,
    source: AAOS,
    notes: "Measured with elbow flexed 90° and tucked to side. Some sources report up to 90°.",
  },
  "forearm-supination": {
    aromMin: 0, aromMax: 80,
    promMin: 0, promMax: 90,
    source: AAOS,
    notes: "Measured with elbow flexed 90° and tucked to side. Some sources report up to 90°.",
  },

  // ─── Wrist ─────────────────────────────────────────────────────────────
  "wrist-flexion": {
    aromMin: 0, aromMax: 80,
    promMin: 0, promMax: 80,
    source: AAOS,
  },
  "wrist-extension": {
    aromMin: 0, aromMax: 70,
    promMin: 0, promMax: 70,
    source: AAOS,
  },
  "radial-deviation": {
    aromMin: 0, aromMax: 20,
    promMin: 0, promMax: 20,
    source: AAOS,
    notes: "Abduction of the wrist at the radiocarpal joint.",
  },
  "ulnar-deviation": {
    aromMin: 0, aromMax: 30,
    promMin: 0, promMax: 30,
    source: AAOS,
    notes: "Adduction of the wrist at the radiocarpal joint.",
  },

  // ─── Fingers — MCP (Metacarpophalangeal) ───────────────────────────────
  "finger-flexion": {
    aromMin: 0, aromMax: 90,
    promMin: 0, promMax: 90,
    source: AAOS,
    notes: "MCP joint flexion (2nd-5th digits).",
  },
  "finger-extension": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: AAOS,
    notes: "MCP hyperextension. Normal range 30-45°; varies individually.",
  },
  "finger-abduction": {
    aromMin: 0, aromMax: 20,
    promMin: 0, promMax: 20,
    source: AAOS,
    notes: "MCP abduction of index finger from middle finger reference. Varies by digit; ring and pinky have greater available range.",
  },
  "finger-adduction": {
    aromMin: 0, aromMax: 0,
    source: AAOS,
    notes: "Return to neutral from abducted position; no further adduction past midline.",
  },

  // ─── Fingers — PIP (Proximal Interphalangeal) ──────────────────────────
  "pip-flexion": {
    aromMin: 0, aromMax: 100,
    promMin: 0, promMax: 110,
    source: AAOS,
    notes: "PIP joint flexion. Slightly greater range than MCP.",
  },
  "pip-extension": {
    aromMin: 0, aromMax: 0,
    source: AAOS,
    notes: "No hyperextension at PIP joints (bony/ligamentous end-feel).",
  },

  // ─── Fingers — DIP (Distal Interphalangeal) ────────────────────────────
  "dip-flexion": {
    aromMin: 0, aromMax: 90,
    promMin: 0, promMax: 90,
    source: AAOS,
  },
  "dip-extension": {
    aromMin: 0, aromMax: 10,
    promMin: 0, promMax: 20,
    source: AAOS,
    notes: "Slight hyperextension normal (~10-20°).",
  },

  // ─── Thumb ─────────────────────────────────────────────────────────────
  "thumb-mcp-flexion": {
    aromMin: 0, aromMax: 50,
    promMin: 0, promMax: 50,
    source: AAOS,
    notes: "Thumb MCP joint flexion.",
  },
  "thumb-mcp-extension": {
    aromMin: 0, aromMax: 0,
    source: AAOS,
    notes: "No MCP hyperextension in thumb.",
  },
  "thumb-ip-flexion": {
    aromMin: 0, aromMax: 80,
    promMin: 0, promMax: 80,
    source: AAOS,
    notes: "Thumb IP joint flexion.",
  },
  "thumb-ip-extension": {
    aromMin: 0, aromMax: 20,
    promMin: 0, promMax: 25,
    source: AAOS,
    notes: "Hyperextension normal up to 20-25° at thumb IP.",
  },
  "thumb-abduction": {
    aromMin: 0, aromMax: 70,
    promMin: 0, promMax: 70,
    source: AAOS,
    notes: "Palmar abduction at thumb CMC joint (thumb moves perpendicular to palm). Radial abduction (in plane of palm) is ~50°.",
  },
  "thumb-adduction": {
    aromMin: 0, aromMax: 0,
    source: AAOS,
    notes: "Return to neutral from abducted position; no adduction past midline.",
  },
  "thumb-opposition": {
    unit: "kapandji-score",
    source: AAOS,
    notes: "Not measured in degrees. Clinically measured by (a) distance from thumb tip to base of 5th finger, or (b) Kapandji score 0-10 where 10 = thumb tip reaches distal palmar crease of 5th digit.",
  },

  // ─── Hip ───────────────────────────────────────────────────────────────
  "hip-flexion": {
    aromMin: 0, aromMax: 120,
    promMin: 0, promMax: 125,
    source: AAOS,
    notes: "Measured with knee flexed to eliminate hamstring restriction. Straight-leg raise (knee extended) typically reaches only 80-90°.",
  },
  "hip-extension": {
    aromMin: 0, aromMax: 30,
    promMin: 0, promMax: 30,
    source: AAOS,
    notes: "Measured prone or sidelying. Stabilize pelvis to prevent lumbar extension compensation (Thomas test).",
  },
  "hip-abduction": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: AAOS,
  },
  "hip-adduction": {
    aromMin: 0, aromMax: 30,
    promMin: 0, promMax: 30,
    source: AAOS,
    notes: "Measured as movement of the test leg across the contralateral leg.",
  },
  "hip-internal-rotation": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: AAOS,
    notes: "Measured seated with hip and knee flexed 90°. Prone position also used clinically.",
  },
  "hip-external-rotation": {
    aromMin: 0, aromMax: 45,
    promMin: 0, promMax: 45,
    source: AAOS,
    notes: "Measured seated with hip and knee flexed 90°. Prone position also used clinically.",
  },

  // ─── Knee ──────────────────────────────────────────────────────────────
  "knee-flexion": {
    aromMin: 0, aromMax: 135,
    promMin: 0, promMax: 150,
    source: AAOS,
    notes: "AROM typically 135°; PROM up to 150° with heel-to-buttock. Limited by hamstring/calf bulk in extreme flexion.",
  },
  "knee-extension": {
    aromMin: 0, aromMax: 0,
    promMin: 0, promMax: 10,
    source: AAOS,
    notes: "Normal extension ends at 0° (bony end-feel from tibiofemoral joint congruence). 5-10° hyperextension common; >10° is genu recurvatum.",
  },
  "knee-internal-rotation": {
    aromMin: 0, aromMax: 10,
    promMin: 0, promMax: 15,
    source: NORKIN,
    notes: "Measured with knee flexed to 90° (rotation locked out in full extension by screw-home mechanism). Tibial rotation on femur.",
  },
  "knee-external-rotation": {
    aromMin: 0, aromMax: 20,
    promMin: 0, promMax: 30,
    source: NORKIN,
    notes: "Measured with knee flexed to 90°. Greater range than internal rotation due to lateral collateral ligament orientation.",
  },

  // ─── Ankle ─────────────────────────────────────────────────────────────
  "ankle-dorsiflexion": {
    aromMin: 0, aromMax: 20,
    promMin: 0, promMax: 20,
    source: AAOS,
    notes: "Measured with knee extended (engages gastrocnemius — often the limiter). Knee-flexed dorsiflexion (soleus only) should reach 20°. Weight-bearing lunge test is the functional clinical standard.",
  },
  "ankle-plantarflexion": {
    aromMin: 0, aromMax: 50,
    promMin: 0, promMax: 50,
    source: AAOS,
  },
  "foot-inversion": {
    aromMin: 0, aromMax: 35,
    promMin: 0, promMax: 35,
    source: AAOS,
    notes: "Measured at the subtalar joint. Triplanar motion (combined adduction + supination + plantarflexion).",
  },
  "foot-eversion": {
    aromMin: 0, aromMax: 15,
    promMin: 0, promMax: 15,
    source: AAOS,
    notes: "Measured at the subtalar joint. Triplanar motion (combined abduction + pronation + dorsiflexion).",
  },
};

async function main() {
  const all = await prisma.movement.findMany({ select: { id: true, slug: true, name: true } });
  const bySlug = new Map(all.map((m) => [m.slug, m]));

  let updated = 0;
  const missing: string[] = [];
  const extra: string[] = [];

  for (const [slug, entry] of Object.entries(ROM)) {
    const m = bySlug.get(slug);
    if (!m) {
      extra.push(slug);
      continue;
    }
    await prisma.movement.update({
      where: { id: m.id },
      data: {
        aromMin: entry.aromMin ?? null,
        aromMax: entry.aromMax ?? null,
        promMin: entry.promMin ?? null,
        promMax: entry.promMax ?? null,
        romUnit: entry.unit ?? "degrees",
        romNotes: entry.notes ?? null,
        romSource: entry.source,
      },
    });
    updated++;
  }

  // Movements in DB that got no ROM entry
  for (const m of all) {
    if (!(m.slug in ROM)) missing.push(`${m.slug}  (${m.name})`);
  }

  console.log(`✓ Updated ${updated} movements with ROM data.`);

  if (missing.length > 0) {
    console.log(`\n⚠ ${missing.length} movements have NO ROM entry:`);
    for (const m of missing) console.log(`    ${m}`);
  }
  if (extra.length > 0) {
    console.log(`\n⚠ ${extra.length} ROM entries reference slugs not in the DB:`);
    for (const s of extra) console.log(`    ${s}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
