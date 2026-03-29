# OpenEvidence Prompt — Exercise-Muscle Role Audit

We have a rehabilitation exercise database with AI-assigned muscle role classifications (primary, secondary, stabilizer, synergist). We need EMG evidence to verify or correct these assignments. For each exercise below, please provide:

- **Actual muscle activation levels** (% MVIC from EMG studies where available)
- **Correct role classification** based on activation data: primary (>40% MVIC or main mover), secondary (20-40% MVIC or significant contributor), stabilizer (active but supporting joint stability), synergist (assists primary mover)
- **Any muscles that are missing or incorrectly assigned**
- **Cite specific EMG studies** for each exercise

---

## Group 1: Lower Extremity

### Bridge
Current assignments: gluteus maximus (primary), hamstrings (secondary), erector spinae (stabilizer), transversus abdominis (stabilizer)
- What does EMG show for glute max vs hamstring activation? Some literature suggests hamstrings can dominate depending on foot position.
- Is there a gluteus medius stabilizer role that's missing?

### Clamshell
Current assignments: gluteus medius (primary), piriformis (secondary), gluteus maximus (synergist)
- What is the actual glute med vs TFL activation ratio? TFL is not listed — should it be?
- Does gluteus minimus contribute? At what level?
- Does piriformis truly activate as secondary, or is activation minimal in this position?

### Squat
Current assignments: quadriceps (primary), gluteus maximus (primary), hamstrings (secondary), adductor group (secondary), erector spinae (stabilizer), transversus abdominis (stabilizer), gastrocnemius (stabilizer), soleus (stabilizer)
- Is the hamstring role truly "secondary" or more stabilizer given co-contraction patterns?
- What about hip adductor activation — what % MVIC?
- Does depth change the primary/secondary assignments?

### Sit-to-Stand
Current assignments: quadriceps (primary), gluteus maximus (primary), hamstrings (secondary), erector spinae (stabilizer), transversus abdominis (stabilizer)
- What does EMG show for the sit-to-stand transition specifically (vs squat)?
- Is tibialis anterior missing as a stabilizer for ankle dorsiflexion during forward lean?

### Heel Raise (Calf Raise)
Current assignments: gastrocnemius (primary), soleus (primary), tibialis posterior (synergist)
- What is the gastroc vs soleus activation ratio during standing heel raises?
- Does peroneus longus contribute significantly? Should it be listed?
- Does knee position (bent vs straight) change primary assignments?

### Straight Leg Raise
Current assignments: iliopsoas (primary), rectus femoris (primary), quadriceps (stabilizer), transversus abdominis (stabilizer)
- Is listing both iliopsoas and rectus femoris as co-primary accurate?
- What does EMG show for TrA activation during SLR — is "stabilizer" correct or is it more active than that?
- Should tensor fasciae latae be listed?

### Hip Adduction (Sidelying)
Current assignment: adductor group (primary) — only one muscle listed
- Which specific adductors are most active (longus, brevis, magnus, gracilis)?
- Is there a stabilizer role for core muscles during sidelying position?
- What % MVIC does this exercise actually achieve for adductors?

### Seated Hip Internal Rotation
Current assignment: gluteus medius (primary) — only one muscle listed, confidence 0.75
- Is gluteus medius actually the primary hip IR? Literature suggests gluteus medius anterior fibers, TFL, and adductors contribute.
- What about gluteus minimus as a primary internal rotator?
- Should adductor group or TFL be listed?

---

## Group 2: Upper Extremity & Shoulder

### Overhead Press (Seated)
Current assignments: anterior deltoid (primary), middle deltoid (primary), supraspinatus (synergist), triceps brachii (secondary), upper trapezius (stabilizer), serratus anterior (stabilizer)
- Is supraspinatus role truly "synergist" or more "stabilizer" during pressing?
- What does EMG show for upper vs lower trap activation ratios?
- Should infraspinatus be listed as a stabilizer for GH joint centering?

### Resisted Internal Rotation
Current assignments: subscapularis (primary), pectoralis major (secondary), latissimus dorsi (secondary), anterior deltoid (synergist)
- Is anterior deltoid really a synergist for IR, or is its role negligible?
- What EMG activation does subscapularis show vs pec major during resisted IR?
- Should teres major be included?

### Wall Push-Up
Current assignments: pectoralis major (primary), anterior deltoid (secondary), triceps brachii (secondary), serratus anterior (stabilizer)
- At the wall push-up load level, does serratus anterior actually activate enough to be meaningful?
- Is the protraction component at end-range significant enough for serratus activation?
- Should core stabilizers (TrA, obliques) be listed?

