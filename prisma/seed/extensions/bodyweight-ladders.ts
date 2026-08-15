import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prisma, logSection, logCount } from "../client";
import { MuscleRole, ProgressionMechanism } from "@prisma/client";

/**
 * Bodyweight progression ladders — push / pull / squat / hinge / core.
 *
 * Two things at once:
 *
 * 1. The missing rungs as real Exercise nodes (knee push-up, the floor push-up
 *    itself, negatives, support holds, the tuck→full L-sit line). Most of the
 *    easy and hard ends of these ladders were already seeded; the middle was
 *    not.
 * 2. The ladders themselves as **typed difficulty edges** — FK-linked
 *    Progression/Regression rows carrying a `mechanism` (why the next rung is
 *    harder) and a `criterion` (the gate to move, or the trigger to step back).
 *    See wiki/decisions/2026-08-05-progression-edges.md.
 *
 * Each authored rung in `edges` materializes BOTH directions: a Progression on
 * `from` → `to`, and the mirrored Regression on `to` → `from`. Authors write
 * the relation once.
 *
 * PROVENANCE. The rung *ordering* is community consensus (the r/bodyweight-
 * fitness Recommended Routine and allied coaching material), not trial
 * evidence — recorded as an `expert-opinion` ResearchSource at confidence 0.35
 * and linked to every node this module creates. The muscle/movement/task links
 * under each node are authored here and carry no source yet; they run through
 * the normal sourcing pass like any other researched drop. New exercises land
 * at status `draft`, confidence 0.5.
 *
 * ORDERING. Runs LAST in the seed chain, after apply-audit. Earlier
 * researched-exercise extensions deleteMany + recreate progression/regression
 * rows for their own exercises, which would wipe these edges if this ran first.
 * Idempotent: edges are keyed on (exerciseId, targetExerciseId) and updated
 * rather than duplicated, and no progression/regression rows belonging to
 * pre-existing exercises are ever deleted.
 *
 * DELIBERATELY OUT OF SCOPE (next drop): one-arm push-up, archer pull-up,
 * front lever, handstand line, ring work.
 */

const FILE = join(__dirname, "bodyweight-ladders-2026-08.json");
const NOTE =
  "claude-researched 2026-08 (bodyweight ladders). Rung ordering is community consensus, not trial evidence — see source bodyweight-progression-consensus-2026. EMG and RCT sourcing pending.";

const VALID_ROLES = new Set<string>([
  "primary", "secondary", "stabilizer", "synergist", "lengthening", "common_association",
]);

const VALID_MECHANISMS = new Set<string>([
  "leverage", "range", "unilateral", "stability", "tempo",
  "contraction_type", "added_load", "speed", "volume", "complexity",
]);

/** JSON may use either hyphens or underscores; the enum uses underscores. */
function toMechanism(raw: string | undefined): ProgressionMechanism | null {
  if (!raw) return null;
  const normalized = raw.replace(/-/g, "_");
  if (!VALID_MECHANISMS.has(normalized)) return null;
  return normalized as ProgressionMechanism;
}

