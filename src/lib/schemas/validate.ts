/**
 * Schema validation test — exercises every Zod schema with sample data.
 * Run: pnpm validate:schemas
 */
import {
  RegionCreateSchema,
  RegionUpdateSchema,
  JointCreateSchema,
  MovementCreateSchema,
  MuscleCreateSchema,
  MovementMuscleCreateSchema,
  ExerciseMuscleCreateSchema,
  FunctionalTaskCreateSchema,
  ExerciseCreateSchema,
  CueCreateSchema,
  RegressionCreateSchema,
  ProgressionCreateSchema,
  ResearchSourceCreateSchema,
  TagCreateSchema,
} from "./index";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e: any) {
    failed++;
    console.error(`  ✗ ${name}: ${e.message}`);
  }
}

function expectValid(schema: any, data: any) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.issues, null, 2));
  }
}

function expectInvalid(schema: any, data: any) {
  const result = schema.safeParse(data);
  if (result.success) {
    throw new Error("Expected validation failure but got success");
  }
}

console.log("\nValidating Zod schemas...\n");

// ─── Region ──────────────────────────────────────────────────────────────────
console.log("Region:");
test("valid create", () => expectValid(RegionCreateSchema, { slug: "shoulder", name: "Shoulder" }));
test("valid create with all fields", () =>
  expectValid(RegionCreateSchema, {
    slug: "shoulder",
    name: "Shoulder",
    description: "Upper extremity region",
    status: "reviewed",
    confidence: 0.9,
    notes: "Well-established anatomy",
  })
);
test("invalid slug (uppercase)", () => expectInvalid(RegionCreateSchema, { slug: "Shoulder", name: "Shoulder" }));
test("invalid slug (spaces)", () => expectInvalid(RegionCreateSchema, { slug: "my region", name: "Test" }));
test("missing name", () => expectInvalid(RegionCreateSchema, { slug: "test" }));
test("valid update (partial)", () => expectValid(RegionUpdateSchema, { name: "Updated Shoulder" }));

// ─── Joint ───────────────────────────────────────────────────────────────────
console.log("\nJoint:");
test("valid create", () =>
  expectValid(JointCreateSchema, {
    slug: "glenohumeral",
    name: "Glenohumeral Joint",
    regionId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    jointType: "ball-and-socket",
  })
);
test("missing regionId", () => expectInvalid(JointCreateSchema, { slug: "test", name: "Test" }));

// ─── Movement ────────────────────────────────────────────────────────────────
console.log("\nMovement:");
test("valid create", () =>
  expectValid(MovementCreateSchema, {
    slug: "shoulder-flexion",
    name: "Shoulder Flexion",
    jointId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    plane: "sagittal",
  })
);

// ─── Muscle ──────────────────────────────────────────────────────────────────
console.log("\nMuscle:");
test("valid create", () =>
  expectValid(MuscleCreateSchema, {
    slug: "infraspinatus",
    name: "Infraspinatus",
    origin: "Infraspinous fossa of scapula",
    insertion: "Greater tubercle of humerus (middle facet)",
    action: "External rotation of shoulder, stabilizes humeral head",
    innervation: "Suprascapular nerve (C5-C6)",
    bloodSupply: "Suprascapular artery, circumflex scapular artery",
  })
);
test("missing origin", () =>
  expectInvalid(MuscleCreateSchema, {
    slug: "test",
    name: "Test",
    insertion: "x",
    action: "x",
    innervation: "x",
    bloodSupply: "x",
  })
);

// ─── Weighted Relationships ──────────────────────────────────────────────────
console.log("\nWeighted Relationships:");
test("valid movement-muscle", () =>
  expectValid(MovementMuscleCreateSchema, {
    movementId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    muscleId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    role: "primary",
  })
);
test("valid exercise-muscle", () =>
  expectValid(ExerciseMuscleCreateSchema, {
    exerciseId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    muscleId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    role: "stabilizer",
  })
);
test("invalid role", () =>
  expectInvalid(MovementMuscleCreateSchema, {
    movementId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    muscleId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    role: "agonist",
  })
);

// ─── Functional Task ─────────────────────────────────────────────────────────
console.log("\nFunctional Task:");
test("valid create", () =>
  expectValid(FunctionalTaskCreateSchema, {
    slug: "reaching-overhead",
    name: "Reaching Overhead",
    category: "ADL",
  })
);

// ─── Exercise ────────────────────────────────────────────────────────────────
console.log("\nExercise:");
test("valid create", () =>
  expectValid(ExerciseCreateSchema, {
    slug: "bridge",
    name: "Bridge",
    description: "Supine hip extension exercise targeting gluteals and hamstrings",
  })
);
test("missing description", () =>
  expectInvalid(ExerciseCreateSchema, { slug: "bridge", name: "Bridge" })
);

// ─── Cue ─────────────────────────────────────────────────────────────────────
console.log("\nCue:");
test("valid create", () =>
  expectValid(CueCreateSchema, {
    text: "Drive through your heels",
    cueType: "verbal",
    exerciseId: "clxxxxxxxxxxxxxxxxxxxxxxx",
  })
);

// ─── Regression / Progression ────────────────────────────────────────────────
console.log("\nRegression:");
test("valid create", () =>
  expectValid(RegressionCreateSchema, {
    name: "Partial Bridge",
    description: "Reduce range of motion",
    exerciseId: "clxxxxxxxxxxxxxxxxxxxxxxx",
  })
);

console.log("\nProgression:");
test("valid create", () =>
  expectValid(ProgressionCreateSchema, {
    name: "Single-Leg Bridge",
    description: "Perform with one leg extended",
    exerciseId: "clxxxxxxxxxxxxxxxxxxxxxxx",
  })
);

// ─── Research Source ─────────────────────────────────────────────────────────
console.log("\nResearch Source:");
test("valid create", () =>
  expectValid(ResearchSourceCreateSchema, {
    slug: "neumann-kinesiology-2017",
    title: "Kinesiology of the Musculoskeletal System",
    authors: "Neumann DA",
    year: 2017,
    sourceType: "textbook",
  })
);
test("invalid year", () =>
  expectInvalid(ResearchSourceCreateSchema, {
    slug: "test",
    title: "Test",
    year: 1800,
  })
);

// ─── Tag ─────────────────────────────────────────────────────────────────────
console.log("\nTag:");
test("valid create", () => expectValid(TagCreateSchema, { slug: "upper-extremity", name: "Upper Extremity" }));

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
