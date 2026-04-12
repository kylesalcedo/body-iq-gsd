# Body IQ API — v1 Contract

**Status:** v1 — frozen as of 2026-04-11
**Owner:** Kyle
**Purpose:** Define the stable HTTP surface that external consumers (Inyo Platform, desk habits app, future apps) can depend on without coordinating releases with Body IQ.

---

## The contract in one paragraph

Body IQ's v1 API surface is the seven endpoints listed below. **Fields documented here will not be renamed or removed as long as v1 is live.** New fields may appear at any time; consumers must ignore unknown fields. Internals — database schema, query layer, seed data, validation states, UI — are free to change. If you want to rename or remove a documented field, that change ships on `/api/v2/*`, not on `/api/v1/*`, and v1 keeps running until every consumer has migrated.

## The two rules

1. **No renaming a documented field on a v1 route.**
2. **No removing a documented field from a v1 route.**

That's the whole policy. Everything else is free.

## Things that are explicitly safe to do without version bump

- Add new scalar fields to any documented response
- Add new nested fields to any documented object
- Add new optional query parameters
- Add new endpoints under `/api/v1/...`
- Change the underlying Prisma schema, provided the documented response shapes still validate
- Refactor `src/lib/queries.ts`, `prisma/seed/**`, scripts, or the explorer UI however you like
- Add, remove, rename exercises/sources/muscles/etc. in the seed — **the data is not part of the contract; the shape is**
- Change the validation `status` of any entity (`draft → reviewed → verified`)
- Recalibrate confidence scores
- Add auth, rate limiting, caching headers, pagination, ordering, new filter params
- Add new values to open enums (e.g. new `entityType` variants in search results), as long as consumers are told "treat unknown values as unknown, not as error"

## Things that break v1 and require a v2 route

- Renaming any field in the response bodies below
- Removing any field in the response bodies below
- Changing the type of a field (string → object, array → scalar, etc.)
- Changing the HTTP status code for a documented case (e.g. 404 → 200 on not-found)
- Changing required query parameters (making optional → required, or dropping a parameter)
- Reorganizing an envelope shape (e.g. `{ data: [...] }` → `[...]` at the top level)

When you need any of the above, copy the route to `/api/v2/<same-path>` and change it there. Leave `/api/v1/<same-path>` running. When every known consumer has migrated, delete the v1 route and note the sunset date in a git commit.

---

## Current routing — v1 lives at `/api/*` today

The seven routes below are currently served at `/api/*` (e.g. `/api/exercises`), not `/api/v1/*`. Treat `/api/*` **as v1**. There are two acceptable evolutions from here:

**Lightweight (recommended):** leave routes at `/api/*`, treat them as v1, and when v2 is needed, stand up `/api/v2/*` as new routes. The root `/api/*` remains v1 forever.

