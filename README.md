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
| Regions | 10 |
| Joints | 24 |
| Movements | 66 |
| Muscles | 107 |
| Movement–Muscle Links | 301 |
| Functional Tasks | 19 |
| Exercises | 103 |
| Exercise–Muscle Links | 390 |
| Exercise–Movement Links | 247 |
| Cues | 363 |
| Regressions | 155 |
| Progressions | 174 |
| Research Sources | 282 |
| Source–Entity Links | 737 |

### Research Sources & Evidence

- **282 research sources** — journal articles, systematic reviews, clinical practice guidelines, and textbooks
- **274 with DOIs**, **192 with PubMed IDs**, **75 with PMC IDs**
- **98 free fulltext articles** with direct links (75 with PDF URLs)
- Sources resolved via PubMed, CrossRef, and Europe PMC APIs
- Re-run resolution: `npx tsx scripts/resolve-sources.ts`

### Regions Covered

Cervical Spine, Thoracic Spine, Shoulder, Elbow, Wrist, Hand, Lumbar Spine, Hip, Knee, Ankle

### Evidence-Based Exercise Coverage

103 exercises across all 10 regions, each with research-backed muscle activation data, dosing recommendations, cues, regressions, progressions, and evidence notes with citations. Sources span 282 peer-reviewed references (1980–2026).

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
- **Exercise Finder** — filter by region, joint, movement, muscle, functional task, role, status, confidence
- **Sources** — filter by free fulltext / PDF available, with direct download links
- **Validation Queue** — lists draft items, low confidence entries, items flagged for review
- **API Reference** — interactive API docs with live "Try it" explorer
- **Global Search** — search across all entity types with debounced instant results
- **Sidebar Navigation** — Regions, Joints, Movements, Muscles, Tasks, Exercises, Sources, API Reference, Validation Queue

## API

All endpoints return JSON. Interactive docs at [/api-docs](http://localhost:3000/api-docs).

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats` | Knowledge graph statistics |
| `GET /api/search?q=` | Search across all entity types |
| `GET /api/exercises` | List/filter exercises (region, muscle, movement, task, role, status, confidence) |
| `GET /api/exercises/:slug` | Full exercise detail with muscles, movements, cues, sources |
| `GET /api/exercises/filters` | Available filter options |
| `GET /api/muscles` | List/search muscles |
| `GET /api/sources` | Sources with fulltext/PDF filtering |

### RAG Integration

Get all sources with free PDF links for RAG ingestion:

```
GET /api/sources?filter=pdf&format=rag
```

Returns 75 sources with direct PMC PDF URLs, minimal payload (slug, title, authors, year, journal, doi, pmid, pmcid, fulltextUrl, pdfUrl).

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

### Source Resolution

```bash
# Resolve DOIs, PMIDs, PMC IDs, and free fulltext URLs for all sources
npx tsx scripts/resolve-sources.ts
```

Uses PubMed, CrossRef, and Europe PMC APIs (no auth required). Results cached in `scripts/resolved-sources.json`.

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
│   ├── schema.prisma          # Database schema
│   └── seed/                  # Seed data scripts
│       ├── seed.ts            # Orchestrator
│       ├── regions.ts         # 10 anatomical regions
│       ├── joints.ts          # 24 joints
│       ├── movements.ts       # 66 movements
│       ├── muscles.ts         # 107 muscles + 301 weighted links
│       ├── functional-tasks.ts # 19 functional tasks
│       ├── exercises.ts       # 103 exercises with full details
│       └── sources.ts         # 282 research sources + evidence links
├── scripts/
│   ├── data-quality.ts        # Data quality checker
│   ├── resolve-sources.ts     # DOI/PMID/fulltext resolver
│   └── resolved-sources.json  # Cached resolution results
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── regions/           # Region list + detail
│   │   ├── joints/            # Joint list + detail
│   │   ├── movements/         # Movement list + detail
│   │   ├── muscles/           # Muscle list + detail
│   │   ├── tasks/             # Functional task list + detail
│   │   ├── exercises/         # Exercise list + detail
│   │   ├── sources/           # Source list + detail (fulltext/PDF filtering)
│   │   ├── finder/            # Exercise finder with faceted filters
│   │   ├── validation/        # Validation queue
│   │   ├── api-docs/          # Interactive API reference
│   │   └── api/               # REST API routes
│   ├── components/            # Shared UI components
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── queries.ts         # Data access functions
│       ├── utils.ts           # Utility functions
│       └── schemas/           # Zod validation schemas
└── agent-instructions.md      # Original project spec
```
