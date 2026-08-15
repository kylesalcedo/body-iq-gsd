---
type: decision
status: current
updated: 2026-08-05
links: [../concepts/knowledge-graph-model, ../concepts/api-contract, 2026-07-04-role-weighting, 2026-07-04-discovery-views]
---

# ADR: Progression/regression as typed graph edges

**Date:** 2026-08-05 · **Status:** accepted (implemented 2026-08-14)

## Context

`Regression` and `Progression` were authored as prose rows hanging off an
exercise — a `name` and a `description`, no link to anything. A later addition
(`targetExerciseId`, `criterion`) made a real FK edge possible, but only the
audit importers (`extensions/apply-audit.ts`, `scripts/import-audit.ts`)
populate it. Everything seeded by hand or by the researched-exercise
extensions is still prose.

The consequence is in `getProgressionLadders` (`src/lib/queries.ts:592-607`):
ladder steps are matched to real exercises by **normalizing the step name and
comparing strings**. `/progressions` renders a matched step as a bold linked
chip and an unmatched one as a muted dead end. The ladder is therefore an
artifact of naming luck, not of the graph. "Single-Leg Bridge" resolves only if
some exercise happens to be named that.

Three further gaps follow from the same root:

1. **No traversal.** You cannot ask the graph "give me the full chain from
   wall push-up to archer push-up." Each hop is a string, so there is nothing
   to walk.
2. **No stated reason.** Every exercise database on the internet asserts that
   the incline push-up precedes the floor push-up. None of them say *why*. The
   difficulty delta here is a moment arm, not added mass — and this project
   holds the joint, plane, and axis data needed to say so.
3. **Asymmetry.** "A progresses to B" and "B regresses to A" are the same
   authored fact recorded twice, by hand, with no guarantee they agree.

Adding bodyweight progression ladders (push / pull / squat / hinge / core)
forces the issue: those ladders *are* chains of exercise nodes with explicit
achievement gates, and they are worthless as prose.

## Decision

**1. The FK edge is the primary representation.** `targetExerciseId` is the
canonical link. Prose `name` + `description` are retained for steps that have
no node yet — a *stub step* — and remain valid authored content. A step is
"linked" when `targetExerciseId` is set; name-matching in
`getProgressionLadders` is demoted to an explicit fallback and reported, not
relied upon.

**2. Every edge carries a mechanism.** A new `ProgressionMechanism` enum on
both `Regression` and `Progression` names *what changes* between the two
exercises:

| Mechanism | What increases | Example |
|---|---|---|
| `leverage` | external moment arm / centre-of-mass position | incline → floor push-up; tuck → full L-sit |
| `range` | joint excursion at the same leverage | sit-to-stand → full-depth squat |
| `unilateral` | share of load taken by one limb | squat → split squat; push-up → archer |
| `stability` | base-of-support or surface demand | assisted → unassisted pistol |
| `tempo` | time under tension, pauses | 1-s → 5-s eccentric |
| `contraction_type` | isometric → eccentric-only → full | support hold → negative dip → dip |
| `added_load` | external mass | bodyweight hinge → RDL |
| `speed` | rate of force development | squat → jump squat |
| `volume` | reps/sets/duration only | — |
| `complexity` | coordination or sequencing demand | bridge → marching bridge |

Categorical, not numeric — for the same reason muscle role is categorical
([[2026-07-04-role-weighting]]): a numeric difficulty scalar implies a
precision the corpus does not have.

**3. `criterion` is expected on every edge.** On a `Progression` it is the
achievement gate ("3×10 knee push-ups holding a straight shoulder-to-knee
line"). On a `Regression` it is the clinical trigger to step back ("anterior
shoulder pain above 3/10, or the hips break the line"). Nullable in the
schema, required by the data-quality check.

**4. One authored rung, two rows.** Authors write a single directed rung
(`from → to`, mechanism, gate, regress-trigger). The seed layer materializes
both the `Progression` on `from` and the mirrored `Regression` on `to`. This
removes the hand-maintained asymmetry.

**5. `order` sequences rungs within a ladder**, unchanged. Audit-imported edges
keep `order: 99` and sort last.

## Consequences

- **Schema.** Additive and nullable: a new enum plus one optional column on
  each of two tables. `pnpm db:push`; no destructive migration.
- **API contract.** Additive per [[../concepts/api-contract]] — `mechanism`
  appears alongside the existing `name`/`description`/`criterion`/`targetSlug`
  on progression and regression objects. No v1 field is renamed or removed.
  `mcp/server.ts` already emits `targetSlug`; it gains `mechanism` for free.
- **`/progressions`.** Ladders become real traversals. The view can render the
  mechanism as the reason for each hop, and can distinguish a genuine stub step
  from a link that merely failed to name-match.
- **`pnpm data:quality`.** Two new checks: edges missing a `criterion`, and
  ladder steps whose name matches an existing exercise but whose
  `targetExerciseId` is null (i.e. a backfill candidate).
- **Backfill is incremental.** Existing prose steps stay valid and render
  exactly as they do today. Nothing breaks on the day the column lands; edges
  get linked ladder by ladder.
- **Authoring friction.** A new rung now costs a mechanism and a gate. This is
  friction by design, same as role assignment.

## Alternatives rejected

- **Numeric difficulty scalar on Exercise.** Ordering exercises on a 0–100
  scale would make ladders fall out for free, but difficulty is not a total
  order — an archer push-up and a diamond push-up are both "harder than a
  push-up" along different axes, and a scalar cannot say which axis. Same
  objection as numeric muscle activation in [[2026-07-04-role-weighting]].
- **A single `ExerciseDifficultyEdge` table replacing both.** Cleaner as a
  model, but it deletes the prose steps (real authored content, often the only
  record of a variation with no node) and breaks the frozen v1 shape of
  `/api/exercises/[slug]`. Not worth it.
- **Keeping name-matching, improving the normalizer.** Fuzzier matching trades
  silent misses for silent false links, which is worse in a graph whose selling
  point is knowing what it does and does not know.

## Open questions

- Should `mechanism` be multi-valued? A negative dip → full dip arguably
  changes both `contraction_type` and `tempo`. Single-valued for now; the
  authored rung picks the *dominant* mechanism, and the edge note carries the
  rest. Revisit if authors keep fighting it.
- Should stub steps eventually be forbidden — i.e. every rung must have a node?
  Deferred. Stubs are how thin areas of the graph honestly report themselves.
