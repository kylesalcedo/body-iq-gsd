/**
 * Body IQ v1 API response schemas.
 *
 * One Zod schema per endpoint response documented in docs/api-v1.md.
 * These schemas are the machine-enforced version of the v1 contract: if a
 * response stops parsing, the contract is broken and consumers (Inyo, desk
 * habits app) will break too.
 *
 * Shape rules encoded here:
 *   - Most objects use `.passthrough()` — extra fields are allowed (additive
 *     changes are v1-safe per the contract).
 *   - The RAG source shape uses `.strict()` — that projection is frozen and
 *     adding fields requires a version bump (LLM pipelines often strict-parse).
 *   - Enum-like fields (status, role, entityType) use `z.enum()` with all
 *     canonical v1 values. New values require v2.
 */
import { z } from "zod";

// ─── Shared enums / helpers ──────────────────────────────────────────────────

export const StatusEnum = z.enum([
  "draft",
  "needs_review",
  "reviewed",
  "verified",
  "disputed",
]);

export const RoleEnum = z.enum([
  "primary",
  "secondary",
  "stabilizer",
  "synergist",
  "common_association",
]);

export const EntityTypeEnum = z.enum([
  "region",
  "joint",
  "movement",
  "muscle",
  "task",
  "exercise",
]);

const slug = z.string().min(1);
const name = z.string().min(1);
const int = z.number().int().nonnegative();

// ─── Endpoint 1 — GET /api/stats ─────────────────────────────────────────────

