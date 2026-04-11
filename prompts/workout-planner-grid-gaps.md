# OpenEvidence Prompt — Workout Planner Grid: Sparse-Cell Expansion

## Context

Body IQ's workout planner grid (`/planner`) organizes exercises by region × movement. Scanning the grid surfaces cells that are legitimately relevant but only have ONE exercise. These sparse cells limit the planner's usefulness — users picking "Scapular Retraction" see a single option when clinically there should be 4–6 high-quality choices.

For each exercise you recommend, provide:

1. **Exercise name** and a 1–2 sentence description
2. **Primary / secondary / stabilizer muscles** (per clinical biomechanics literature)
3. **Target joint × movement** (match the sparse cell below)
4. **Equipment** (bodyweight, dumbbell, band, etc.)
5. **Evidence-based dosing** — sets, reps, frequency (cite the source)
6. **EMG activation data** (% MVIC) if available
7. **Key coaching cues** (2–4 concise cues)
8. **Evidence level** — strong / moderate / limited / expert-opinion
9. **Citations** — author, year, journal, DOI/PMID where possible

Focus on exercises that are **well-supported by peer-reviewed literature** (EMG studies, RCTs, systematic reviews). Please avoid generic "gym Instagram" content.

---

## Sparse cells to fill (1 exercise each; want 3–5 more per cell)

### Shoulder region — scapular control

1. **Scapular Elevation** — currently 1 exercise. Want evidence-based options that load the upper trapezius specifically without impingement risk. Consider: loaded shrugs (barbell, dumbbell, trap bar), farmer's carries, overhead carries, supported shoulder shrugs.
2. **Scapular Depression** — currently 1 exercise. Want options targeting lower trap / lat. Consider: scap pull-ups, dead hangs with active depression, straight-arm pulldowns, low rows with depression emphasis.
3. **Scapular Downward Rotation** — currently 1 exercise. Want options for pull-down / adduction patterns (rhomboids, lower trap, lat). Consider: band-resisted lat pulldowns, prone Y-raises with downward rotation, inverted rows with emphasis on scapular positioning.

### Shoulder region — horizontal plane

4. **Shoulder Horizontal Abduction** — currently 1 exercise. Want rear deltoid and posterior rotator cuff options. Consider: prone horizontal abduction (full can), T-raises, face pulls, band pull-aparts, reverse flys (multiple grips), rear-delt machine variants. Include EMG comparisons from Reinold or Reinhardt literature.
5. **Shoulder Horizontal Adduction** — currently 1 exercise. Want anterior deltoid / pec major options. Consider: cable crossovers (high-to-low, low-to-high, mid), dumbbell fly variations, pec deck, single-arm cable adduction, resistance band chest fly.

### Hand region — intrinsics

6. **Finger Abduction** — currently 1 exercise. Want dorsal interossei-focused options. Consider: rubber band finger spread (progressive resistance bands), putty finger abduction, isolated MCP abduction against manual resistance. Cite hand therapy literature.
7. **Finger Adduction** — currently 1 exercise. Want palmar interossei options. Consider: paper squeeze between fingers, putty adduction, key pinch variants that isolate finger adduction. Cite Ottawa Panel or Hand Therapy Journal sources if available.
8. **Thumb Extension** — currently 1 exercise. Want EPL/EPB isolation options. Consider: rubber band resisted thumb extension, putty reverse pinch, tabletop thumb extension against manual resistance.

### Wrist region — deviation

9. **Wrist Radial Deviation** (displayed as "Abduction") — currently 1 exercise. Want ECRL/FCR-emphasis options. Consider: hammer radial deviation, dumbbell radial deviation in neutral grip, band-resisted radial deviation.
10. **Wrist Ulnar Deviation** (displayed as "Adduction") — currently 1 exercise. Want ECU/FCU-emphasis options. Consider: hammer ulnar deviation, dumbbell ulnar deviation, wrist roller variations, FlexBar ulnar deviation.

### Knee region — rotation

11. **Knee Internal Rotation** — currently 1 exercise. Relevant for patellofemoral pain, ACL-R, tibial rotation training. Consider: seated knee IR against band (knee flexed 90°), open-chain IR with ankle weight, single-leg squat with deliberate IR bias.
12. **Knee External Rotation** — currently 1 exercise. Relevant for ACL-R, meniscal rehab. Consider: seated knee ER against band, open-chain ER drills, single-leg stance with rotational control cues.

### Lumbar region — rotation

13. **Lumbar Rotation** — currently 1 exercise. Want options that train controlled rotation without excessive shear. Consider: cable/band chops and lifts (Pallof press variants), half-kneeling rotations, seated medicine-ball rotations, dead-bug with rotation, bird-dog with rotation. Note: emphasize exercises validated for LBP populations (McGill literature, McKenzie method, motor control training).

---

## Deliverable format

Markdown, one section per sparse cell above, with exercises as H4 headings. Include a final summary table listing:

- Cell filled
- Number of new exercises proposed
- Average evidence level
- Key citations used

Skip any sparse cell where the current evidence base is genuinely thin — note "insufficient evidence" instead of fabricating exercises.
