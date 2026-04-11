# Exercise Video Generation — Phased Roadmap

**Status:** Planning
**Owner:** Dr. Kyle Salcedo, PT, DPT
**Last updated:** 2026-04-10

## Goal

Every exercise in the knowledge base has a clinician-verified visual demonstration. Short-term this is achieved via YouTube search links; long-term via AI-generated demonstration videos (Seedance / Veo / Sora / Runway-class models) reviewed and approved by a licensed clinician.

## Why not generate now

Current generative video models (as of Q1 2026) are not yet reliable for clinical-grade exercise demonstration. Specific failure modes observed in the literature and in common testing:

1. **Anatomical precision** — models produce *plausible* gym motion, not *correct* PT mechanics. They can't reliably hit specific joint angles (e.g., 60° hip flexion, scapular plane abduction vs pure frontal abduction), muscular cues ("knee tracks over second toe"), or end-range control.
2. **Identity and proportion drift** — the same person's body proportions and clothing wobble across a 5–10 second clip, making form comparison between reps impossible.
3. **Resistance realism** — band tension, cable angles, and dumbbell weight all look uncanny. Bar paths through the body in compound lifts are a frequent failure.
4. **Multi-phase instructions** — prompts like "start prone, lift opposite arm/leg, hold, return" rarely render as a clean temporal sequence; models blend phases or skip them.
5. **Rep consistency** — rep 1 and rep 3 often look like different exercises.
6. **Fine-motor content** — hand/finger detail is unreliable; AI video should be skipped entirely for the Hand region until models improve.

## What works now

- **Single-phase stills** — start, mid, and end positions generated as images
- **Short (3–5 sec) single-rep clips** with one camera angle for simpler bodyweight movements (bridges, planks, basic stretches)
- **Image-to-video** on a known-good starting still rather than pure text-to-video (better consistency)
- **B-roll and aesthetic cuts** that don't carry instructional load

## Phased rollout

### Phase 0 — YouTube search link (SHIPPED)

Every exercise detail page has a "Watch on YouTube" button that opens a YouTube search for the exercise name. Zero storage, zero maintenance, always works. Implemented in `src/app/exercises/[slug]/page.tsx`.

### Phase 1 — Structured position data (SCAFFOLDED)

Add structured position/ROM fields to `Exercise` so the data supports future video generation AND improves the exercise detail page today:

- `startPosition` — detailed narrative of the starting body position
- `endPosition` — mirror of `startPosition`
- `rom` — range of motion specification
- `cameraView` — preferred camera angle
- `videoPrompt` — canonical prompt for video generation (filled iteratively)

Status: fields added to `prisma/schema.prisma` as of 2026-04-10. They're nullable so they don't block existing records.

**Next:** Write a prompt template (`prompts/exercise-video-specifications.md`) that instructs an LLM to populate these fields from the existing `description`, `cues`, `startPosition`, and `bodyPosition` data. Run it as a batch pass across the 117 exercises.

### Phase 2 — Multi-video schema (SCAFFOLDED)

Replace the single `videoUrl`/`videoType` field pattern with an `ExerciseVideo` model that allows multiple videos per exercise, each with:

- `videoType` — `youtube-embed` / `youtube-link` / `hosted` / `ai-generated` / `image-sequence`
- `url` — external URL if applicable
- `thumbnailUrl`
- `prompt` — the generation prompt (for reproducibility)
- `model` — which model generated it (e.g. `seedance-v1`, `veo-3`)
- `generatedAt`
- `verified` / `verifiedBy` / `verifiedAt` — clinician review gate
- `quality` — 1–5 subjective rating
- `priority` — ordering (higher = shown first)

Status: model added to `prisma/schema.prisma` as of 2026-04-10. The legacy `videoUrl`/`videoType` fields on `Exercise` are retained for now; they'll be deprecated once ExerciseVideo is wired up.

**Next:** Build admin UI for adding/reviewing videos. Build frontend player that prefers the highest-priority verified video for each exercise and falls back to the YouTube search link otherwise.

### Phase 3 — Pilot generation (FUTURE)

When you're ready to test AI generation:

1. Pick 10 exercises with high-confidence `videoPrompt` values and simple mechanics (e.g., glute bridge, bird dog, wall push-up, seated pronation/supination, standing calf raise, single-leg balance, clamshell, dead bug, child's pose, cat-cow). Avoid: anything with equipment, anything with the hand region, anything multi-phase.
2. Generate 3 candidates per exercise with different prompts/seeds.
3. Personal review session — rate 1–5, mark `verified: true` only if it passes a clinician sniff test.
4. Compare models side-by-side for your specific content style.

**Budget estimate:** API video gen runs ~$0.10–$0.50/clip. 10 exercises × 3 candidates = ~$3–$15 for the pilot. Scaling to all 117 exercises × 3 candidates = ~$35–$175. Cheap compared to reviewer time.

### Phase 4 — Broader generation + review queue (FUTURE)

Once the pilot reveals the right model, prompt style, and review cadence:

1. Extend `getValidationQueue()` to include `ExerciseVideo` records where `verified = false`.
2. Build a review UI (play video, see the source prompt and exercise description side-by-side, thumbs up/down, optional quality rating).
3. Run batch generation for all exercises where `videoPrompt` is populated.
4. Review in batches of 10–20 per session.
5. Verified videos auto-promote to the exercise detail page.

### Phase 5 — Composite sequences (FUTURE)

For exercises where single-shot generation fails (common):

- Generate a start-position still, mid-position still, end-position still
- Animate between them using image-to-video or frame interpolation
- Store as `videoType: "image-sequence"` with the three source images

This yields cleaner rep consistency than pure text-to-video.

## Schema changes already made (2026-04-10)

```prisma
model Exercise {
  // ... existing fields ...
  startPosition String?
  endPosition   String?
  rom           String?
  cameraView    String?
  videoPrompt   String?
  videos        ExerciseVideo[]
}

model ExerciseVideo {
  id           String   @id @default(cuid())
  exerciseId   String
  exercise     Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  videoType    String
  url          String?
  thumbnailUrl String?
  prompt       String?
  model        String?
  generatedAt  DateTime?
  verified     Boolean  @default(false)
  verifiedBy   String?
  verifiedAt   DateTime?
  quality      Int?
  priority     Int      @default(0)
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([exerciseId])
  @@index([verified])
}
```

No existing records or code paths are affected — all new fields are nullable and all new relations are optional. The legacy `videoUrl`/`videoType` fields on Exercise are retained for backward compatibility and will be migrated during Phase 2.

## Open questions

- **Storage:** if we end up hosting AI-generated videos ourselves, where? CDN + object store (Cloudflare R2, S3) is the obvious answer but adds ops overhead.
- **Clinician attribution:** does the verifying PT's name/license get displayed publicly on the video, or just stored internally? (Affects liability framing.)
- **Content moderation:** AI-generated humans can fail in unsettling ways. We need a hard quality gate before anything goes public.
- **Licensing:** what rights do we have to AI-generated video under the API provider's terms? Need to check per provider before committing to one.
- **Accessibility:** captions / audio descriptions should be generated at the same time as the video so the player has text alongside visual.