export async function seedBodyweightLaddersExtension() {
  logSection("Bodyweight progression ladders (typed difficulty edges)");
  if (!existsSync(FILE)) { console.log("    (no bodyweight-ladders JSON — skipping)"); return; }

  const data = JSON.parse(readFileSync(FILE, "utf8"));

  // ── Consensus source ──────────────────────────────────────────────────────
  const src = data.source;
  const source = await prisma.researchSource.upsert({
    where: { slug: src.slug },
    update: {
      title: src.title, authors: src.authors, year: src.year, sourceType: src.sourceType,
      url: src.url, description: src.description, confidence: src.confidence,
    },
    create: {
      slug: src.slug, title: src.title, authors: src.authors, year: src.year,
      sourceType: src.sourceType, url: src.url, description: src.description,
      status: "needs_review", confidence: src.confidence,
    },
  });

  const [movs, muscs, tasks, goals] = await Promise.all([
    prisma.movement.findMany({ select: { id: true, slug: true } }),
    prisma.muscle.findMany({ select: { id: true, slug: true } }),
    prisma.functionalTask.findMany({ select: { id: true, slug: true } }),
    prisma.goal.findMany({ select: { id: true, slug: true } }),
  ]);
  const movementMap = new Map(movs.map((m) => [m.slug, m.id]));
  const muscleMap = new Map(muscs.map((m) => [m.slug, m.id]));
  const taskMap = new Map(tasks.map((t) => [t.slug, t.id]));
  const goalMap = new Map(goals.map((g) => [g.slug, g.id]));

  const missing: string[] = [];

  // ── Nodes ─────────────────────────────────────────────────────────────────
  let created = 0;
  for (const rec of data.exercises ?? []) {
    const fields = {
      name: rec.name, description: rec.description, rationale: rec.rationale,
      category: rec.category, dosing: rec.dosing, evidenceLevel: rec.evidenceLevel,
      difficulty: rec.difficulty, bodyPosition: rec.bodyPosition ?? null,
      equipment: rec.equipment ?? [], startPosition: rec.startPosition,
      endPosition: rec.endPosition, rom: rec.rom, cameraView: rec.cameraView,
      provenance: "claude-researched", notes: NOTE,
    };
    const ex = await prisma.exercise.upsert({
      where: { slug: rec.slug },
      update: fields,
      create: { slug: rec.slug, status: "draft", confidence: 0.5, ...fields },
    });

    for (const mr of rec.muscleRoles ?? []) {
      const muscleId = muscleMap.get(mr.muscleSlug);
      if (!muscleId) { missing.push(`muscle:${mr.muscleSlug}`); continue; }
      if (!VALID_ROLES.has(mr.role)) { missing.push(`role:${mr.role}`); continue; }
      await prisma.exerciseMuscle.upsert({
        where: { exerciseId_muscleId: { exerciseId: ex.id, muscleId } },
        update: { role: mr.role as MuscleRole, notes: mr.notes },
        create: { exerciseId: ex.id, muscleId, role: mr.role as MuscleRole, notes: mr.notes },
      });
    }

    for (const ms of rec.movementSlugs ?? []) {
      const movementId = movementMap.get(ms);
      if (!movementId) { missing.push(`movement:${ms}`); continue; }
      await prisma.exerciseMovement.upsert({
        where: { exerciseId_movementId: { exerciseId: ex.id, movementId } },
        update: {}, create: { exerciseId: ex.id, movementId },
      });
    }

    for (const ts of rec.functionalTaskSlugs ?? []) {
      const functionalTaskId = taskMap.get(ts);
      if (!functionalTaskId) { missing.push(`task:${ts}`); continue; }
      await prisma.exerciseFunctionalTask.upsert({
        where: { exerciseId_functionalTaskId: { exerciseId: ex.id, functionalTaskId } },
        update: {}, create: { exerciseId: ex.id, functionalTaskId, relevance: "supportive" },
      });
    }

    for (const gs of rec.goalSlugs ?? []) {
      const goalId = goalMap.get(gs);
      if (!goalId) { missing.push(`goal:${gs}`); continue; }
      await prisma.exerciseGoal.upsert({
        where: { exerciseId_goalId: { exerciseId: ex.id, goalId } },
        update: {}, create: { exerciseId: ex.id, goalId, relevance: "supportive" },
      });
    }

    // Cues are owned by this module for the nodes it creates — safe to replace.
    if (rec.cues?.length) {
      await prisma.cue.deleteMany({ where: { exerciseId: ex.id } });
      for (let i = 0; i < rec.cues.length; i++) {
        await prisma.cue.create({
          data: {
            text: rec.cues[i].text, cueType: rec.cues[i].cueType ?? "verbal",
            focus: rec.cues[i].focus, order: i, exerciseId: ex.id,
          },
        });
      }
    }

    // Consensus source applies to the node's place in the ladder.
    const linked = await prisma.sourceOnEntity.findFirst({
      where: { exerciseId: ex.id, sourceId: source.id }, select: { id: true },
    });
    if (!linked) {
      await prisma.sourceOnEntity.create({
        data: {
          entityType: "Exercise", exerciseId: ex.id, sourceId: source.id,
          notes: "Consensus progression sequence — supports the rung's position in the ladder, not its anatomy.",
        },
      });
    }

    created++;
  }

  // ── Typed difficulty edges (both directions per authored rung) ─────────────
  const exBySlug = new Map(
    (await prisma.exercise.findMany({ select: { id: true, slug: true, name: true } })).map((e) => [e.slug, e]),
  );

  let progressions = 0, regressions = 0, skipped = 0;
  const laddersSeen = new Set<string>();

  for (const [i, edge] of (data.edges ?? []).entries()) {
    const from = exBySlug.get(edge.from);
    const to = exBySlug.get(edge.to);
    if (!from || !to) {
      missing.push(`edge:${edge.from}→${edge.to}`);
      skipped++;
      continue;
    }
    const fromId = from.id, toId = to.id;
    const mechanism = toMechanism(edge.mechanism);
    if (!mechanism) { missing.push(`mechanism:${edge.mechanism}`); }
    laddersSeen.add(edge.ladder ?? "unnamed");

    // `name` mirrors the target's real name — the FK is authoritative, but
    // `name` is a documented v1 API field and shouldn't echo a raw slug.
    const forwardDesc = [`Progress to ${to.name}.`, edge.note].filter(Boolean).join(" ");
    const reverseDesc = [`Regress to ${from.name}.`, edge.note].filter(Boolean).join(" ");

    // Progression: from → to
    const existingProg = await prisma.progression.findFirst({
      where: { exerciseId: fromId, targetExerciseId: toId }, select: { id: true },
    });
    if (existingProg) {
      await prisma.progression.update({
        where: { id: existingProg.id },
        data: { name: to.name, criterion: edge.gate, mechanism, description: forwardDesc },
      });
    } else {
      await prisma.progression.create({
        data: {
          exerciseId: fromId, targetExerciseId: toId,
          name: to.name, description: forwardDesc,
          criterion: edge.gate, mechanism, order: i,
        },
      });
    }
    progressions++;

    // Mirrored Regression: to → from
    const existingReg = await prisma.regression.findFirst({
      where: { exerciseId: toId, targetExerciseId: fromId }, select: { id: true },
    });
    if (existingReg) {
      await prisma.regression.update({
        where: { id: existingReg.id },
        data: { name: from.name, criterion: edge.regressWhen, mechanism, description: reverseDesc },
      });
    } else {
      await prisma.regression.create({
        data: {
          exerciseId: toId, targetExerciseId: fromId,
          name: from.name, description: reverseDesc,
          criterion: edge.regressWhen, mechanism, order: i,
        },
      });
    }
    regressions++;
  }

  logCount("bodyweight ladder exercises seeded", created);
  console.log(`    ladders: ${laddersSeen.size} | progression edges: ${progressions} | regression edges: ${regressions}`);
  if (skipped) console.log(`    ⚠ ${skipped} edge(s) skipped — endpoint exercise not found`);
  if (missing.length) {
    const unique = [...new Set(missing)];
    console.log(`    ⚠ ${unique.length} unresolved reference(s): ${unique.join(", ")}`);
  }
}
