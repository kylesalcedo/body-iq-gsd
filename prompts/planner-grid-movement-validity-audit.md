# OpenEvidence Prompt — Movement Validity Audit Against the Planner Grid

## Context

The workout planner grid at `/planner` surfaces empty cells where a given (region × movement) combination has no exercises. Before authoring exercises to fill these gaps, we need to answer: **which gaps are real, and which are anatomically meaningless and should be excluded from the grid entirely?**

Some cells are empty because the underlying joint doesn't do that movement in any clinically meaningful sense (e.g., "Cervical Spine × Abduction" — the cervical spine doesn't abduct; it flexes, extends, rotates, and laterally flexes). Authoring fake exercises to fill those cells would corrupt the knowledge base.

## Task

For each (region, movement) combination in the table below, classify it as one of:

- **VALID** — the joint performs this movement clinically; empty cell is a real content gap worth filling
- **INVALID** — the joint does not perform this movement in a meaningful way; exclude this cell from the grid entirely
- **DERIVATIVE** — the movement is a variant or alias of another movement already in the grid (e.g., "Knee Rotation" is just knee IR + ER combined); exclude or merge

For each classification, cite the standard anatomical reference (Kapandji, Neumann, Levangie & Norkin, or equivalent) and provide a 1–2 sentence rationale.

## Cells to classify

### Cervical Spine
- Abduction
- Adduction
- Internal Rotation
- External Rotation

### Thoracic Spine
- Abduction
- Adduction
- Internal Rotation
- External Rotation

### Lumbar Spine
- Abduction
- Adduction
- Internal Rotation
- External Rotation

### Shoulder
- Lateral Flexion
- Rotation (generic, not IR/ER)

### Elbow
- Lateral Flexion
- Rotation
- Abduction
- Adduction
- Internal Rotation
- External Rotation

### Wrist
- Lateral Flexion
- Rotation
- Internal Rotation
- External Rotation
- (Note: the grid currently aliases Radial Deviation → Abduction and Ulnar Deviation → Adduction. Is this clinically acceptable?)

### Hand
- Flexion (whole hand, distinct from Finger Flexion)
- Extension (whole hand)
- Lateral Flexion
- Rotation
- Abduction
- Adduction
- Internal Rotation
- External Rotation

### Hip
- Lateral Flexion (some sources describe "hip hiking" as a lateral-plane hip motion — is this valid?)
- Rotation (generic, not IR/ER)

### Knee
- Lateral Flexion
- Rotation
- Abduction (valgus/varus — is this a trainable movement or just a stress direction?)
- Adduction

### Ankle
- Lateral Flexion
- Rotation
- Abduction
- Adduction
- Internal Rotation
- External Rotation
- (Note: the grid aliases Dorsiflexion → Flexion and Plantarflexion → Extension. Is this clinically acceptable?)

---

## Bonus questions

1. Our grid currently aliases the following as synonyms. Are these anatomically defensible for a workout planner context?
   - Dorsiflexion ≡ Ankle Flexion
   - Plantarflexion ≡ Ankle Extension
   - Radial Deviation ≡ Wrist Abduction
   - Ulnar Deviation ≡ Wrist Adduction
   - If any should be reverted (kept as unique columns), explain why.

2. Are there any movements we're **missing entirely** that a workout planner should expose?
   - e.g., thoracic outlet mobility, cervical retraction (separate from extension), rib cage rotation, pelvic tilt, hip hiking, scapular posterior tilt, glenohumeral joint distraction, etc.
   - For each, indicate which region/joint owns it and whether it warrants its own column.

3. How do hand composite movements (finger flexion as a whole, "making a fist") fit alongside the thumb movements? Should they share columns or stay separate?

---

## Deliverable format

Markdown table with columns:

| Region | Movement | Classification | Rationale | Reference |

Plus narrative answers for the bonus questions. Aim for brevity — 1–2 sentences per rationale is plenty.