export const StatsResponseSchema = z
  .object({
    data: z
      .object({
        regions: int,
        joints: int,
        movements: int,
        muscles: int,
        functionalTasks: int,
        exercises: int,
        sources: int,
        relationships: z
          .object({
            movementMuscleLinks: int,
            exerciseMuscleLinks: int,
            cues: int,
            regressions: int,
            progressions: int,
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

// ─── Endpoint 2 — GET /api/search?q= ─────────────────────────────────────────

const SearchHit = z
  .object({
    slug,
    name,
    entityType: EntityTypeEnum,
  })
  .passthrough();

export const SearchResponseSchema = z
  .object({
    regions: z.array(SearchHit),
    joints: z.array(SearchHit),
    movements: z.array(SearchHit),
    muscles: z.array(SearchHit),
    tasks: z.array(SearchHit),
    exercises: z.array(SearchHit),
  })
  .passthrough();

// The empty-state response (query too short / missing) uses the same shape
// with empty arrays — no separate schema needed.

// ─── Shared exercise sub-shapes (endpoints 3 & 4) ────────────────────────────

const ExerciseMuscleRef = z
  .object({
    role: RoleEnum,
    notes: z.string().nullable().optional(),
    muscle: z
      .object({
        slug,
        name,
        origin: z.string().nullable().optional(),
        insertion: z.string().nullable().optional(),
        action: z.string().nullable().optional(),
        innervation: z.string().nullable().optional(),
      })
      .passthrough(),
  })
  .passthrough();

const ExerciseMovementRef = z
  .object({
    movement: z
      .object({
        slug,
        name,
        plane: z.string().nullable().optional(),
        axis: z.string().nullable().optional(),
        joint: z
          .object({
            slug,
            name,
            region: z.object({ slug, name }).passthrough(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

const ExerciseTaskRef = z
  .object({
    functionalTask: z
      .object({
        slug,
        name,
        description: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
      })
      .passthrough(),
  })
  .passthrough();

const ExerciseSourceRef = z
  .object({
    notes: z.string().nullable().optional(),
    source: z
      .object({
        slug,
        title: z.string().min(1),
        authors: z.string().nullable().optional(),
        year: z.number().int().nullable().optional(),
        journal: z.string().nullable().optional(),
        doi: z.string().nullable().optional(),
        sourceType: z.string().nullable().optional(),
      })
      .passthrough(),
  })
  .passthrough();

const Cue = z
  .object({ text: z.string().min(1), cueType: z.string().nullable().optional() })
  .passthrough();

const NamedStep = z
  .object({
    name,
    description: z.string(),
  })
  .passthrough();

// Per docs, list + detail return the same per-exercise shape.
export const ExerciseV1Schema = z
  .object({
    slug,
    name,
    description: z.string().nullable().optional(),
    dosing: z.string().nullable().optional(),
    emgNotes: z.string().nullable().optional(),
    evidenceLevel: z.string().nullable().optional(),
    difficulty: z.string().nullable().optional(),
    equipment: z.array(z.string()).optional(),
    bodyPosition: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    videoUrl: z.string().nullable().optional(),
    videoType: z.string().nullable().optional(),
    confidence: z.number(),
    status: StatusEnum,
    notes: z.string().nullable().optional(),
    muscles: z.array(ExerciseMuscleRef),
    movements: z.array(ExerciseMovementRef),
    functionalTasks: z.array(ExerciseTaskRef),
    cues: z.array(Cue),
    regressions: z.array(NamedStep),
    progressions: z.array(NamedStep),
    sources: z.array(ExerciseSourceRef),
  })
  .passthrough();

// ─── Endpoint 3 — GET /api/exercises ─────────────────────────────────────────

export const ExercisesListResponseSchema = z
  .object({
    count: int,
    exercises: z.array(ExerciseV1Schema),
  })
  .passthrough();

// ─── Endpoint 4 — GET /api/exercises/:slug ───────────────────────────────────

export const ExerciseDetailResponseSchema = z
  .object({ data: ExerciseV1Schema })
  .passthrough();

export const ExerciseNotFoundResponseSchema = z
  .object({ error: z.string().min(1) })
  .passthrough();

// ─── Endpoint 5 — GET /api/exercises/filters ─────────────────────────────────

export const FiltersResponseSchema = z
  .object({
    regions: z.array(z.object({ slug, name }).passthrough()),
    joints: z.array(
      z
        .object({
          slug,
          name,
          region: z.object({ slug, name }).passthrough(),
        })
        .passthrough(),
    ),
    movements: z.array(
      z
        .object({
          slug,
          name,
          joint: z
            .object({
              slug,
              name,
              region: z.object({ slug }).passthrough(),
            })
            .passthrough(),
        })
        .passthrough(),
    ),
    muscles: z.array(z.object({ slug, name }).passthrough()),
    tasks: z.array(
      z.object({ slug, name, category: z.string().nullable().optional() }).passthrough(),
    ),
    roles: z.array(RoleEnum),
    statuses: z.array(StatusEnum),
  })
  .passthrough();

// ─── Endpoint 6 — GET /api/muscles ───────────────────────────────────────────

const MuscleListItem = z
  .object({
    slug,
    name,
    origin: z.string(),
    insertion: z.string(),
    action: z.string(),
    innervation: z.string(),
    bloodSupply: z.string(),
    confidence: z.number(),
    status: StatusEnum,
    _count: z
      .object({
        movements: int,
        exercises: int,
      })
      .passthrough(),
  })
  .passthrough();

export const MusclesResponseSchema = z
  .object({
    data: z.array(MuscleListItem),
    meta: z
      .object({
        total: int,
        limit: int,
        offset: int,
        hasMore: z.boolean(),
      })
      .passthrough(),
  })
  .passthrough();

// ─── Endpoint 7 — GET /api/sources ───────────────────────────────────────────

const SourceListItem = z
  .object({
    slug,
    title: z.string().min(1),
    authors: z.string().nullable().optional(),
    year: z.number().int().nullable().optional(),
    journal: z.string().nullable().optional(),
    doi: z.string().nullable().optional(),
    pmid: z.string().nullable().optional(),
    pmcid: z.string().nullable().optional(),
    fulltextUrl: z.string().nullable().optional(),
    pdfUrl: z.string().nullable().optional(),
    _count: z.object({ entities: int }).passthrough(),
  })
  .passthrough();

export const SourcesDefaultResponseSchema = z
  .object({
    count: int,
    sources: z.array(SourceListItem),
  })
  .passthrough();

// RAG format is intentionally strict — adding fields to this projection is a
// version bump because LLM pipelines often strict-parse.
const SourceRagItem = z
  .object({
    slug,
    title: z.string().min(1),
    authors: z.string().nullable().optional(),
    year: z.number().int().nullable().optional(),
    journal: z.string().nullable().optional(),
    doi: z.string().nullable().optional(),
    pmid: z.string().nullable().optional(),
    pmcid: z.string().nullable().optional(),
    fulltextUrl: z.string().nullable().optional(),
    pdfUrl: z.string().nullable().optional(),
  })
  .strict();

export const SourcesRagResponseSchema = z
  .object({
    count: int,
    sources: z.array(SourceRagItem),
  })
  .passthrough();

// ─── Endpoint registry (used by the contract test) ───────────────────────────

export const v1Endpoints = {
  stats: StatsResponseSchema,
  search: SearchResponseSchema,
  exercisesList: ExercisesListResponseSchema,
  exerciseDetail: ExerciseDetailResponseSchema,
  exerciseNotFound: ExerciseNotFoundResponseSchema,
  filters: FiltersResponseSchema,
  muscles: MusclesResponseSchema,
  sourcesDefault: SourcesDefaultResponseSchema,
  sourcesRag: SourcesRagResponseSchema,
} as const;
