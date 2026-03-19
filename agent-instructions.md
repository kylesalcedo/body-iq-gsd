# Movement Knowledge Engine — Body IQ

You are a senior full-stack engineer, systems architect, and clinical knowledge systems designer.

Your task is to autonomously design and scaffold a project called:

## Movement Knowledge Engine

Goal:
Create a **validation-first biomechanics and physical therapy knowledge system** that structures movement knowledge and supports future products.

Core knowledge flow:

Region
→ Joint
→ Movement
→ Muscle
→ Muscle Anatomy (Origin / Insertion / Action / Innervation / Blood Supply)
→ Functional Tasks
→ PT Exercises
→ Exercise logic (cues, regressions, progressions)
→ Evidence + validation metadata

The system must NOT just generate static data.
It must create a **clean schema, seed dataset, validation system, and explorer UI** so a human expert can review and expand it.

The final system should support future uses such as:

- exercise program generators
- anatomy learning tools
- movement coaching tools
- clinical documentation assistants
- content generation pipelines
- RAG knowledge bases

---

## Core Principles

### 1. Validation-first

All records must support:

- status (draft | needs_review | reviewed | verified | disputed)
- confidence score
- editorial notes
- reviewer
- review date
- evidence sources

### 2. Start with high-yield foundations

Seed data should include:

- common joints
- common movements
- common muscles
- common PT exercises

Avoid obscure or niche content in the initial dataset.

### 3. Separate knowledge layers

Do not mix anatomy with programming logic.

**Anatomy layer:**
Region → Joint → Movement → Muscle → O/I/A/N/B

**Programming layer:**
Functional task → Exercise → cues/regressions/progressions

**Evidence layer:**
Sources, confidence, validation.

### 4. Explorer UI is mandatory

The system must include a UI to browse and validate the knowledge graph.

---

## Recommended Stack

Use unless a strong reason exists otherwise:

- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Zod validation
- pnpm

Python only if needed for ingestion scripts (use `uv`).

---

## Data Model

Design normalized schema for:

- Region
- Joint
- Movement
- Muscle
- Innervation
- BloodSupply
- FunctionalTask
- Exercise
- Cue
- Regression
- Progression
- ResearchSource
- ValidationRecord
- EditorialNote
- Tag

Important rules:

- Region → many joints
- Joint → many movements
- Movement → many muscles
- Muscle → many movements
- Movement → many functional tasks
- Task → many exercises
- Exercise → many cues/regressions/progressions
- Sources attachable to multiple entities

Each entity must support:

- slug
- status
- confidence
- notes
- created_at
- updated_at

Muscle must include:

- origin
- insertion
- action
- innervation
- blood_supply

---

## Relationship Role Weighting (Critical)

Movement–muscle and exercise–muscle relationships must NOT be binary.

Each relationship must include a **role field**:

- primary
- secondary
- stabilizer
- synergist
- common_association

Example:

Shoulder External Rotation
→ Infraspinatus (primary)
→ Teres Minor (primary)
→ Posterior Deltoid (secondary)

Example:

Squat
→ Quadriceps (primary)
→ Gluteus Maximus (primary)
→ Adductors (secondary)
→ Erector Spinae (stabilizer)

This improves:

- exercise reasoning
- coaching systems
- program generation
- biomechanical realism

---

## Validation Framework

Implement 4 layers.

### Structural

Detect:

- orphan relations
- duplicate slugs
- invalid references
- empty required fields

### Editorial

Allow reviewer to judge:

- exercise usefulness
- movement mapping
- cue clarity
- progression logic

### Evidence

Allow sources and confidence scoring.

### Product

Allow identifying:

- incomplete entries
- missing relationships
- weak data quality

Include a **validation queue UI** listing:

- draft entries
- missing sources
- low confidence
- orphan data
- duplicates

---

## Seed Dataset

Generate a **focused high-quality seed dataset**.

Regions:

- shoulder
- elbow
- wrist
- hand
- hip
- knee
- ankle

Movement examples:

- flexion
- extension
- abduction
- adduction
- internal rotation
- external rotation
- pronation
- supination
- radial deviation
- ulnar deviation

Functional task examples:

- reaching overhead
- pushing up from chair
- gripping cup
- opening jar
- typing
- walking
- stair climbing
- squat to stand

Common PT exercises:

- bridge
- clamshell
- squat
- sit-to-stand
- heel raise
- calf stretch
- wrist flexor stretch
- wrist extensor stretch
- scapular retraction
- resisted external rotation
- straight leg raise
- terminal knee extension

Each exercise must include:

- description
- target movements
- muscle roles (primary / secondary / stabilizer)
- functional relevance
- 1–3 cues
- 1–2 regressions
- 1–2 progressions
- status
- confidence
- notes

If uncertain, mark confidence low rather than guessing.

Prefer **widely accepted PT reasoning** rather than obscure interpretations.

---

## Explorer UI

Build an internal **knowledge explorer**.

Sidebar sections:

- Regions
- Joints
- Movements
- Muscles
- Functional Tasks
- Exercises
- Validation Queue
- Sources

Entity page should display:

- summary
- status/confidence badges
- relationships
- notes
- sources
- validation history

Include:

- global search
- filter by status
- filter by confidence
- filter missing sources

Optional but helpful:

- relationship tree or graph view

---

## Data Quality Utilities

Include scripts or utilities to detect:

- duplicate entries
- orphan relations
- missing sources
- low-confidence entries
- empty fields

---

## Deliverables

Produce in this order:

1. System architecture overview
2. Prisma schema
3. Zod validation schemas
4. Seed dataset
5. Next.js project scaffold
6. Explorer UI pages
7. Validation queue
8. Data quality scripts
9. README setup instructions
10. MVP roadmap (MVP → v1 → v2)

Generate **real scaffold code**, not only ideas.

Prefer copy-pasteable files.

---

## Quality Rules

- Do not fabricate certainty
- Mark uncertainty explicitly
- Do not generate fake citations
- Prefer conservative domain claims
- Keep the schema extensible

Optimize for:

- clarity
- correctness
- validation
- future product leverage
