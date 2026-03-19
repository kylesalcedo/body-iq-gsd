/**
 * Data quality check script.
 * Detects structural issues in the knowledge graph.
 * Run: npx tsx scripts/data-quality.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Issue {
  category: string;
  severity: "error" | "warning" | "info";
  entityType: string;
  entitySlug?: string;
  message: string;
}

async function checkOrphanMovements(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const movements = await prisma.movement.findMany({
    include: { muscles: true, exercises: true },
  });
  for (const m of movements) {
    if (m.muscles.length === 0) {
      issues.push({
        category: "orphan",
        severity: "warning",
        entityType: "Movement",
        entitySlug: m.slug,
        message: `Movement "${m.name}" has no muscle associations`,
      });
    }
  }
  return issues;
}

async function checkOrphanMuscles(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const muscles = await prisma.muscle.findMany({
    include: { movements: true, exercises: true },
  });
  for (const m of muscles) {
    if (m.movements.length === 0 && m.exercises.length === 0) {
      issues.push({
        category: "orphan",
        severity: "warning",
        entityType: "Muscle",
        entitySlug: m.slug,
        message: `Muscle "${m.name}" has no movement or exercise associations`,
      });
    }
  }
  return issues;
}

async function checkExercisesWithoutCues(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const exercises = await prisma.exercise.findMany({
    include: { cues: true },
  });
  for (const e of exercises) {
    if (e.cues.length === 0) {
      issues.push({
        category: "incomplete",
        severity: "warning",
        entityType: "Exercise",
        entitySlug: e.slug,
        message: `Exercise "${e.name}" has no cues`,
      });
    }
  }
  return issues;
}

async function checkExercisesWithoutProgressions(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const exercises = await prisma.exercise.findMany({
    include: { regressions: true, progressions: true },
  });
  for (const e of exercises) {
    if (e.regressions.length === 0) {
      issues.push({
        category: "incomplete",
        severity: "info",
        entityType: "Exercise",
        entitySlug: e.slug,
        message: `Exercise "${e.name}" has no regressions`,
      });
    }
    if (e.progressions.length === 0) {
      issues.push({
        category: "incomplete",
        severity: "info",
        entityType: "Exercise",
        entitySlug: e.slug,
        message: `Exercise "${e.name}" has no progressions`,
      });
    }
  }
  return issues;
}

async function checkMissingSources(): Promise<Issue[]> {
  const issues: Issue[] = [];

  // Check muscles without sources
  const muscles = await prisma.muscle.findMany({
    include: { sources: true },
  });
  for (const m of muscles) {
    if (m.sources.length === 0) {
      issues.push({
        category: "missing-source",
        severity: "info",
        entityType: "Muscle",
        entitySlug: m.slug,
        message: `Muscle "${m.name}" has no research sources`,
      });
    }
  }

  // Check exercises without sources
  const exercises = await prisma.exercise.findMany({
    include: { sources: true },
  });
  for (const e of exercises) {
    if (e.sources.length === 0) {
      issues.push({
        category: "missing-source",
        severity: "info",
        entityType: "Exercise",
        entitySlug: e.slug,
        message: `Exercise "${e.name}" has no research sources`,
      });
    }
  }

  return issues;
}

async function checkLowConfidence(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const threshold = 0.5;

  const tables = [
    { name: "Region", query: () => prisma.region.findMany({ where: { confidence: { lt: threshold } } }) },
    { name: "Joint", query: () => prisma.joint.findMany({ where: { confidence: { lt: threshold } } }) },
    { name: "Movement", query: () => prisma.movement.findMany({ where: { confidence: { lt: threshold } } }) },
    { name: "Muscle", query: () => prisma.muscle.findMany({ where: { confidence: { lt: threshold } } }) },
    { name: "FunctionalTask", query: () => prisma.functionalTask.findMany({ where: { confidence: { lt: threshold } } }) },
    { name: "Exercise", query: () => prisma.exercise.findMany({ where: { confidence: { lt: threshold } } }) },
  ];

  for (const t of tables) {
    const items = await t.query();
    for (const item of items) {
      issues.push({
        category: "low-confidence",
        severity: "warning",
        entityType: t.name,
        entitySlug: (item as any).slug,
        message: `${t.name} "${(item as any).name}" has low confidence (${(item as any).confidence})`,
      });
    }
  }

  return issues;
}

async function checkDuplicateSlugs(): Promise<Issue[]> {
  const issues: Issue[] = [];

  // Check within each entity type (slugs are unique per type via DB constraint, so this
  // catches cross-type duplicates that might cause URL collisions)
  const allSlugs = new Map<string, string[]>();

  const types = [
    { name: "Region", query: () => prisma.region.findMany({ select: { slug: true } }) },
    { name: "Joint", query: () => prisma.joint.findMany({ select: { slug: true } }) },
    { name: "Movement", query: () => prisma.movement.findMany({ select: { slug: true } }) },
    { name: "Muscle", query: () => prisma.muscle.findMany({ select: { slug: true } }) },
    { name: "FunctionalTask", query: () => prisma.functionalTask.findMany({ select: { slug: true } }) },
    { name: "Exercise", query: () => prisma.exercise.findMany({ select: { slug: true } }) },
  ];

  for (const t of types) {
    const items = await t.query();
    for (const item of items) {
      const existing = allSlugs.get(item.slug) || [];
      existing.push(t.name);
      allSlugs.set(item.slug, existing);
    }
  }

  for (const [slug, types] of allSlugs) {
    if (types.length > 1) {
      issues.push({
        category: "duplicate-slug",
        severity: "warning",
        entityType: types.join(", "),
        entitySlug: slug,
        message: `Slug "${slug}" is used by multiple entity types: ${types.join(", ")}`,
      });
    }
  }

  return issues;
}

async function main() {
  console.log("🔍 Body IQ — Data Quality Check\n");

  const allIssues: Issue[] = [];

  const checks = [
    { name: "Orphan movements", fn: checkOrphanMovements },
    { name: "Orphan muscles", fn: checkOrphanMuscles },
    { name: "Exercises without cues", fn: checkExercisesWithoutCues },
    { name: "Exercises without progressions/regressions", fn: checkExercisesWithoutProgressions },
    { name: "Missing sources", fn: checkMissingSources },
    { name: "Low confidence", fn: checkLowConfidence },
    { name: "Duplicate slugs", fn: checkDuplicateSlugs },
  ];

  for (const check of checks) {
    process.stdout.write(`  Checking: ${check.name}...`);
    const issues = await check.fn();
    allIssues.push(...issues);
    console.log(` ${issues.length} issue${issues.length !== 1 ? "s" : ""}`);
  }

  // Summary
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const infos = allIssues.filter((i) => i.severity === "info");

  console.log("\n─── Summary ─────────────────────────────────────────");
  console.log(`  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Info:     ${infos.length}`);
  console.log(`  Total:    ${allIssues.length}`);

  if (allIssues.length > 0) {
    console.log("\n─── Issues ──────────────────────────────────────────");

    const byCategory = new Map<string, Issue[]>();
    for (const issue of allIssues) {
      const list = byCategory.get(issue.category) || [];
      list.push(issue);
      byCategory.set(issue.category, list);
    }

    for (const [category, issues] of byCategory) {
      console.log(`\n  [${category}] (${issues.length})`);
      for (const issue of issues.slice(0, 10)) {
        const icon = issue.severity === "error" ? "❌" : issue.severity === "warning" ? "⚠️" : "ℹ️";
        console.log(`    ${icon} ${issue.message}`);
      }
      if (issues.length > 10) {
        console.log(`    ... and ${issues.length - 10} more`);
      }
    }
  }

  console.log("");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Data quality check failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