### Bicep Curl
Current assignments: biceps brachii (primary), brachialis (primary), supinator (synergist)
- Is brachialis truly co-primary with biceps, or does it depend on grip position?
- What about brachioradialis — should it be listed? At what role?
- Is supinator actually active during a standard curl, or only during supinated grip?

### Tricep Extension (Overhead)
Current assignment: triceps brachii (primary) — only one muscle listed
- Is the long head preferentially recruited in the overhead position vs lateral/medial?
- Should anconeus be listed as a synergist?
- Any stabilizer roles for shoulder muscles (posterior deltoid, rotator cuff) during overhead position?

### Scapular Retraction Exercise
Current assignments: middle trapezius (primary), rhomboid major (primary)
- What does EMG show for rhomboid vs middle trap activation during retraction?
- Should lower trapezius be listed? At what role?
- Is levator scapulae active during retraction exercises?

### Resisted External Rotation
Current assignments: infraspinatus (primary), teres minor (primary), posterior deltoid (secondary)
- Does side-lying vs standing with band change the primary assignments?
- What is the actual infraspinatus vs teres minor activation ratio?
- Should supraspinatus be listed as a stabilizer?

---

## Group 3: Wrist, Hand & Forearm

### Forearm Pronation/Supination (Hammer)
Current assignments: pronator teres (primary), supinator (primary), biceps brachii (secondary)
- For pronation: is pronator teres truly primary, or does pronator quadratus contribute more?
- For supination: what is the biceps vs supinator activation balance?
- Should brachioradialis be listed for the neutral position?

### Wrist Deviation (Radial/Ulnar) — confidence 0.75
Current assignments: FCR (primary), ECRL (primary), FCU (primary)
- For radial deviation: FCR + ECRL as co-primaries — is this accurate?
- For ulnar deviation: FCU alone, or should ECU be listed as co-primary?
- What stabilizer roles exist during deviation movements?

### Grip Strengthening (Squeeze Ball)
Current assignments: FDS (primary), extensor digitorum (secondary), opponens pollicis (synergist)
- Is FDP missing as a primary? It's the deep finger flexor.
- What about FPL for thumb contribution?
- Is extensor digitorum truly "secondary" during grip, or is it a stabilizer for wrist extension during gripping?
- What about intrinsic hand muscle contribution (lumbricals, interossei)?

### Thumb Opposition Exercise — confidence 0.80
Current assignment: opponens pollicis (primary) — only one muscle listed
- What other thenar muscles contribute: FPB, APB?
- Should opponens digiti minimi be listed for the receiving digit?
- What does EMG show for intrinsic vs extrinsic muscle activation during opposition?

---

## Group 4: Spine & Core

### Bird Dog
Current assignments: erector spinae (primary), multifidus (primary), gluteus maximus (secondary), anterior deltoid (secondary), transversus abdominis (stabilizer)
- EMG studies show varying activation levels — what are the actual % MVIC values?
- Is multifidus truly co-primary with erector spinae, or more of a segmental stabilizer?
- Should contralateral obliques be listed for anti-rotation?

### Modified Curl-Up / Dead Bug
Current assignments: rectus abdominis (primary), external oblique (primary), TrA (stabilizer), internal oblique (synergist), iliopsoas (stabilizer)
- For dead bug specifically: is the hip flexor demand higher than "stabilizer"?
- What does EMG show for IO vs EO — is the role distinction (synergist vs primary) justified?
- Should multifidus be listed as a stabilizer?

### Pelvic Tilt/Realignment
Current assignments: rectus abdominis (primary), gluteus maximus (primary), erector spinae (primary), iliopsoas (secondary), TrA (stabilizer)
- Three muscles listed as co-primary seems too many — what does EMG show?
- For posterior pelvic tilt: is RA or glute max the dominant mover?
- For anterior pelvic tilt: is erector spinae primary or are hip flexors?

### Diaphragmatic Breathing
Current assignments: diaphragm (primary), TrA (synergist), internal oblique (synergist), erector spinae (stabilizer)
- What does EMG/ultrasound show for TrA activation during diaphragmatic breathing vs normal breathing?
- Should pelvic floor muscles be mentioned as synergists?
- Is external oblique involved during forced expiration phases?

Please cite specific studies with author, year, and journal for each exercise where EMG data is available.
