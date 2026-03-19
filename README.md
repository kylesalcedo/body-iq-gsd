# Body IQ — Movement Knowledge Engine

A validation-first biomechanics and physical therapy knowledge system that structures movement knowledge into a queryable, reviewable knowledge graph.

## What It Does

Models the full biomechanics chain:

**Region → Joint → Movement → Muscle (O/I/A/N/B) → Functional Task → Exercise (cues, regressions, progressions) → Evidence**

Every entity carries validation metadata (status, confidence, sources, editorial notes). Muscle-movement and muscle-exercise relationships are **weighted by role** (primary, secondary, stabilizer, synergist).

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running on localhost:5432)
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment file and configure DATABASE_URL
cp .env.example .env
# Edit .env with your PostgreSQL connection string if different from default

# Push schema to database
pnpm db:push

# Seed the knowledge graph
pnpm db:seed

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the explorer.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Validation:** Zod
- **Package Manager:** pnpm

## Knowledge Graph

### Seed Data Counts

| Entity | Count |
|--------|-------|
| Regions | 7 |
| Joints | 13 |
| Movements | 31 |
| Muscles | 39 |
| Movement–Muscle Links | 65 |
| Functional Tasks | 8 |
| Exercises | 12 |
| Exercise–Muscle Links | 40 |
| Cues | 33 |
| Regressions | 16 |
| Progressions | 20 |
| Research Sources | 5 |

### Regions Covered

Shoulder, Elbow, Wrist, Hand, Hip, Knee, Ankle

### Muscle Role Weighting

Every movement-muscle and exercise-muscle relationship includes a role:

- **Primary** — main mover for this action
- **Secondary** — significant contributor
- **Stabilizer** — stabilizes the joint during the action
- **Synergist** — assists the primary mover
- **Common Association** — frequently associated but not a direct mover

## Explorer UI

The web explorer provides:

- **Dashboard** — counts for all entity types with quick navigation
- **Entity list pages** — all entity types with status badges and confidence indicators
- **Entity detail pages** — full anatomy (O/I/A/N/B), weighted muscle roles, related entities, sources
- **Validation Queue** — lists draft items, low confidence entries, items flagged for review
- **Global Search** — search across all entity types with debounced instant results
- **Sidebar Navigation** — Regions, Joints, Movements, Muscles, Tasks, Exercises, Sources, Validation Queue

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm db:push          # Push Prisma schema to database
pnpm db:seed          # Seed the knowledge graph (idempotent)
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Regenerate Prisma client
pnpm validate:schemas # Run Zod schema validation tests
pnpm data:quality     # Run data quality checks
```

## Data Quality Checks

The `pnpm data:quality` script detects:

- Orphan movements (no muscle associations)
- Orphan muscles (no movement or exercise associations)
- Exercises without cues
- Exercises without regressions/progressions
- Entities missing research sources
- Low confidence entries (< 50%)
- Cross-type slug collisions

## Validation Framework

Every entity supports a 4-layer validation model:

1. **Structural** — schema constraints, FK integrity, required fields
2. **Editorial** — human reviewer judgment on accuracy and usefulness
3. **Evidence** — linked research sources with confidence scoring
4. **Product** — data completeness for downstream use (validation queue)

Entity statuses: `draft` → `needs_review` → `reviewed` → `verified` (or `disputed`)

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (15 models)
│   └── seed/                  # Seed data scripts
│       ├── seed.ts            # Orchestrator
│       ├── regions.ts         # 7 anatomical regions
│       ├── joints.ts          # 13 joints
│       ├── movements.ts       # 31 movements
│       ├── muscles.ts         # 39 muscles + 65 weighted links
│       ├── functional-tasks.ts # 8 functional tasks
│       ├── exercises.ts       # 12 exercises with full details
│       └── sources.ts         # 5 research sources
├── scripts/
│   └── data-quality.ts        # Data quality checker
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── regions/           # Region list + detail
│   │   ├── joints/            # Joint list + detail
│   │   ├── movements/         # Movement list + detail
│   │   ├── muscles/           # Muscle list + detail
│   │   ├── tasks/             # Functional task list + detail
│   │   ├── exercises/         # Exercise list + detail
│   │   ├── sources/           # Source list + detail
│   │   ├── validation/        # Validation queue
│   │   └── api/search/        # Search API route
│   ├── components/            # Shared UI components
│   │   ├── badges.tsx         # Status, confidence, role badges
│   │   ├── search.tsx         # Global search bar
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   └── ui-helpers.tsx     # Card, links, headers
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── queries.ts         # Data access functions
│       ├── utils.ts           # Utility functions
│       └── schemas/           # Zod validation schemas
│           ├── index.ts       # All entity schemas
│           └── validate.ts    # Schema test runner
└── agent-instructions.md      # Original project spec
```

## Future Roadmap

### MVP (current)
- ✅ Normalized schema with validation metadata
- ✅ Weighted muscle-movement/exercise relationships
- ✅ Seed dataset with accurate PT content
- ✅ Explorer UI with search and navigation
- ✅ Validation queue
- ✅ Data quality scripts

### v1
- Inline editing of entities from the explorer
- Editorial review workflow (approve/dispute/comment)
- Bulk import/export (CSV/JSON)
- Relationship graph visualization
- Advanced filtering and faceted search

### v2
- Exercise program generator
- Anatomy learning mode
- Movement coaching tools
- Clinical documentation assistant
- RAG knowledge base integration
- Content generation pipelines
