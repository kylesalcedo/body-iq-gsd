# Body IQ — Data Quality Audit & Next Steps

Generated: 2026-03-26

## Current State

| Entity | Original | Final | Δ |
|---|---|---|---|
| Muscles | 60 | **105** | +45 |
| Movements | 60 | **66** | +6 |
| Movement-Muscle Links | 162 | **284** | +122 |
| Sources | 36 | **120** | +84 |
| Source-Entity Links | 364 | **480** | +116 |

All 10 anatomical regions evidence-verified via OpenEvidence:
Shoulder ✅ | Knee ✅ | Lumbar Spine ✅ | Hip ✅ | Cervical Spine ✅ | Ankle ✅ | Elbow ✅ | Wrist ✅ | Hand ✅ | Thoracic Spine ✅

---

## Weak Points — Prioritized

### 1. Orphan Muscles (6) — No movement links
These were added but never wired into the movement-muscle graph:
- **Hypothenar muscles**: abductor-digiti-minimi, flexor-digiti-minimi-brevis, opponens-digiti-minimi — need 5th finger movement links
- **extensor-pollicis-brevis** — needs thumb MCP extension link
- **external-intercostals / internal-intercostals** — need respiration movement or thoracic links

Effort: ~10 min | Impact: Eliminates all data quality warnings

### 2. Low-Confidence Muscles (23 still < 0.95)
Hand intrinsics at 0.80 (dorsal/palmar interossei, lumbricals, opponens pollicis, APB, FPB, adductor pollicis). Wrist/forearm muscles at 0.85 (FCR, FCU, ECRL, FDS, FDP, ED, FPL, EPL, pronator teres, supinator, peroneus longus, tibialis posterior). Biceps/triceps/tibialis anterior at 0.90.

All were confirmed by OpenEvidence responses — confidence scores just need bumping.

Effort: ~10 min | Impact: Accuracy of confidence scores

### 3. Thin Movement-Muscle Links (11 movements with < 2 links)
- finger-extension: 1 link
- finger-abduction: 1 link
- finger-adduction: 1 link
- dip-flexion: 1 link
- thumb-abduction: 1 link
- thumb-adduction: 1 link
- thumb-mcp-extension: 1 link
- thumb-ip-flexion: 1 link
- thumb-ip-extension: 1 link
- cervical-flexion-upper: 1 link
- scapular-downward-rotation: 1 link

Hand OpenEvidence data has the mappings — just not yet applied.

Effort: ~15 min | Impact: Completes hand knowledge graph

### 4. Low-Confidence Exercises (28 still < 0.90)
Most exercises were AI-generated; only top 3 per region got updated with EMG/dosing. Weakest:
- seated-hip-internal-rotation: 0.75
- wrist-radial-ulnar-deviation: 0.75
- 9 exercises at 0.80
- 18 exercises at 0.85

Effort: ~20 min | Impact: Exercise data quality

### 5. Functional Tasks — Thin Coverage (only 11)
Missing common ADLs/IADLs:
- Carrying/lifting objects
- Dressing (buttons, zippers)
- Bathing/hygiene
- Driving
- Sit-to-floor-to-sit
- Running/jogging

Effort: ~15 min | Impact: ADL coverage for future products

### 6. Exercise-Muscle Role Audit
157 exercise-muscle links are still original AI-generated set. OpenEvidence provided EMG activation levels and force data, but actual role assignments (primary/secondary/stabilizer) on existing exercises haven't been audited against the new evidence.

Effort: ~30 min | Impact: Correctness of exercise graph

---

## Fix Order

| # | Issue | Effort | Impact |
|---|---|---|---|
| 1 | Wire 6 orphan muscles into movements | 10 min | Eliminates all data quality warnings |
| 2 | Bump confidence on 23 validated muscles | 10 min | Confidence score accuracy |
| 3 | Enrich thin hand/finger movement links | 15 min | Complete hand knowledge graph |
| 4 | Bump confidence on validated exercises + add EMG notes | 20 min | Exercise data quality |
| 5 | Add 5-8 more functional tasks | 15 min | ADL coverage |
| 6 | Audit exercise-muscle role assignments | 30 min | Exercise graph correctness |