**Explicit:** add a one-line redirect from `/api/v1/*` to `/api/*`, or duplicate the routes under `/api/v1/*`. This is only worth it if consumers actively prefer versioned URLs (Inyo's client will be fine either way).

The contract below is **route-agnostic** — it describes the shapes, not the URL prefix. Swap the prefix however you want without breaking v1.

---

## Endpoint 1 — `GET /api/stats`

Knowledge graph entity counts.

**Query params:** none.

**Response (200):**

```jsonc
{
  "data": {
    "regions": 10,
    "joints": 24,
    "movements": 66,
    "muscles": 107,
    "functionalTasks": 19,
    "exercises": 117,
    "sources": 309,
    "relationships": {
      "movementMuscleLinks": 301,
      "exerciseMuscleLinks": 466,
      "cues": 428,
      "regressions": 181,
      "progressions": 202
    }
  }
}
```

**Stability notes:**

- `data` is the envelope; all counts live under it.
- Counts are integers ≥ 0. Consumers must not assume any specific number — only that the field is present.
- Additional top-level keys under `data` (e.g. `exerciseMovementLinks`) may be added over time. Additional keys under `data.relationships` likewise.
- `data.relationships` is a stable sub-envelope; do not flatten.

---

## Endpoint 2 — `GET /api/search?q=<query>`

Global search across all entity types.

**Query params:**

- `q` — required string, minimum 2 characters after trim. Shorter queries return the empty-result shape.

**Response (200) — empty result (no query or query too short):**

```jsonc
{
  "regions": [],
  "joints": [],
  "movements": [],
  "muscles": [],
  "tasks": [],
  "exercises": []
}
```

**Response (200) — with matches:**

```jsonc
{
  "regions":   [{ "slug": "...", "name": "...", "entityType": "region",   /* plus other entity fields */ }],
  "joints":    [{ "slug": "...", "name": "...", "entityType": "joint",    /* ... */ }],
  "movements": [{ "slug": "...", "name": "...", "entityType": "movement", /* ... */ }],
  "muscles":   [{ "slug": "...", "name": "...", "entityType": "muscle",   /* ... */ }],
  "tasks":     [{ "slug": "...", "name": "...", "entityType": "task",     /* ... */ }],
  "exercises": [{ "slug": "...", "name": "...", "entityType": "exercise", /* ... */ }]
}
```

**Stability notes:**

- The six top-level arrays are part of the contract: `regions`, `joints`, `movements`, `muscles`, `tasks`, `exercises`. These will always be present, even when empty.
- Each result object is guaranteed to have `slug`, `name`, and `entityType`. Everything else on the object (currently raw entity fields from the Prisma record) is **not guaranteed** for v1 — consumers should only depend on `slug`, `name`, and `entityType`.
- `entityType` is one of: `"region" | "joint" | "movement" | "muscle" | "task" | "exercise"`. New entity types in v2 only.
- Result limit per type is currently 5. This may change without a version bump.

**Known v2 cleanup candidate:** tighten the per-result shape to a fixed `{ slug, name, entityType, [description] }` projection instead of spreading raw Prisma fields. Consumers relying on anything beyond `slug`/`name`/`entityType` are on unstable ground and should wait for v2.

---

## Endpoint 3 — `GET /api/exercises`

List/filter exercises. This is the main content-discovery endpoint.

**Query params (all optional):**

| Param | Type | Behavior |
|---|---|---|
| `q` | string | Full-text match on name/description, minimum 2 chars |
| `region` | csv of slugs | Filter to exercises whose movements belong to joints in these regions |
| `joint` | csv of slugs | Filter by joint |
| `movement` | csv of slugs | Filter by movement |
| `muscle` | csv of slugs | Filter by muscle |
| `task` | csv of slugs | Filter by functional task |
| `role` | csv | `primary`, `secondary`, `stabilizer`, `synergist`, `common_association` |
| `status` | csv | `draft`, `needs_review`, `reviewed`, `verified`, `disputed` |
| `minConfidence` | float 0–1 | Lower bound |
| `maxConfidence` | float 0–1 | Upper bound |

Multiple filters AND together. Values within one filter OR together (csv).

**Response (200):**

```jsonc
{
  "count": 12,
  "exercises": [
    {
      "slug": "hip-airplane",
      "name": "Hip Airplane",
      /* plus all Exercise scalar fields the Prisma schema exposes today */
      "muscles": [
        {
          "role": "primary",
          "muscle": { "slug": "gluteus-medius", "name": "Gluteus Medius" }
        }
      ],
      "movements": [
        {
          "movement": {
            "slug": "hip-external-rotation",
            "name": "Hip External Rotation",
            "joint": {
              "slug": "hip",
              "name": "Hip",
              "region": { "slug": "hip", "name": "Hip" }
            }
          }
        }
      ],
      "functionalTasks": [
        { "functionalTask": { "slug": "single-leg-stance", "name": "Single Leg Stance", "category": "balance" } }
      ],
      "cues": [{ "text": "...", "cueType": "...", "order": 1 /* etc */ }],
      "regressions": [{ "name": "...", "description": "...", "order": 1 /* etc */ }],
      "progressions": [{ "name": "...", "description": "...", "order": 1 /* etc */ }],
      "sources": [{ "source": { "slug": "...", "title": "..." } }]
    }
  ]
}
```

**Stability notes:**

- Envelope is `{ count, exercises }`. Both always present.
- **v1 guarantees the following per-exercise fields:** `slug`, `name`, `muscles[]`, `movements[]`, `functionalTasks[]`, `cues[]`, `regressions[]`, `progressions[]`, `sources[]`.
- **v1 guarantees the following shapes inside the arrays:**
  - `muscles[].role`, `muscles[].muscle.slug`, `muscles[].muscle.name`
  - `movements[].movement.slug`, `movements[].movement.name`, `movements[].movement.joint.slug`, `movements[].movement.joint.name`, `movements[].movement.joint.region.slug`, `movements[].movement.joint.region.name`
  - `functionalTasks[].functionalTask.slug`, `functionalTasks[].functionalTask.name`, `functionalTasks[].functionalTask.category`
  - `sources[].source.slug`, `sources[].source.title`
- **v1 does NOT guarantee** the full shape of cues, regressions, progressions, or the top-level exercise scalar fields beyond `slug` + `name`. These are returned today because the route uses a Prisma `include` rather than an explicit `select`. Consumers should read the detail endpoint (endpoint 4 below) if they need anything beyond the guaranteed fields, since the detail endpoint has a curated select.
- Ordering: exercises sorted by `name` ascending. Ordering may tighten (e.g. stable secondary sort) without a version bump but will never become random.

**⚠ Drift risk:** this route is the most fragile v1 endpoint because it returns raw Prisma output. Any schema change to the `Exercise` model that **removes** a scalar field will silently break the contract even though the documented v1 fields still work. Mitigation (safe under v1, highly recommended): **refactor the route to use an explicit `select` matching the detail route's projection**. The refactor is additive — consumers reading only the guaranteed fields see no change. That way v1 becomes machine-enforced instead of convention-enforced. See "v1 hardening tasks" at the bottom.

---

## Endpoint 4 — `GET /api/exercises/:slug`

Full detail for a single exercise. This is the curated, stable-shaped endpoint.

**Path param:** `slug` — exercise slug.

**Response (200):**

```jsonc
{
  "data": {
    "slug": "hip-airplane",
    "name": "Hip Airplane",
    "description": "...",
    "dosing": "...",
    "emgNotes": "...",
    "evidenceLevel": "...",
    "difficulty": "...",
    "equipment": ["..."],
    "bodyPosition": "...",
    "imageUrl": "...",
    "videoUrl": "...",
    "videoType": "...",
    "confidence": 0.85,
    "status": "reviewed",
    "notes": "...",
    "muscles": [
      {
        "role": "primary",
        "notes": "...",
        "muscle": {
          "slug": "gluteus-medius",
          "name": "Gluteus Medius",
          "origin": "...",
          "insertion": "...",
          "action": "...",
          "innervation": "..."
        }
      }
    ],
    "movements": [
      {
        "movement": {
          "slug": "hip-abduction",
          "name": "Hip Abduction",
          "plane": "...",
          "axis": "...",
          "joint": {
            "slug": "hip",
            "name": "Hip",
            "region": { "slug": "hip", "name": "Hip" }
          }
        }
      }
    ],
    "functionalTasks": [
      {
        "functionalTask": {
          "slug": "single-leg-stance",
          "name": "Single Leg Stance",
          "description": "...",
          "category": "balance"
        }
      }
    ],
    "cues": [{ "text": "...", "cueType": "..." }],
    "regressions": [{ "name": "...", "description": "..." }],
    "progressions": [{ "name": "...", "description": "..." }],
    "sources": [
      {
        "notes": "...",
        "source": {
          "slug": "...",
          "title": "...",
          "authors": "...",
          "year": 2022,
          "journal": "...",
          "doi": "...",
          "sourceType": "..."
        }
      }
    ]
  }
}
```

**Response (404):**

```jsonc
{ "error": "Exercise not found" }
```

**Stability notes:**

- Envelope is `{ data: {...} }` on success; `{ error: string }` with status 404 on not-found. Both are v1-frozen.
- All scalar fields listed above are v1-frozen: `slug`, `name`, `description`, `dosing`, `emgNotes`, `evidenceLevel`, `difficulty`, `equipment`, `bodyPosition`, `imageUrl`, `videoUrl`, `videoType`, `confidence`, `status`, `notes`.
- All nested shapes (`muscles[]`, `movements[]`, `functionalTasks[]`, `cues[]`, `regressions[]`, `progressions[]`, `sources[]`) are v1-frozen at the exact fields documented above.
- `muscles[]` is sorted by role ascending (primary first). Sort stability is v1-frozen.
- `cues[]`, `regressions[]`, `progressions[]` are sorted by their `order` field ascending. Sort stability is v1-frozen.
- `status` values: `draft | needs_review | reviewed | verified | disputed`. New status values are v2 only.

This is the endpoint Inyo's `@inyo/body-iq-client` should rely on for protocol rendering. It's the most defensible v1 surface in the whole API.

---

## Endpoint 5 — `GET /api/exercises/filters`

Filter options for the exercise finder. Populates dropdowns in consumer UIs.

**Query params:** none.

**Response (200):**

```jsonc
{
  "regions":   [{ "slug": "...", "name": "..." }],
  "joints":    [{ "slug": "...", "name": "...", "region": { "slug": "...", "name": "..." } }],
  "movements": [{ "slug": "...", "name": "...", "joint": { "slug": "...", "name": "...", "region": { "slug": "..." } } }],
  "muscles":   [{ "slug": "...", "name": "..." }],
  "tasks":     [{ "slug": "...", "name": "...", "category": "..." }],
  "roles":    ["primary", "secondary", "stabilizer", "synergist", "common_association"],
  "statuses": ["draft", "needs_review", "reviewed", "verified", "disputed"]
}
```

**Stability notes:**

- All seven top-level keys are v1-frozen.
- `regions[]`, `joints[]`, `movements[]`, `muscles[]`, `tasks[]` return objects with at minimum `slug` and `name`. Joints also include their `region`. Movements also include their `joint.region.slug`. Tasks include `category`.
- `roles[]` and `statuses[]` return the canonical enum values as of v1. New enum values are v2 only. Removing an enum value is v2 only.
- Ordering: all arrays sorted by `name` ascending.

---

## Endpoint 6 — `GET /api/muscles`

Paginated muscle list with search.

**Query params:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `q` | string | — | Case-insensitive match on `name`, `slug`, or `action` |
| `limit` | integer | 100 | Capped at 200 server-side |
| `offset` | integer | 0 | |

**Response (200):**

```jsonc
{
  "data": [
    {
      "slug": "gluteus-medius",
      "name": "Gluteus Medius",
      "origin": "...",
      "insertion": "...",
      "action": "...",
      "innervation": "...",
      "bloodSupply": "...",
      "confidence": 0.9,
      "status": "verified",
      "_count": {
        "movements": 4,
        "exercises": 12
      }
    }
  ],
  "meta": {
    "total": 107,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

**Stability notes:**

- Envelope is `{ data: [...], meta: {...} }`. Both v1-frozen.
- Per-muscle scalar fields v1-frozen: `slug`, `name`, `origin`, `insertion`, `action`, `innervation`, `bloodSupply`, `confidence`, `status`.
- `_count` is v1-frozen at `{ movements, exercises }`. Additional count keys may be added (e.g. `_count.sources`).
- `meta` keys v1-frozen: `total`, `limit`, `offset`, `hasMore`.
- Ordering: muscles sorted by `name` ascending.

---

## Endpoint 7 — `GET /api/sources`

Research sources with optional filtering and a RAG-friendly projection.

**Query params:**

| Param | Values | Behavior |
|---|---|---|
| `filter` | `fulltext` \| `pdf` | Return only sources where the corresponding URL is non-null |
| `format` | `rag` | Return the minimal RAG shape instead of the default shape |

**Response (200) — default format:**

```jsonc
{
  "count": 309,
  "sources": [
    {
      /* all ResearchSource scalar fields (raw Prisma include) */
      "slug": "...",
      "title": "...",
      "authors": "...",
      "year": 2022,
      "journal": "...",
      "doi": "...",
      "pmid": "...",
      "pmcid": "...",
      "fulltextUrl": "...",
      "pdfUrl": "...",
      "_count": { "entities": 4 }
    }
  ]
}
```

**Response (200) — `format=rag`:**

```jsonc
{
  "count": 75,
  "sources": [
    {
      "slug": "...",
      "title": "...",
      "authors": "...",
      "year": 2022,
      "journal": "...",
      "doi": "...",
      "pmid": "...",
      "pmcid": "...",
      "fulltextUrl": "...",
      "pdfUrl": "..."
    }
  ]
}
```

**Stability notes:**

- Envelope `{ count, sources }` is v1-frozen for both shapes.
- **Default format:** v1-guaranteed fields per source are `slug`, `title`, `authors`, `year`, `journal`, `doi`, `pmid`, `pmcid`, `fulltextUrl`, `pdfUrl`, `_count.entities`. Other fields may be present from raw Prisma output but are **not guaranteed** under v1.
- **RAG format** (`format=rag`): v1-frozen at exactly these fields: `slug`, `title`, `authors`, `year`, `journal`, `doi`, `pmid`, `pmcid`, `fulltextUrl`, `pdfUrl`. The RAG shape is deliberately minimal — consumers can depend on no other fields being present in the RAG projection, which means new additions to the RAG shape are a version bump (because LLM pipelines often validate strict shapes).
- `filter=fulltext` and `filter=pdf` narrow the result set. Empty result set returns `{ "count": 0, "sources": [] }` — never 404.
- Ordering: sources sorted by `title` ascending in both formats.

**Special note on RAG format:** this is the endpoint Inyo's Year 2 translation layer (ADR-005 compliant — LLM as explanation, not reasoning) will consume. Treat it as the strictest v1 surface in the whole API. Adding a field here requires the same care as removing one.

---

## Consumer registry

Track every consumer of Body IQ v1 here. When a consumer integrates, add a row. When a consumer migrates off v1, update the row. When the registry is empty for a given v1 route, that route is free to be retired.

| Consumer | Routes consumed | Added | Contact |
|---|---|---|---|
| Desk habits app | _(fill in when confirmed)_ | — | Kyle |
| Inyo Platform | TBD — likely `exercises`, `exercises/:slug`, `sources?format=rag` | — | Kyle |

Adding a row is free. Removing a row requires confirming the consumer is actually gone.

---

## How to add a new v1-safe field

Happens all the time. Zero ceremony required:

1. Add the field to the Prisma schema + seed data + query.
2. Add the field to the route's `select` (or it'll come through automatically on `include`-based routes).
3. Add one line to the relevant section in this document under "Stability notes" or in the example JSON.
4. Ship it. No version bump.

Consumers won't break — they'll just start seeing the new field on their next request and can opt to read it whenever they want.

## How to cut v2 when you need it

1. Copy the route file to `src/app/api/v2/<path>/route.ts`.
2. Make the breaking change on the v2 copy.
3. Add a v2 section to this document (new file `docs/api-v2.md` once v2 exists).
4. Tell every consumer listed in the registry above that v2 is available.
5. Wait until the registry shows no v1 consumers for that route.
6. Delete the v1 route. Note the sunset date in a commit message.

Most routes will never need v2. Don't preemptively create it.

---

## v1 hardening tasks (optional, additive, improve stability without breaking anything)

Not required, but each of these strengthens v1 without being a breaking change. Do them when you have a quiet hour.

- [ ] **Convert `/api/exercises` list route to explicit `select`** matching the detail route's projection. Removes drift risk from raw Prisma output. Biggest single stability win.
- [ ] **Convert `/api/sources` default format to explicit `select`** with the v1-guaranteed fields plus `_count.entities`. Same reasoning.
- [ ] **Add a Zod schema file at `src/lib/schemas/api-v1.ts`** defining one schema per endpoint response. Parse every response through the schema in dev mode; fail tests on mismatch. This turns v1 from documentation into machine-enforced contract.
- [ ] **Add a contract-test CI job** that hits each documented endpoint on a seeded database and validates the response against the v1 Zod schema. If the job goes red, you renamed or removed a field without bumping.
- [ ] **Move routes to `/api/v1/*`** (or add a redirect). Only worth it if a consumer asks for versioned URLs.
- [ ] **Publish this doc as a page in the explorer** at `/api-docs/v1` alongside the existing API Reference.

Each task is additive and never breaks an existing consumer.

---

## What v1 does NOT cover

Body IQ may add any of the following over time. None of them are v1 contracts; each would get its own section when/if introduced.

- **Write endpoints** (`POST`, `PATCH`, `DELETE`) — v1 is read-only. Write endpoints require their own versioning discipline because they have side effects.
- **Authentication** — v1 is public. Adding auth is additive if optional, breaking if required. Required auth goes on v2 routes (or a separate `/api/authenticated/*` tree).
- **Webhook subscriptions / push updates** — not in scope.
- **Bulk exports** (e.g. downloading the entire graph as one blob) — not in scope; can be added as a new endpoint without touching v1.
- **GraphQL surface** — completely separate from the REST v1 contract.

---

## Changelog

| Date | Change |
|---|---|
| 2026-04-11 | Initial v1 freeze. All 7 routes documented from current implementation. |
