import { z } from "zod";

// ─── Shared Enums ────────────────────────────────────────────────────────────

export const EntityStatusEnum = z.enum([
  "draft",
  "needs_review",
  "reviewed",
  "verified",
  "disputed",
]);

export const MuscleRoleEnum = z.enum([
  "primary",
  "secondary",
  "stabilizer",
  "synergist",
  "common_association",
]);

export type EntityStatus = z.infer<typeof EntityStatusEnum>;
export type MuscleRole = z.infer<typeof MuscleRoleEnum>;

// ─── Shared Validation Fields ────────────────────────────────────────────────

const validationFields = {
  status: EntityStatusEnum.default("draft"),
  confidence: z.number().min(0).max(1).default(0.5),
  notes: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: z.coerce.date().nullable().optional(),
};

const slugField = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid slug (lowercase, hyphens)");

// ─── Region ──────────────────────────────────────────────────────────────────

export const RegionCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  ...validationFields,
});

export const RegionUpdateSchema = RegionCreateSchema.partial().omit({ slug: true });

// ─── Joint ───────────────────────────────────────────────────────────────────

export const JointCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  jointType: z.string().nullable().optional(),
  regionId: z.string().cuid(),
  ...validationFields,
});

export const JointUpdateSchema = JointCreateSchema.partial().omit({ slug: true });

// ─── Movement ────────────────────────────────────────────────────────────────

export const MovementCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  plane: z.string().nullable().optional(),
  axis: z.string().nullable().optional(),
  jointId: z.string().cuid(),
  ...validationFields,
});

export const MovementUpdateSchema = MovementCreateSchema.partial().omit({ slug: true });

// ─── Muscle ──────────────────────────────────────────────────────────────────

export const MuscleCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  origin: z.string().min(1),
  insertion: z.string().min(1),
  action: z.string().min(1),
  innervation: z.string().min(1),
  bloodSupply: z.string().min(1),
  ...validationFields,
});

export const MuscleUpdateSchema = MuscleCreateSchema.partial().omit({ slug: true });

// ─── Weighted Relationships ──────────────────────────────────────────────────

export const MovementMuscleCreateSchema = z.object({
  movementId: z.string().cuid(),
  muscleId: z.string().cuid(),
  role: MuscleRoleEnum,
  notes: z.string().nullable().optional(),
});

export const ExerciseMuscleCreateSchema = z.object({
  exerciseId: z.string().cuid(),
  muscleId: z.string().cuid(),
  role: MuscleRoleEnum,
  notes: z.string().nullable().optional(),
});

// ─── Functional Task ─────────────────────────────────────────────────────────

export const FunctionalTaskCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  ...validationFields,
});

export const FunctionalTaskUpdateSchema = FunctionalTaskCreateSchema.partial().omit({ slug: true });

// ─── Exercise ────────────────────────────────────────────────────────────────

export const ExerciseCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  ...validationFields,
});

export const ExerciseUpdateSchema = ExerciseCreateSchema.partial().omit({ slug: true });

// ─── Cue ─────────────────────────────────────────────────────────────────────

export const CueCreateSchema = z.object({
  text: z.string().min(1),
  cueType: z.string().nullable().optional(),
  order: z.number().int().min(0).default(0),
  exerciseId: z.string().cuid(),
});

// ─── Regression ──────────────────────────────────────────────────────────────

export const RegressionCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  order: z.number().int().min(0).default(0),
  exerciseId: z.string().cuid(),
});

// ─── Progression ─────────────────────────────────────────────────────────────

export const ProgressionCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  order: z.number().int().min(0).default(0),
  exerciseId: z.string().cuid(),
});

// ─── Research Source ─────────────────────────────────────────────────────────

export const ResearchSourceCreateSchema = z.object({
  slug: slugField,
  title: z.string().min(1).max(500),
  authors: z.string().nullable().optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  journal: z.string().nullable().optional(),
  doi: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  sourceType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  ...validationFields,
});

export const ResearchSourceUpdateSchema = ResearchSourceCreateSchema.partial().omit({ slug: true });

// ─── Tag ─────────────────────────────────────────────────────────────────────

export const TagCreateSchema = z.object({
  slug: slugField,
  name: z.string().min(1).max(100),
  category: z.string().nullable().optional(),
});
