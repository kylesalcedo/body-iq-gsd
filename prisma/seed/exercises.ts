import { prisma, logSection, logCount } from "./client";
import { MuscleRole } from "@prisma/client";

interface ExerciseDef {
  slug: string;
  name: string;
  description: string;
  confidence: number;
  notes?: string;
  dosing?: string;
  emgNotes?: string;
  evidenceLevel?: string;
  difficulty?: string;
  equipment?: string[];
  bodyPosition?: string;
  movementSlugs: string[];
  muscleRoles: { muscleSlug: string; role: MuscleRole; notes?: string }[];
  functionalTaskSlugs?: string[];
  cues: { text: string; cueType: string }[];
  regressions: { name: string; description: string }[];
  progressions: { name: string; description: string }[];
}

const exercises: ExerciseDef[] = [
  {
    slug: "bridge",
    name: "Bridge",
    description: "Supine hip extension exercise. Patient lies on back with knees bent, feet flat on floor, and lifts hips toward ceiling by squeezing glutes.",
    confidence: 0.9,
    dosing: "3×10-15 reps, 2-3x/week",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "moderate",
    emgNotes: "Glute max 20-40% MVIC; hamstrings 15-25% MVIC; single-leg variation significantly increases activation [Ekstrom 2007, Hirose 2018]",
    movementSlugs: ["hip-extension"],
    muscleRoles: [
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "secondary", notes: "15-25% MVIC — co-contraction pattern" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
      { muscleSlug: "gluteus-medius", role: "stabilizer", notes: "Pelvic stabilizer during hip extension" },
    ],
    functionalTaskSlugs: ["pushing-up-from-chair", "squat-to-stand", "walking"],
    cues: [
      { text: "Squeeze your glutes to lift your hips, don't push through your back", cueType: "verbal" },
      { text: "Keep your knees hip-width apart throughout the movement", cueType: "verbal" },
      { text: "Hold briefly at the top, then lower slowly", cueType: "verbal" },
    ],
    regressions: [
      { name: "Partial Bridge", description: "Lift hips only partway, reducing range of motion. Focus on glute activation rather than height." },
      { name: "Supported Bridge", description: "Place a pillow or yoga block under sacrum for supported hold. Focus on engaging glutes isometrically." },
    ],
    progressions: [
      { name: "Single-Leg Bridge", description: "Extend one leg while bridging on the other. Increases demand on the working glute and challenges pelvic stability." },
      { name: "Marching Bridge", description: "Hold bridge position and alternately lift knees toward chest. Challenges pelvic stability and hip flexor control." },
    ],
  },
  {
    slug: "clamshell",
    name: "Clamshell",
    description: "Sidelying hip external rotation exercise. Patient lies on side with hips and knees bent, feet together, and opens top knee like a clamshell.",
    confidence: 0.90,
    dosing: "3×15-20 reps per side, 2-3x/week",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "sidelying",
    evidenceLevel: "strong",
    emgNotes: "Glute med 26-67% MVIC; highest glute med-to-TFL ratio (115) among exercises [Selkowitz 2013]; 60° hip flexion optimal [Willcox 2013]",
    movementSlugs: ["hip-external-rotation", "hip-abduction"],
    muscleRoles: [
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Posterior fibers" },
      { muscleSlug: "piriformis", role: "synergist", notes: "14.5% T2 change (fMRI) [Kim 2025]" },
      { muscleSlug: "gluteus-maximus", role: "synergist" },
      { muscleSlug: "tensor-fasciae-latae", role: "secondary", notes: "20-34% MVIC — monitor for over-activation [Selkowitz 2013]" },
      { muscleSlug: "gluteus-minimus", role: "synergist", notes: "4.5-7.2% T2 change [Kim 2025]" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Keep your feet together as you open your knee", cueType: "verbal" },
      { text: "Don't let your pelvis roll backward — keep your hips stacked", cueType: "verbal" },
      { text: "Move slowly and control the return", cueType: "verbal" },
    ],
    regressions: [
      { name: "Reduced Range Clamshell", description: "Open the knee only partway. Focus on maintaining pelvic stability." },
    ],
    progressions: [
      { name: "Resisted Clamshell", description: "Add a resistance band around the thighs just above the knees." },
      { name: "Elevated Clamshell", description: "Lift feet off the surface while performing the clamshell. Increases gluteus medius demand." },
    ],
  },
  {
    slug: "squat",
    name: "Squat",
    description: "Compound lower extremity exercise. Standing hip and knee flexion-extension against gravity. Fundamental movement pattern for functional strength.",
    confidence: 0.95,
    notes: "EMG: quadriceps 67-79% MVIC [Andersen 2006]. VL and VM highest activity among evaluated muscles [Muyor 2020]. Monopodal squat significantly higher EMG than lunge/step-up (d>0.6) [Muyor 2020]. Squat with hip adduction increases VMO/VL ratio [Thongduang 2022]. Biomechanics: 0-50° flexion minimal joint forces (early rehab); parallel squat (0-100°) for healthy knees; forward trunk tilt reduces ACL loading [Escamilla 2001, 2012]. Dosing: moderate intensity, 3x/week, 20-60 min [Whitfield 2024].",
    dosing: "3×8-12 reps, 2-3x/week; moderate intensity",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "strong",
    emgNotes: "Quad 40-70% MVIC; glute max increases with depth: partial 16.9%, parallel 28.0%, full 35.4% [Caterisano 2002]",
    movementSlugs: ["hip-flexion", "hip-extension", "knee-flexion", "knee-extension", "ankle-dorsiflexion"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary" },
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "stabilizer", notes: "15-25% MVIC — co-contraction pattern for knee stability [Barrett 2023]" },
      { muscleSlug: "adductor-group", role: "secondary" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
      { muscleSlug: "gastrocnemius", role: "stabilizer" },
      { muscleSlug: "soleus", role: "stabilizer" },
      { muscleSlug: "gluteus-medius", role: "stabilizer", notes: "30-45% MVIC pelvic stability [Muyor 2020]" },
    ],
    functionalTaskSlugs: ["squat-to-stand", "stair-climbing", "pushing-up-from-chair"],
    cues: [
      { text: "Maintain a slight forward trunk tilt to reduce ACL stress", cueType: "verbal" },
      { text: "Keep your chest up and weight through your heels", cueType: "verbal" },
      { text: "Push your knees out over your toes — don't let them cave inward", cueType: "verbal" },
      { text: "For early rehab, restrict to 0-50° knee flexion; healthy knees can go to parallel", cueType: "verbal" },
      { text: "Squeeze a ball between your knees to preferentially activate VMO", cueType: "verbal" },
    ],
    regressions: [
      { name: "Wall Squat (Partial Range)", description: "Squat against a wall to 0-50° knee flexion. Minimal joint forces, appropriate for early rehabilitation." },
      { name: "Chair Squat", description: "Squat down to a chair and use it as a depth target. Reduces fear of falling and limits range." },
    ],
    progressions: [
      { name: "Bodyweight Parallel Squat", description: "Full squat to thighs parallel. 0-100° knee flexion." },
      { name: "Single-Leg Squat", description: "Significantly higher EMG activity than bilateral squat in all muscles (d > 0.6). Advanced balance and strength challenge." },
      { name: "Jump Squat", description: "Add an explosive jump at the top. Peak Fz/BW significantly higher. For advanced patients with no joint restrictions." },
    ],
  },
  {
    slug: "sit-to-stand",
    name: "Sit-to-Stand",
    description: "Functional transfer exercise. Patient rises from a seated position without using arms, emphasizing lower extremity strength and weight shift.",
    confidence: 0.9,
    dosing: "3×10 reps, daily; progress to 5×STS timed test",
    difficulty: "beginner",
    equipment: ["chair"],
    bodyPosition: "seated",
    evidenceLevel: "strong",
    movementSlugs: ["hip-extension", "knee-extension"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary" },
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "secondary" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
      { muscleSlug: "tibialis-anterior", role: "stabilizer", notes: "Preparatory postural muscle — active during forward lean phase [Goulart 1999]" },
    ],
    functionalTaskSlugs: ["pushing-up-from-chair", "squat-to-stand"],
    cues: [
      { text: "Lean forward — nose over toes — before you stand", cueType: "verbal" },
      { text: "Push through your heels to stand up", cueType: "verbal" },
      { text: "Try not to use your hands", cueType: "verbal" },
    ],
    regressions: [
      { name: "Elevated Sit-to-Stand", description: "Use a higher chair or add cushions to reduce the range of motion required." },
      { name: "Armrest-Assisted", description: "Allow use of armrests for push-off while building strength." },
    ],
    progressions: [
      { name: "Slow Eccentric Sit-to-Stand", description: "Take 5 seconds to lower back to the chair. Builds eccentric quad and glute control." },
      { name: "Single-Leg Emphasis", description: "Place more weight on one leg during the transfer. Progress toward single-leg sit-to-stand." },
    ],
  },
  {
    slug: "heel-raise",
    name: "Heel Raise (Calf Raise)",
    description: "Standing plantarflexion exercise. Patient rises onto balls of feet, lifting heels off the ground.",
    confidence: 0.9,
    dosing: "3×15-20 reps bilateral, progress to 3×10-15 single-leg",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Gastroc and soleus co-primary ~23% MVIC each; knee bent shifts to soleus dominant [Hébert-Losier 2012]",
    movementSlugs: ["ankle-plantarflexion"],
    muscleRoles: [
      { muscleSlug: "gastrocnemius", role: "primary" },
      { muscleSlug: "soleus", role: "primary" },
      { muscleSlug: "tibialis-posterior", role: "synergist" },
      { muscleSlug: "peroneus-longus", role: "synergist", notes: "Dynamic lateral ankle stabilizer during heel raise" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Rise straight up — avoid leaning forward", cueType: "verbal" },
      { text: "Go as high as you can, then lower slowly", cueType: "verbal" },
      { text: "Keep your ankles straight — don't roll outward", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Heel Raise", description: "Perform seated to reduce body weight load. Targets soleus more than gastrocnemius." },
      { name: "Wall-Supported Heel Raise", description: "Use a wall or counter for balance support." },
    ],
    progressions: [
      { name: "Single-Leg Heel Raise", description: "Perform on one leg to double the load. Progress when bilateral is easy for 15+ reps." },
      { name: "Eccentric Heel Lower", description: "Rise on two feet, lower on one foot slowly off a step edge. Excellent for Achilles tendinopathy rehab." },
    ],
  },
  {
    slug: "calf-stretch",
    name: "Calf Stretch (Wall Stretch)",
    description: "Standing stretch for the gastrocnemius and soleus. Patient places hands on wall with one foot forward and one back, leaning into the wall.",
    confidence: 0.90,
    dosing: "3×30 seconds per side, 2x daily",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Meta-analysis: increases dorsiflexion 2-3° across all durations [Radford 2006]",
    movementSlugs: ["ankle-dorsiflexion"],
    muscleRoles: [
      { muscleSlug: "gastrocnemius", role: "primary", notes: "Stretched with knee straight" },
      { muscleSlug: "soleus", role: "primary", notes: "Stretched with knee bent" },
    ],
    functionalTaskSlugs: ["walking"],
    cues: [
      { text: "Keep your back heel on the ground", cueType: "verbal" },
      { text: "For gastrocnemius: keep back knee straight. For soleus: bend back knee slightly", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Calf Stretch with Towel", description: "Sit with legs extended, loop a towel around the ball of the foot, and pull gently." },
    ],
    progressions: [
      { name: "Step Stretch", description: "Stand on the edge of a step and let the heel drop below the step level for a deeper stretch." },
    ],
  },
  {
    slug: "wrist-flexor-stretch",
    name: "Wrist Flexor Stretch",
    description: "Stretch for the forearm flexor group. Extend the elbow and use the other hand to gently extend the wrist and fingers.",
    confidence: 0.85,
    dosing: "3×30 seconds per side, before and after activity",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    movementSlugs: ["wrist-extension"],
    muscleRoles: [
      { muscleSlug: "flexor-carpi-radialis", role: "primary", notes: "Being stretched" },
      { muscleSlug: "flexor-carpi-ulnaris", role: "primary", notes: "Being stretched" },
      { muscleSlug: "flexor-digitorum-superficialis", role: "secondary", notes: "Being stretched" },
    ],
    functionalTaskSlugs: ["typing", "gripping-cup"],
    cues: [
      { text: "Keep your elbow straight and palm facing up", cueType: "verbal" },
      { text: "Use your other hand to gently pull the fingers back", cueType: "verbal" },
    ],
    regressions: [
      { name: "Table Stretch", description: "Place palms flat on a table with fingers pointing toward you. Gently lean back." },
    ],
    progressions: [
      { name: "Prayer Stretch with Fingers", description: "Press palms together in prayer position and lower hands while keeping palms together to increase stretch." },
    ],
  },
  {
    slug: "wrist-extensor-stretch",
    name: "Wrist Extensor Stretch",
    description: "Stretch for the forearm extensor group. Extend the elbow and use the other hand to gently flex the wrist.",
    confidence: 0.85,
    dosing: "3×30-45 seconds per side, before and after eccentric exercises",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    movementSlugs: ["wrist-flexion"],
    muscleRoles: [
      { muscleSlug: "extensor-carpi-radialis-longus", role: "primary", notes: "Being stretched" },
      { muscleSlug: "extensor-digitorum", role: "primary", notes: "Being stretched" },
    ],
    functionalTaskSlugs: ["typing", "gripping-cup"],
    cues: [
      { text: "Keep your elbow straight and palm facing down", cueType: "verbal" },
      { text: "Use your other hand to gently press the back of your hand down", cueType: "verbal" },
    ],
    regressions: [
      { name: "Gravity-Assisted Stretch", description: "Let the wrist hang over the edge of a table with palm down, allowing gravity to provide the stretch." },
    ],
    progressions: [
      { name: "Resisted Wrist Extension Eccentric", description: "Slowly lower a light weight from wrist extension to flexion. Combines stretch with eccentric strengthening." },
    ],
  },
  {
    slug: "scapular-retraction-exercise",
    name: "Scapular Retraction Exercise",
    description: "Squeeze shoulder blades together in a seated or standing position. Foundational exercise for scapular stability and posture.",
    confidence: 0.90,
    dosing: "3×10-15 reps with 5-second holds",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["scapular-retraction"],
    muscleRoles: [
      { muscleSlug: "trapezius-middle", role: "primary" },
      { muscleSlug: "rhomboid-major", role: "primary" },
    ],
    functionalTaskSlugs: ["reaching-overhead", "typing"],
    cues: [
      { text: "Pull your shoulder blades together as if pinching a pencil between them", cueType: "verbal" },
      { text: "Keep your shoulders down — don't shrug", cueType: "verbal" },
      { text: "Hold for 5 seconds, then release slowly", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Scapular Retraction", description: "Perform lying on back to eliminate gravity. Press shoulder blades into the mat." },
    ],
    progressions: [
      { name: "Resisted Retraction (Band)", description: "Use a resistance band anchored at chest height. Pull elbows back to retract scapulae against resistance." },
      { name: "Prone Y Raise", description: "Lying face down, lift arms in a Y position overhead. Combines retraction with upward rotation." },
    ],
  },
  {
    slug: "resisted-external-rotation",
    name: "Resisted External Rotation",
    description: "Side-lying or standing with band/cable. Rotate forearm outward against resistance while keeping elbow at side. Key rotator cuff exercise.",
    confidence: 0.9,
    dosing: "3×8 at 8-RM, 3 days/week; 2-second eccentric",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "sidelying",
    evidenceLevel: "strong",
    emgNotes: "Infraspinatus 62% MVIC, teres minor 67% MVIC [Reinold 2004]",
    movementSlugs: ["shoulder-external-rotation"],
    muscleRoles: [
      { muscleSlug: "infraspinatus", role: "primary" },
      { muscleSlug: "teres-minor", role: "primary" },
      { muscleSlug: "posterior-deltoid", role: "secondary" },
    ],
    functionalTaskSlugs: ["reaching-overhead"],
    cues: [
      { text: "Keep your elbow pinned to your side — a towel roll helps", cueType: "verbal" },
      { text: "Rotate outward slowly, then return even slower", cueType: "verbal" },
      { text: "Don't let your shoulder hike up", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active-Assisted External Rotation", description: "Use a cane or dowel to assist the motion with the other hand. Reduces load on the rotator cuff." },
    ],
    progressions: [
      { name: "90/90 External Rotation", description: "Shoulder abducted to 90°, elbow at 90°. Rotate forearm up against resistance. Higher demand position." },
      { name: "Prone External Rotation", description: "Lie face down on edge of table with arm hanging. Rotate forearm up against gravity." },
    ],
  },
  {
    slug: "straight-leg-raise",
    name: "Straight Leg Raise",
    description: "Supine hip flexion with knee extended. Patient lifts leg while keeping the knee straight. Common early quad and hip flexor exercise.",
    confidence: 0.95,
    notes: "EMG: highest rectus femoris activity among CKC/OKC exercises [Thongduang 2022]. OKC generates higher ACL forces than CKC [Escamilla 2012]. Dosing: moderate intensity, 3x/week [Whitfield 2024]. ACL-safe since no knee flexion/extension moment.",
    dosing: "3×10-15 reps per leg; progress with ankle weights",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "strong",
    emgNotes: "Psoas >60% MVIC at end-range; rectus femoris 40-50% MVIC [Okubo 2021]",
    movementSlugs: ["hip-flexion", "knee-extension"],
    muscleRoles: [
      { muscleSlug: "iliopsoas", role: "primary" },
      { muscleSlug: "rectus-femoris", role: "primary" },
      { muscleSlug: "quadriceps", role: "stabilizer", notes: "Keeps knee extended" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Significantly active in mid-to-late concentric phase [Okubo 2021]" },
      { muscleSlug: "tensor-fasciae-latae", role: "synergist", notes: "Active contributor during hip flexion [Hu 2011]" },
    ],
    functionalTaskSlugs: ["walking"],
    cues: [
      { text: "Tighten your thigh muscle to lock out your knee before lifting", cueType: "verbal" },
      { text: "Lift to about 45 degrees, hold briefly, then lower slowly", cueType: "verbal" },
      { text: "Keep your back flat against the surface — don't arch", cueType: "verbal" },
    ],
    regressions: [
      { name: "Short-Arc Quad", description: "Place a roll under the knee and extend only the lower leg. Reduces hip flexor demand." },
    ],
    progressions: [
      { name: "Ankle Weight SLR", description: "Add an ankle weight (1-5 lbs) to increase resistance." },
      { name: "SLR with External Rotation", description: "Rotate the leg outward before lifting to bias different hip flexor contributions." },
    ],
  },
  {
    slug: "terminal-knee-extension",
    name: "Terminal Knee Extension (TKE)",
    description: "Standing with resistance band behind knee. Extend the last 30° of knee extension against band resistance. Targets VMO and full knee extension.",
    confidence: 0.95,
    notes: "EMG: VM and VL significantly more active during last 15° of extension [Gryzlo 1994]. Short-arc extension specifically targets vasti. OKC knee extension: highest neuromuscular activation (67-79% MVIC) [Andersen 2006]. For ACL protection: perform in 50-100° range or use short-arc only [Escamilla 2012].",
    dosing: "3×15-20 reps; focus on last 15° of extension",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "standing",
    evidenceLevel: "strong",
    emgNotes: "VM and VL significantly more active during last 15° extension [Gryzlo 1994]",
    movementSlugs: ["knee-extension"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary", notes: "Especially vastus medialis oblique (VMO)" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Straighten your knee fully against the band — really lock it out", cueType: "verbal" },
      { text: "Slowly let the knee bend to about 30° then extend again", cueType: "verbal" },
      { text: "Keep your kneecap tracking straight ahead", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Knee Extension", description: "Seated long-arc quad exercise. Extend the knee from 90° to full extension with or without ankle weight." },
    ],
    progressions: [
      { name: "Single-Leg Mini Squat", description: "Progress to a single-leg mini squat to challenge knee extension in a functional weight-bearing pattern." },
    ],
  },
  // ── Additional Exercises (covering remaining movement gaps) ─────────────
  {
    slug: "overhead-press",
    name: "Overhead Press (Seated)",
    description: "Seated shoulder press with dumbbells or resistance band. Combines shoulder flexion and abduction to lift weight overhead. Foundational upper extremity strengthening exercise.",
    confidence: 0.90,
    dosing: "3×8-12 reps; seated for stability",
    difficulty: "intermediate",
    equipment: ["dumbbells"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    emgNotes: "Anterior deltoid 60-90% MVIC; middle deltoid 50-80% MVIC; standing increases activation 8-15% [Saeterbakken 2013]",
    movementSlugs: ["shoulder-flexion", "shoulder-abduction", "elbow-extension"],
    muscleRoles: [
      { muscleSlug: "anterior-deltoid", role: "primary" },
      { muscleSlug: "middle-deltoid", role: "primary" },
      { muscleSlug: "supraspinatus", role: "stabilizer", notes: "GH joint centering during pressing [Cools 2020]" },
      { muscleSlug: "triceps-brachii", role: "secondary" },
      { muscleSlug: "trapezius-upper", role: "stabilizer", notes: "Scapular upward rotation" },
      { muscleSlug: "serratus-anterior", role: "stabilizer", notes: "Scapular stability" },
      { muscleSlug: "infraspinatus", role: "stabilizer", notes: "GH joint stabilizer during overhead press" },
      { muscleSlug: "pectoralis-major", role: "secondary", notes: "30-50% MVIC, higher in front press [Coratella 2022]" },
    ],
    functionalTaskSlugs: ["reaching-overhead"],
    cues: [
      { text: "Press straight up — don't let the weights drift forward", cueType: "verbal" },
      { text: "Keep your core braced and back against the chair", cueType: "verbal" },
      { text: "Lower the weights to shoulder height with control", cueType: "verbal" },
    ],
    regressions: [
      { name: "Wall Slide", description: "Stand with back against wall, slide arms up in a Y pattern. No external load — focuses on scapular mechanics." },
      { name: "Band Press", description: "Use a light resistance band instead of weights for reduced load." },
    ],
    progressions: [
      { name: "Standing Overhead Press", description: "Perform standing to increase core stability demand." },
      { name: "Single-Arm Press", description: "Press one arm at a time to increase unilateral demand and anti-rotation challenge." },
    ],
  },
  {
    slug: "shoulder-internal-rotation-exercise",
    name: "Resisted Internal Rotation",
    description: "Side-lying or standing with band/cable. Rotate forearm inward against resistance while keeping elbow at side. Targets subscapularis and internal rotators.",
    confidence: 0.85,
    dosing: "3×10-15 reps; progress through phases over 12-16 weeks",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Subscapularis 44-81.7% MVIC depending on position; belly press most specific [Ginn 2017]",
    movementSlugs: ["shoulder-internal-rotation"],
    muscleRoles: [
      { muscleSlug: "subscapularis", role: "primary" },
      { muscleSlug: "pectoralis-major", role: "secondary", notes: "Sternal head assists" },
      { muscleSlug: "latissimus-dorsi", role: "secondary" },
      { muscleSlug: "anterior-deltoid", role: "stabilizer", notes: "Minimal IR contribution" },
      { muscleSlug: "teres-major", role: "secondary", notes: "Active contributor to internal rotation" },
    ],
    cues: [
      { text: "Keep your elbow pinned to your side throughout", cueType: "verbal" },
      { text: "Rotate inward slowly, then return even slower", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active-Assisted IR", description: "Use a cane or dowel to assist the movement with the other hand." },
    ],
    progressions: [
      { name: "90/90 Internal Rotation", description: "Shoulder abducted to 90°, elbow at 90°. Rotate forearm down against resistance." },
    ],
  },
  {
    slug: "wall-push-up",
    name: "Wall Push-Up",
    description: "Standing push-up against a wall. Combines shoulder flexion/adduction with elbow extension and scapular protraction. Low-load entry point for pushing exercises.",
    confidence: 0.9,
    dosing: "3×10-15 reps; add 'plus' at top for serratus activation",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Serratus anterior 27.55% RVC in wall variation; 77.09% in standard push-up plus [Park 2014]",
    movementSlugs: ["shoulder-adduction", "shoulder-flexion", "elbow-extension", "scapular-protraction"],
    muscleRoles: [
      { muscleSlug: "pectoralis-major", role: "primary" },
      { muscleSlug: "anterior-deltoid", role: "secondary" },
      { muscleSlug: "triceps-brachii", role: "secondary" },
      { muscleSlug: "serratus-anterior", role: "stabilizer", notes: "27.55% RVC with plus component — essential at end-range protraction [Park 2014]" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core stabilizer — minimal activation (10-20% MVIC) in wall variation [Marcolin 2015]" },
    ],
    cues: [
      { text: "Keep your body in a straight line — don't sag at the hips", cueType: "verbal" },
      { text: "Lower your chest toward the wall, then push back", cueType: "verbal" },
      { text: "Push through at the end to round your upper back slightly (plus)", cueType: "verbal" },
    ],
    regressions: [
      { name: "Wall Lean", description: "Just lean into the wall with arms extended. Isometric hold without the push-up motion." },
    ],
    progressions: [
      { name: "Incline Push-Up", description: "Use a counter or bench instead of a wall. Increases the percentage of body weight." },
      { name: "Floor Push-Up", description: "Standard push-up on the floor." },
    ],
  },
  {
    slug: "bicep-curl",
    name: "Bicep Curl",
    description: "Standing or seated elbow flexion with dumbbell or resistance band. The forearm moves from extension to full flexion. Fundamental upper extremity strengthening.",
    confidence: 0.9,
    dosing: "3×10-12 reps; supinated grip for biceps emphasis",
    difficulty: "beginner",
    equipment: ["dumbbells"],
    bodyPosition: "standing",
    evidenceLevel: "limited",
    movementSlugs: ["elbow-flexion", "forearm-supination"],
    muscleRoles: [
      { muscleSlug: "biceps-brachii", role: "primary" },
      { muscleSlug: "brachialis", role: "primary" },
      { muscleSlug: "supinator", role: "synergist", notes: "Maintains supination — not an elbow flexor" },
      { muscleSlug: "brachioradialis", role: "secondary", notes: "Significant contributor — becomes co-primary with neutral grip [Marcolin 2018]" },
    ],
    functionalTaskSlugs: ["gripping-cup"],
    cues: [
      { text: "Keep your elbows at your sides — don't swing", cueType: "verbal" },
      { text: "Turn your palm up as you curl (supinate)", cueType: "verbal" },
      { text: "Lower slowly — the eccentric phase matters", cueType: "verbal" },
    ],
    regressions: [
      { name: "Gravity-Eliminated Curl", description: "Side-lying with arm supported, curl with no gravity resistance." },
    ],
    progressions: [
      { name: "Hammer Curl", description: "Perform with neutral grip (thumbs up). Increases brachioradialis involvement." },
      { name: "Eccentric-Focused Curl", description: "Take 5 seconds to lower the weight. Use the other hand to assist the concentric phase if needed." },
    ],
  },
  {
    slug: "tricep-extension",
    name: "Tricep Extension (Overhead)",
    description: "Overhead elbow extension with dumbbell or band. Fully lengthens the long head of the triceps across both joints. Complements pushing exercises.",
    confidence: 0.90,
    dosing: "5×10 at 70% 1RM, 2x/week; overhead for long head emphasis",
    difficulty: "intermediate",
    equipment: ["dumbbells"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    emgNotes: "Overhead produces 1.5x greater long head hypertrophy (+28.5% vs +19.6%) over 12 weeks [Maeo 2023]",
    movementSlugs: ["elbow-extension", "shoulder-extension"],
    muscleRoles: [
      { muscleSlug: "triceps-brachii", role: "primary", notes: "Long head preferentially recruited in overhead position — 28.5% greater hypertrophy vs neutral [Maeo 2023]" },
      { muscleSlug: "anconeus", role: "synergist", notes: "Assists elbow extension" },
    ],
    functionalTaskSlugs: ["pushing-up-from-chair"],
    cues: [
      { text: "Keep your upper arm vertical — only the forearm should move", cueType: "verbal" },
      { text: "Extend fully, then lower with control", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Kickback", description: "Lean forward with elbow at side, extend forearm backward. Reduced shoulder demand." },
    ],
    progressions: [
      { name: "Two-Arm Extension", description: "Use a heavier weight with both hands behind the head." },
    ],
  },
  {
    slug: "forearm-pronation-supination",
    name: "Forearm Pronation/Supination with Hammer",
    description: "Seated with elbow on thigh, rotate forearm using a weighted hammer or dowel. The offset weight creates torque for resisted pronation and supination.",
    confidence: 0.85,
    dosing: "3×10-15 reps each direction",
    difficulty: "beginner",
    equipment: ["hammer"],
    bodyPosition: "seated",
    evidenceLevel: "limited",
    movementSlugs: ["forearm-pronation", "forearm-supination"],
    muscleRoles: [
      { muscleSlug: "pronator-teres", role: "primary", notes: "During pronation" },
      { muscleSlug: "supinator", role: "primary", notes: "During supination" },
      { muscleSlug: "biceps-brachii", role: "secondary", notes: "Assists supination" },
    ],
    functionalTaskSlugs: ["opening-jar"],
    cues: [
      { text: "Keep your elbow still — only rotate the forearm", cueType: "verbal" },
      { text: "Move through full range slowly in both directions", cueType: "verbal" },
    ],
    regressions: [
      { name: "Unweighted Rotation", description: "Rotate the forearm without resistance, just focusing on full range." },
    ],
    progressions: [
      { name: "Longer Lever", description: "Hold the hammer further from the head to increase torque." },
    ],
  },
  {
    slug: "wrist-radial-ulnar-deviation",
    name: "Wrist Deviation Exercise (Radial/Ulnar)",
    description: "Seated with forearm on thigh, wrist hanging off edge. Move wrist side to side with light weight. Targets wrist deviators used in gripping and tool use.",
    confidence: 0.80,
    dosing: "3×10-15 reps each direction with light weight",
    difficulty: "beginner",
    equipment: ["dumbbell"],
    bodyPosition: "seated",
    evidenceLevel: "limited",
    movementSlugs: ["radial-deviation", "ulnar-deviation"],
    muscleRoles: [
      { muscleSlug: "flexor-carpi-radialis", role: "primary", notes: "Radial deviation" },
      { muscleSlug: "extensor-carpi-radialis-longus", role: "primary", notes: "Radial deviation" },
      { muscleSlug: "flexor-carpi-ulnaris", role: "primary", notes: "Ulnar deviation" },
      { muscleSlug: "extensor-carpi-ulnaris", role: "primary", notes: "Co-primary for ulnar deviation with FCU" },
    ],
    functionalTaskSlugs: ["opening-jar", "typing"],
    cues: [
      { text: "Move the wrist side to side — thumb side then pinky side", cueType: "verbal" },
      { text: "Keep the forearm still on your thigh", cueType: "verbal" },
    ],
    regressions: [
      { name: "No Weight", description: "Perform without weight, focusing on range of motion." },
    ],
    progressions: [
      { name: "Hammer Deviation", description: "Hold a hammer by the end — the offset weight increases resistance through deviation range." },
    ],
  },
  {
    slug: "grip-strengthening",
    name: "Grip Strengthening (Squeeze Ball)",
    description: "Squeeze a therapy ball or putty, then release. Trains finger flexion and grip strength used in all hand activities of daily living.",
    confidence: 0.85,
    dosing: "3×10 reps with 3-5 second holds, 3x/week",
    difficulty: "beginner",
    equipment: ["therapy-ball"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    emgNotes: "Hand exercises reduce short-term pain (VAS -5.0) and improve grip strength (21 lbs) in hand OA [Thakker 2025]",
    movementSlugs: ["finger-flexion", "finger-extension"],
    muscleRoles: [
      { muscleSlug: "flexor-digitorum-superficialis", role: "primary" },
      { muscleSlug: "flexor-digitorum-profundus", role: "primary", notes: "Deep finger flexor — high activation during grip" },
      { muscleSlug: "extensor-digitorum", role: "stabilizer", notes: "Maintains wrist extension during grip — stabilizer not secondary mover" },
      { muscleSlug: "opponens-pollicis", role: "synergist", notes: "Thumb positioning" },
      { muscleSlug: "lumbricals", role: "synergist", notes: "MCP flexion and finger positioning during grip" },
    ],
    functionalTaskSlugs: ["gripping-cup", "opening-jar"],
    cues: [
      { text: "Squeeze firmly and hold for 3-5 seconds", cueType: "verbal" },
      { text: "Spread your fingers fully between squeezes", cueType: "verbal" },
    ],
    regressions: [
      { name: "Softer Ball", description: "Use a softer therapy putty or partially inflated ball to reduce resistance." },
    ],
    progressions: [
      { name: "Grip Trainer", description: "Use an adjustable grip trainer to progressively increase resistance." },
      { name: "Towel Wringing", description: "Wring out a wet towel — combines grip with forearm rotation." },
    ],
  },
  {
    slug: "thumb-opposition-exercise",
    name: "Thumb Opposition Exercise",
    description: "Touch the thumb to each fingertip in sequence, then reverse. Trains opposition coordination used in fine motor tasks.",
    confidence: 0.85,
    dosing: "3×10 reps per finger, 3x/week; part of multimodal hand program",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["thumb-opposition"],
    muscleRoles: [
      { muscleSlug: "opponens-pollicis", role: "primary" },
      { muscleSlug: "flexor-pollicis-brevis", role: "primary", notes: "Flexion component of opposition" },
      { muscleSlug: "abductor-pollicis-brevis", role: "primary", notes: "Abduction component of opposition" },
    ],
    functionalTaskSlugs: ["gripping-cup", "typing"],
    cues: [
      { text: "Touch your thumb firmly to each fingertip, making an O shape", cueType: "verbal" },
      { text: "Go slowly and make each touch precise", cueType: "verbal" },
    ],
    regressions: [
      { name: "Assisted Opposition", description: "Use the other hand to guide the thumb through the pattern." },
    ],
    progressions: [
      { name: "Putty Pinch", description: "Pinch therapy putty between thumb and each finger for resistive opposition." },
    ],
  },
  {
    slug: "hip-adduction-sidelying",
    name: "Sidelying Hip Adduction",
    description: "Lie on side with top leg forward on a support. Lift the bottom leg toward ceiling. Targets adductor group for medial thigh strengthening.",
    confidence: 0.85,
    dosing: "3×15-20 reps per side",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "sidelying",
    evidenceLevel: "limited",
    emgNotes: "14-48% MVIC sidelying; Copenhagen variation achieves 108% MVIC [Serner 2014]",
    movementSlugs: ["hip-adduction"],
    muscleRoles: [
      { muscleSlug: "adductor-group", role: "primary", notes: "14-48% MVIC sidelying; Copenhagen variation achieves 108% [Serner 2014]" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core activation for sidelying position stability" },
    ],
    functionalTaskSlugs: ["walking"],
    cues: [
      { text: "Keep your bottom leg straight as you lift", cueType: "verbal" },
      { text: "Lift only until you feel the inner thigh working — don't roll your pelvis", cueType: "verbal" },
    ],
    regressions: [
      { name: "Ball Squeeze", description: "Squeeze a ball between the knees while supine. Isometric adduction with less balance demand." },
    ],
    progressions: [
      { name: "Standing Cable Adduction", description: "Stand and pull a cable inward across the body against resistance." },
    ],
  },
  {
    slug: "seated-hip-internal-rotation",
    name: "Seated Hip Internal Rotation",
    description: "Sit on edge of chair with feet on floor. Rotate the shin outward (foot moves out) to internally rotate the hip. Often limited in hip pathology.",
    confidence: 0.80,
    notes: "Hip internal rotation is commonly limited. Assessment of ROM should precede strengthening.",
    dosing: "3×10-15 reps per side; assess ROM before strengthening",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "seated",
    evidenceLevel: "limited",
    movementSlugs: ["hip-internal-rotation"],
    muscleRoles: [
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Anterior fibers — context-dependent primary at flexed positions [Martins 2022]" },
      { muscleSlug: "gluteus-minimus", role: "primary", notes: "Primary internal rotator [Ganderton 2017]" },
      { muscleSlug: "tensor-fasciae-latae", role: "secondary", notes: "Active primarily at 90° hip flexion [Martins 2022]" },
    ],
    functionalTaskSlugs: ["walking"],
    cues: [
      { text: "Keep your knee still — only the foot moves outward", cueType: "verbal" },
      { text: "You should feel the side of your hip working", cueType: "verbal" },
    ],
    regressions: [
      { name: "Passive IR Stretch", description: "Gently stretch into internal rotation without active resistance. Focus on ROM first." },
    ],
    progressions: [
      { name: "Band-Resisted IR", description: "Add a resistance band around the ankle for resistive internal rotation." },
    ],
  },
  {
    slug: "ankle-inversion-eversion",
    name: "Resisted Ankle Inversion/Eversion",
    description: "Seated with resistance band around foot. Turn the sole inward (inversion) and outward (eversion) against band resistance. Critical for ankle stability and injury prevention.",
    confidence: 0.85,
    dosing: "3×15 reps each direction, progress band resistance",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["foot-inversion", "foot-eversion"],
    muscleRoles: [
      { muscleSlug: "tibialis-anterior", role: "primary", notes: "Inversion" },
      { muscleSlug: "tibialis-posterior", role: "primary", notes: "Inversion" },
      { muscleSlug: "peroneus-longus", role: "primary", notes: "Eversion" },
    ],
    functionalTaskSlugs: ["walking"],
    cues: [
      { text: "Turn your sole inward against the band, then slowly release", cueType: "verbal" },
      { text: "For eversion: turn your sole outward against the band", cueType: "verbal" },
      { text: "Keep your knee still — only the ankle moves", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active ROM", description: "Perform inversion/eversion without resistance to build motor control." },
    ],
    progressions: [
      { name: "Single-Leg Balance", description: "Stand on one foot on an unstable surface. Challenges dynamic inversion/eversion reactively." },
    ],
  },
  // ── Evidence-Based "Top 3" Exercises per Region ─────────────────────────
  // Cervical Spine
  {
    slug: "deep-neck-flexor-training",
    name: "Deep Neck Flexor Training (Chin Tucks with Pressure Biofeedback)",
    description: "Craniocervical flexion exercise targeting the deep cervical flexors (longus colli, longus capitis). Patient lies supine with a pressure biofeedback unit behind the neck and performs graded chin tuck contractions (22-30 mmHg). Improves neck pain, posture, and muscle endurance while increasing deep flexor cross-sectional area.",
    confidence: 0.9,
    notes: "Addresses forward head posture and hypertonic superficial neck muscles common in sedentary workers. With biofeedback, enhances motor control. Evidence: craniocervical flexion exercises improve pain, posture, and deep flexor muscle cross-sectional area [Amiri Arimi 2017, Sun 2024].",
    dosing: "10 reps × 10-second holds at each pressure level (22-30 mmHg), 2x daily for 6 weeks minimum",
    difficulty: "beginner",
    equipment: ["pressure-biofeedback-unit"],
    bodyPosition: "supine",
    evidenceLevel: "strong",
    emgNotes: "Linear EMG-pressure relationship (22-30 mmHg); longus colli 17.4% CSA increase at C2-C3 [Falla 2003, Cagnie 2010]",
    movementSlugs: ["cervical-flexion-upper"],
    muscleRoles: [
      { muscleSlug: "deep-cervical-flexors", role: "primary", notes: "Longus colli and longus capitis — the target muscles" },
      { muscleSlug: "sternocleidomastoid", role: "stabilizer", notes: "Should be minimally active — overuse indicates compensatory pattern" },
    ],
    functionalTaskSlugs: ["posture-maintenance"],
    cues: [
      { text: "Gently nod your chin as if making a small double chin — don't lift your head", cueType: "verbal" },
      { text: "Think of lengthening the back of your neck against the surface", cueType: "verbal" },
      { text: "Hold each level for 10 seconds, keeping the pressure steady on the gauge", cueType: "verbal" },
      { text: "If you feel the front of your neck straining, you're pushing too hard", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Chin Tuck (No Biofeedback)", description: "Perform the chin tuck motion lying down without a pressure gauge. Focus on the subtle 'nod' without lifting the head." },
      { name: "Seated Chin Tuck", description: "Perform seated against a wall for tactile feedback. Less precise than biofeedback but more accessible." },
    ],
    progressions: [
      { name: "Graded Pressure Holds", description: "Progress through 22, 24, 26, 28, 30 mmHg targets with 10-second holds at each level, 10 repetitions." },
      { name: "Chin Tuck with Head Lift", description: "After achieving 30 mmHg, maintain the tuck while lifting the head slightly off the surface. Combines deep flexor activation with anti-gravity endurance." },
    ],
  },
  {
    slug: "scapular-stability-rows",
    name: "Scapular Stability Exercises (Rows / Scapular Retraction)",
    description: "Cervico-scapulothoracic strengthening targeting middle and lower trapezius activation. Performed as seated or standing rows with resistance band, focusing on scapular retraction and depression. Improves pain and function in chronic neck pain by coordinating shoulder-neck movement patterns and counteracting rounded shoulder postures.",
    confidence: 0.85,
    notes: "Evidence: cervico-scapulothoracic strengthening improves pain and function in chronic neck pain [Gross 2015, Mueller 2023]. Coordinates shoulder-neck movement patterns and counteracts prolonged-sitting postures [Cho 2017].",
    dosing: "3×10-15 reps, 2-3x/week",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["scapular-retraction", "shoulder-extension"],
    muscleRoles: [
      { muscleSlug: "trapezius-middle", role: "primary" },
      { muscleSlug: "trapezius-lower", role: "primary" },
      { muscleSlug: "rhomboid-major", role: "secondary" },
      { muscleSlug: "posterior-deltoid", role: "secondary" },
      { muscleSlug: "latissimus-dorsi", role: "synergist" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "reaching-overhead"],
    cues: [
      { text: "Squeeze your shoulder blades together and slightly down — don't shrug", cueType: "verbal" },
      { text: "Lead with the elbows, pulling them straight back", cueType: "verbal" },
      { text: "Hold the retracted position for 2-3 seconds before releasing", cueType: "verbal" },
    ],
    regressions: [
      { name: "Isometric Scapular Retraction", description: "Squeeze shoulder blades together without resistance. Hold 5-10 seconds." },
      { name: "Wall Angel", description: "Stand with back against wall, slide arms up and down while maintaining scapular retraction contact with wall." },
    ],
    progressions: [
      { name: "Prone Y/T/W Raises", description: "Lying face down, perform arm raises in Y, T, and W positions to progressively challenge scapular stabilizers." },
      { name: "Cable/Band Row (Standing)", description: "Increase resistance with heavier band or cable. Single-arm variation adds rotational stability demand." },
    ],
  },
  {
    slug: "cervicothoracic-self-mobilization",
    name: "Cervicothoracic Self-Mobilization",
    description: "Combined cervical and thoracic spine mobility exercises using foam roller or towel roll. Patient performs supine thoracic extension over a roll positioned at the cervicothoracic junction, combined with active cervical range of motion. Demonstrates superior outcomes for pain reduction and ROM compared to cervical exercises alone.",
    confidence: 0.85,
    notes: "Evidence: combined cervical and thoracic mobility exercises show superior outcomes vs cervical exercises alone [Sun 2024, Cho 2017]. Addresses the kinetic chain relationship between thoracic stiffness and neck dysfunction.",
    dosing: "5-10 reps per segment, daily",
    difficulty: "intermediate",
    equipment: ["foam-roller"],
    bodyPosition: "supine",
    evidenceLevel: "moderate",
    movementSlugs: ["thoracic-extension", "cervical-extension", "cervical-rotation"],
    muscleRoles: [
      { muscleSlug: "erector-spinae", role: "primary", notes: "Thoracic portion — facilitates extension mobility" },
      { muscleSlug: "deep-cervical-flexors", role: "stabilizer", notes: "Maintains cervical neutral during thoracic mobilization" },
      { muscleSlug: "trapezius-middle", role: "secondary", notes: "Facilitates scapular retraction component" },
    ],
    functionalTaskSlugs: ["posture-maintenance"],
    cues: [
      { text: "Place the foam roller at the level of your shoulder blades", cueType: "verbal" },
      { text: "Cross your arms over your chest or support your head with your hands", cueType: "verbal" },
      { text: "Gently extend over the roller — breathe out as you go back", cueType: "verbal" },
      { text: "Move the roller one segment up and repeat — work from mid-back to upper back", cueType: "verbal" },
    ],
    regressions: [
      { name: "Towel Roll Extension", description: "Use a rolled towel instead of foam roller for less aggressive mobilization. Position between shoulder blades while supine." },
      { name: "Seated Thoracic Extension", description: "Sit in a chair, interlock hands behind head, and gently extend over the chair back." },
    ],
    progressions: [
      { name: "Foam Roller with Arm Overhead", description: "Extend over roller while reaching arms overhead to add shoulder flexion demand and increase thoracic extension range." },
      { name: "Thread the Needle", description: "Quadruped thoracic rotation — reach one arm under and through, then open up to the ceiling. Adds rotational component." },
    ],
  },
  // Thoracic Spine
  {
    slug: "thoracic-extension-rotation-mobilization",
    name: "Thoracic Extension/Rotation Mobilization",
    description: "Active mobility exercises targeting thoracic spine extension and rotation. Includes open book rotations in sidelying, quadruped thoracic rotation, and seated rotation with overpressure. Significantly improves thoracic kyphosis angle, cervical extension, and pain. More effective than cervical-only interventions for forward head posture.",
    confidence: 0.85,
    notes: "Evidence: thoracic mobilization significantly improves kyphosis angle, cervical extension, and pain [Cho 2017, Feng 2018]. More effective than cervical-only interventions for forward head posture [Cho 2017].",
    dosing: "3×10 reps each direction, daily",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "sidelying",
    evidenceLevel: "moderate",
    movementSlugs: ["thoracic-extension", "thoracic-rotation"],
    muscleRoles: [
      { muscleSlug: "erector-spinae", role: "primary", notes: "Thoracic portion drives extension" },
      { muscleSlug: "multifidus", role: "primary", notes: "Segmental rotation control" },
      { muscleSlug: "internal-oblique", role: "secondary", notes: "Ipsilateral rotation" },
      { muscleSlug: "external-oblique", role: "secondary", notes: "Contralateral rotation" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "breathing"],
    cues: [
      { text: "For open book: lie on your side with knees stacked, rotate your top arm open like turning a page", cueType: "verbal" },
      { text: "Follow your hand with your eyes — let the rotation come from your mid-back", cueType: "verbal" },
      { text: "Breathe out as you rotate — the exhale helps release tension", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Trunk Rotation", description: "Lie on back with knees bent, gently drop knees side to side. Gravity-assisted with less demand." },
      { name: "Cat-Cow with Rotation", description: "In quadruped, combine cat-cow with gentle rotation by reaching one arm to the ceiling." },
    ],
    progressions: [
      { name: "Seated Rotation with Overpressure", description: "Sit straddling a bench, arms crossed. Rotate and use opposite hand on knee for gentle overpressure at end range." },
      { name: "Half-Kneeling Thoracic Rotation", description: "Half-kneeling with hands behind head. Rotate toward the front knee. Challenges hip-thoracic dissociation." },
    ],
  },
  {
    slug: "schroth-three-dimensional-exercises",
    name: "Schroth-Based Three-Dimensional Exercises",
    description: "Functional exercises addressing postural kyphosis through three-dimensional corrective movements. Combines elongation, deflection, derotation, and facilitated breathing. Demonstrates large effect sizes for improving thoracic kyphosis (mean reduction of 14.76°), lumbar lordosis, balance, and quality of life.",
    confidence: 0.85,
    notes: "Evidence: large effect sizes for kyphosis reduction (14.76°), lumbar lordosis improvement, balance, and QOL [Özdemir Görgü 2023]. Requires trained instruction initially.",
    dosing: "2x/week for 8 weeks under supervision; ≤3 months program",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Kyphosis reduction -14.76° (large effect size) [Özdemir 2023]",
    movementSlugs: ["thoracic-extension", "thoracic-lateral-flexion", "thoracic-rotation"],
    muscleRoles: [
      { muscleSlug: "erector-spinae", role: "primary", notes: "Elongation and extension component" },
      { muscleSlug: "multifidus", role: "primary", notes: "Segmental correction" },
      { muscleSlug: "trapezius-lower", role: "secondary", notes: "Scapular depression and postural alignment" },
      { muscleSlug: "diaphragm", role: "synergist", notes: "Rotational breathing component" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "breathing"],
    cues: [
      { text: "Lengthen your spine upward as if a string is pulling the crown of your head to the ceiling", cueType: "verbal" },
      { text: "Breathe into the concavity — direct your breath into the collapsed side of your ribcage", cueType: "verbal" },
      { text: "Maintain the corrected position while breathing normally for 30 seconds", cueType: "verbal" },
    ],
    regressions: [
      { name: "Wall-Supported Elongation", description: "Stand with back against wall. Focus on elongation only — press head, mid-back, and sacrum into wall." },
      { name: "Supine Corrective Positioning", description: "Lie supine with towel rolls placed to support corrected spinal curves. Practice breathing in corrected position." },
    ],
    progressions: [
      { name: "Schroth with Resistance", description: "Perform corrective postures while holding light resistance. Increases muscular endurance demand." },
      { name: "Functional Integration", description: "Maintain Schroth corrections during daily activities — sitting, standing, walking. Transfers postural gains to real-world use." },
    ],
  },
  {
    slug: "diaphragmatic-breathing",
    name: "Diaphragmatic / Rib Expansion Breathing Exercises",
    description: "Physiotherapeutic breathing exercises targeting diaphragmatic excursion and rib cage expansion. Patient practices belly breathing in supine progressing to seated and standing. Significantly improves chest expansion, spinal mobility (especially lateral flexion), and posture. Equally effective as yoga and Pilates for improving spinal mobility while enhancing respiratory function.",
    confidence: 0.85,
    notes: "Evidence: breathing exercises significantly improve chest expansion, spinal mobility (especially lateral flexion), and posture [Csepregi 2022, Eftekhari 2024]. Equally effective as yoga/Pilates for spinal mobility [Csepregi 2022].",
    dosing: "10 breaths × 3 sets, 2-3x daily; 4-count inhale, 6-8 count exhale",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "moderate",
    emgNotes: "Improves chest expansion, spinal mobility, and posture comparably to yoga/Pilates [Csepregi 2022]",
    movementSlugs: ["thoracic-extension", "thoracic-lateral-flexion"],
    muscleRoles: [
      { muscleSlug: "diaphragm", role: "primary", notes: "Primary inspiratory muscle — target of exercise" },
      { muscleSlug: "transversus-abdominis", role: "synergist", notes: "Expiratory control and intra-abdominal pressure" },
      { muscleSlug: "internal-oblique", role: "synergist", notes: "Assists forced expiration" },
      { muscleSlug: "erector-spinae", role: "stabilizer", notes: "Postural maintenance during breathing" },
      { muscleSlug: "external-oblique", role: "synergist", notes: "Contributes during forced expiration phases" },
    ],
    functionalTaskSlugs: ["breathing", "posture-maintenance"],
    cues: [
      { text: "Place one hand on your chest and one on your belly — the belly hand should rise first", cueType: "verbal" },
      { text: "Breathe in through your nose for 4 counts, expanding your ribcage laterally", cueType: "verbal" },
      { text: "Breathe out slowly through pursed lips for 6-8 counts — feel your belly fall", cueType: "verbal" },
      { text: "For rib expansion: wrap a band around your lower ribs and breathe against the resistance", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Belly Breathing", description: "Lie on back with knees bent. Place a light book on the belly as visual feedback for diaphragmatic motion." },
      { name: "Crocodile Breathing", description: "Lie prone with forehead on hands. Breathe into the belly against the floor — the floor provides tactile feedback for diaphragm descent." },
    ],
    progressions: [
      { name: "Lateral Rib Expansion with Band", description: "Wrap a resistance band around the lower ribcage. Breathe to expand the ribs against the band resistance." },
      { name: "90/90 Breathing", description: "Lie supine with feet on wall, hips and knees at 90°. Breathe to restore zone of apposition and inhibit accessory muscle overuse." },
    ],
  },
  // Lumbar Spine and Core
  {
    slug: "core-stabilization-adim",
    name: "Core Stabilization with Abdominal Drawing-In Maneuver (ADIM)",
    description: "Core stabilization exercise targeting deep trunk muscles (transversus abdominis, multifidus). Patient draws the navel toward the spine without moving the pelvis, then maintains the contraction during limb movements. Reduces lumbar segmental translation and pain more effectively than general strengthening. Fundamental for lumbar instability and chronic low back pain.",
    confidence: 0.95,
    notes: "ADIM produces significantly reduced sagittal translation at L4-L5 and L5-S1 at 10 weeks [Puntumetakul 2021]. Greater improvement in abdominal muscle activity ratio at 10 weeks and 12 months [Puntumetakul 2021]. Superior improvements in proprioception, balance, and muscle thickness of TrA and LM vs general strengthening [Hlaing 2021]. Dosing: 30 min, 3x/week, 4 weeks minimum; initially 8-10 reps every 2 hours [Hegmann 2020]. Note: abdominal bracing generates IAP 116.4 mmHg vs hollowing 9.9 mmHg [Tayashiki 2016] — both approaches have clinical utility.",
    dosing: "8-10 reps every 2 hours initially; 30 min 3x/week, 4 weeks minimum",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "strong",
    emgNotes: "Reduces sagittal translation at L4-L5/L5-S1 at 10 weeks [Puntumetakul 2021]. Bracing IAP 116.4 mmHg vs hollowing 9.9 mmHg [Tayashiki 2016]",
    movementSlugs: ["lumbar-extension", "lumbar-flexion"],
    muscleRoles: [
      { muscleSlug: "transversus-abdominis", role: "primary", notes: "Primary target — drawing-in activates TrA preferentially" },
      { muscleSlug: "multifidus", role: "primary", notes: "Co-activates with TrA for segmental stabilization" },
      { muscleSlug: "internal-oblique", role: "synergist", notes: "Deepest oblique fibers co-activate with TrA" },
      { muscleSlug: "diaphragm", role: "stabilizer", notes: "Forms the top of the 'pressure canister' for intra-abdominal pressure" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "walking"],
    cues: [
      { text: "Gently draw your belly button toward your spine — like zipping up a tight pair of pants", cueType: "verbal" },
      { text: "Maintain normal breathing while holding the contraction — don't hold your breath", cueType: "verbal" },
      { text: "You should feel a gentle tightening deep in your lower abdomen, not a strong bracing", cueType: "verbal" },
      { text: "Keep your pelvis completely still — no rocking or tilting", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine ADIM Only", description: "Lie on back with knees bent. Practice the drawing-in maneuver alone without any limb movement. Hold 10 seconds." },
      { name: "ADIM with Biofeedback", description: "Place a pressure biofeedback unit under the lumbar spine. Maintain target pressure while performing the drawing-in." },
    ],
    progressions: [
      { name: "ADIM + Heel Slides", description: "Maintain ADIM while slowly sliding one heel along the surface to extend the leg. Challenges core stability with limb loading." },
      { name: "ADIM + Leg Lifts", description: "Maintain ADIM while lifting one leg to 90° hip flexion. Progress to alternating legs (dead bug foundation)." },
      { name: "ADIM in Quadruped", description: "Perform ADIM in hands-and-knees position against gravity. Foundation for bird dog progression." },
    ],
  },
  {
    slug: "bird-dog",
    name: "Bird Dog Exercise",
    description: "Quadruped exercise: simultaneously extend opposite arm and leg while maintaining a neutral spine. Activates lumbar erector spinae (29% nEMG) and multifidus while promoting anti-rotation core stability. Well-tolerated, functional, and progresses from basic to advanced levels.",
    confidence: 0.95,
    notes: "EMG: lumbar erector spinae 29% nEMG (27-46%) [Calatayud 2019]. Produces higher amplitudes across all muscle groups compared to hip abduction exercises (14±3% to 53±4%) [Mueller 2018]. 5 intensity levels available; muscle activity increases significantly with each level (p<0.05) [Kim 2016]. Well-tolerated in chronic LBP patients [Calatayud 2019].",
    dosing: "3×8-10 reps per side with 5-10 second holds",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "quadruped",
    evidenceLevel: "strong",
    emgNotes: "Glute max ~40-56% MVIC; erector spinae 29% nEMG; lowest L/G ratio (1.21) indicating good local muscle targeting [Ekstrom 2007, Khosrokiani 2021]",
    movementSlugs: ["lumbar-extension", "hip-extension", "shoulder-flexion"],
    muscleRoles: [
      { muscleSlug: "erector-spinae", role: "primary", notes: "29% nEMG — lumbar stabilization during limb extension" },
      { muscleSlug: "multifidus", role: "stabilizer", notes: "Segmental stabilizer rather than primary extensor — L/G ratio 1.21 [Khosrokiani 2021]" },
      { muscleSlug: "gluteus-maximus", role: "secondary", notes: "Extends the hip during leg reach" },
      { muscleSlug: "anterior-deltoid", role: "secondary", notes: "Extends arm overhead" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core bracing prevents lumbar extension collapse" },
      { muscleSlug: "external-oblique", role: "stabilizer", notes: "Contralateral anti-rotation demand" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "walking"],
    cues: [
      { text: "Start on hands and knees — wrists under shoulders, knees under hips", cueType: "verbal" },
      { text: "Reach your opposite arm and leg long, like you're being pulled from both ends", cueType: "verbal" },
      { text: "Keep your hips level — imagine balancing a glass of water on your low back", cueType: "verbal" },
      { text: "Move slowly and hold for 5-10 seconds before switching sides", cueType: "verbal" },
    ],
    regressions: [
      { name: "Arm Only", description: "In quadruped, extend one arm at a time without leg movement. Builds upper extremity and core control." },
      { name: "Leg Only", description: "In quadruped, extend one leg at a time without arm movement. Focuses on anti-extension core control." },
    ],
    progressions: [
      { name: "Bird Dog with Elbow-to-Knee", description: "After extending, bring the elbow and knee together under the trunk before re-extending. Adds flexion control." },
      { name: "Bird Dog with Band", description: "Loop a resistance band around the extending foot and opposite hand. Increases demand on both the extending and stabilizing muscles." },
      { name: "Bird Dog on BOSU", description: "Perform with hands on a BOSU ball. Adds balance/proprioceptive demand." },
    ],
  },
  {
    slug: "modified-curl-up-dead-bug",
    name: "Modified Curl-Up / Dead Bug",
    description: "Two complementary anterior core exercises. Modified curl-up: supine with one knee bent, hands under lumbar spine, lift head and shoulders minimally. Dead bug: supine with arms and legs at 90°, lower opposite arm and leg while maintaining lumbar contact. Effectively activate rectus abdominis (50% nEMG) and external obliques while minimizing lumbar compression. Safe and well-tolerated in patients with low back pain.",
    confidence: 0.95,
    notes: "Modified curl-up: rectus abdominis 50% nEMG (28-65%) [Calatayud 2019]. Dead bug: peak RA and EO amplitudes increase significantly with intensity (p=0.008 and p<0.001) [Kim 2016]. 5 graded intensity levels available [Kim 2016]. Plank with brace: EO 77% nEMG [Calatayud 2019]. Plank with hollowing significantly increases all oblique activation (IO: ES=2.0-2.3, EO: ES=1.0-1.4, lumbar ES: ES=0.6) [García-Jaén 2020]. Well-tolerated in chronic LBP; lateral plank mostly non-tolerated [Calatayud 2019].",
    dosing: "3×8-12 reps; 5 graded intensity levels available",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "strong",
    emgNotes: "Rectus abdominis 48-50% nEMG during curl-up [Calatayud 2019]. Dead bug: peak RA and EO increase significantly with intensity [Kim 2016]",
    movementSlugs: ["lumbar-flexion"],
    muscleRoles: [
      { muscleSlug: "rectus-abdominis", role: "primary", notes: "48-50% nEMG during curl-up" },
      { muscleSlug: "external-oblique", role: "primary", notes: "Significant activation, especially in dead bug" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Maintains lumbar stability" },
      { muscleSlug: "internal-oblique", role: "synergist" },
      { muscleSlug: "iliopsoas", role: "stabilizer", notes: "Hip flexion control in dead bug — moderate demand beyond pure stabilization [Juker 1998]" },
      { muscleSlug: "multifidus", role: "stabilizer", notes: "Segmental spinal stability during dead bug" },
    ],
    functionalTaskSlugs: ["posture-maintenance"],
    cues: [
      { text: "Curl-up: slide your hands under your low back, curl up just enough to lift your shoulder blades", cueType: "verbal" },
      { text: "Dead bug: start with arms pointing to ceiling, legs at 90/90. Lower opposite arm and leg slowly", cueType: "verbal" },
      { text: "Keep your low back pressed into the floor the entire time — that's the key", cueType: "verbal" },
      { text: "Breathe out as you extend the limbs, breathe in as you return", cueType: "verbal" },
    ],
    regressions: [
      { name: "Dead Bug — Heel Taps Only", description: "Keep arms stationary pointing to ceiling. Only lower one heel at a time to tap the floor. Reduces demand." },
      { name: "Mini Curl-Up", description: "Curl up just enough to feel the abs engage — don't lift the shoulder blades fully. Reduce range to control difficulty." },
    ],
    progressions: [
      { name: "Dead Bug with Band", description: "Hold a resistance band overhead, anchored to a post. Adds anti-extension demand as arms extend." },
      { name: "Pallof Press Dead Bug", description: "Combine dead bug with a Pallof press — anti-rotation plus anti-extension. Advanced core challenge." },
    ],
  },
  // Shoulder Girdle
  {
    slug: "prone-horizontal-abduction-er",
    name: "Prone Horizontal Abduction with External Rotation (Prone Y/T)",
    description: "Lying face down, lift arms in a Y or T position with thumbs pointing up (external rotation). Demonstrates optimal scapular neuromuscular control with excellent UT/MT ratio (0.43) and UT/LT ratio (0.30). Activates middle and lower trapezius at >50% MVIC while keeping upper trapezius <20%.",
    confidence: 0.95,
    notes: "EMG data at 100° abduction: supraspinatus 82% MVIC, middle deltoid 87% MVIC, posterior deltoid 88% MVIC, MT >50% MVIC, LT >50% MVIC [Reinold 2004, Mendez-Rebolledo 2024]. Optimal UT/MT (0.43) and UT/LT (0.30) ratios. Early scapular stabilizer activation (-474.7 to 89.9 ms relative to UT) [Mendez-Rebolledo 2024]. Dosing: 3×8-15 reps, 3 days/week [Mulroy 2020].",
    dosing: "3×8-15 reps, 3 days/week",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "prone",
    evidenceLevel: "strong",
    emgNotes: "MT and LT >50% MVIC; optimal UT/MT ratio 0.43, UT/LT ratio 0.30 [Mendez-Rebolledo 2024]",
    movementSlugs: ["scapular-retraction", "shoulder-external-rotation", "scapular-upward-rotation"],
    muscleRoles: [
      { muscleSlug: "trapezius-middle", role: "primary", notes: ">50% MVIC activation" },
      { muscleSlug: "trapezius-lower", role: "primary", notes: ">50% MVIC activation" },
      { muscleSlug: "infraspinatus", role: "secondary", notes: "External rotation component" },
      { muscleSlug: "posterior-deltoid", role: "secondary", notes: "Horizontal abduction" },
      { muscleSlug: "rhomboid-major", role: "synergist" },
    ],
    functionalTaskSlugs: ["reaching-overhead", "posture-maintenance"],
    cues: [
      { text: "Lie face down with arms hanging off the edge or at your sides", cueType: "verbal" },
      { text: "For Y: lift arms overhead at 45° with thumbs up. For T: lift arms straight out to the side with thumbs up", cueType: "verbal" },
      { text: "Squeeze your shoulder blades together as you lift — think 'down and in'", cueType: "verbal" },
      { text: "Hold at the top for 3-5 seconds, lower with control", cueType: "verbal" },
    ],
    regressions: [
      { name: "Prone I Raise", description: "Lift arms straight overhead (I position). Simpler movement pattern before progressing to Y and T." },
      { name: "Standing Band Y/T", description: "Perform the Y/T pattern standing with a light resistance band. Gravity-reduced position." },
    ],
    progressions: [
      { name: "Prone Y/T with Light Weight", description: "Add 1-3 lb dumbbells to increase resistance in the elevated position." },
      { name: "Prone W Raise", description: "Add the W position (elbows bent, squeeze shoulder blades) to create a Y/T/W circuit targeting all scapular stabilizers." },
    ],
  },
  {
    slug: "push-up-plus",
    name: "Push-Up Plus",
    description: "Standard push-up with an additional scapular protraction at the top (the 'plus'). Activates serratus anterior at high amplitude and lower trapezius over upper trapezius. Ideal for scapular stabilization. Addresses scapular winging and promotes upward rotation essential for overhead activities.",
    confidence: 0.95,
    notes: "EMG: high serratus anterior activation, favorable LT/UT ratio [Andersen 2012, Kibler 2008]. Addresses scapular winging and promotes upward rotation [Kibler 2008]. Dosing: 3×8 at 8-RM, 3 days/week [Mulroy 2020]. Closed-chain exercises like planks appropriate after 12+ weeks post-surgery [Kennedy 2020].",
    dosing: "3×8 at 8-RM, 3 days/week",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "prone",
    evidenceLevel: "strong",
    emgNotes: "High serratus anterior activation with favorable LT/UT ratio [Andersen 2012, Kibler 2008]",
    movementSlugs: ["scapular-protraction", "elbow-extension", "shoulder-flexion", "scapular-upward-rotation"],
    muscleRoles: [
      { muscleSlug: "serratus-anterior", role: "primary", notes: "High amplitude activation — the 'plus' targets SA specifically" },
      { muscleSlug: "trapezius-lower", role: "primary", notes: "Activated over upper trapezius" },
      { muscleSlug: "pectoralis-major", role: "secondary", notes: "Push-up component" },
      { muscleSlug: "triceps-brachii", role: "secondary", notes: "Elbow extension in push-up" },
      { muscleSlug: "anterior-deltoid", role: "synergist" },
    ],
    functionalTaskSlugs: ["reaching-overhead", "pushing-up-from-chair"],
    cues: [
      { text: "Do a normal push-up, then at the top push further — round your upper back to protract your shoulder blades", cueType: "verbal" },
      { text: "The 'plus' is the most important part — push the floor away from you at the top", cueType: "verbal" },
      { text: "Keep your core tight throughout — don't sag at the hips", cueType: "verbal" },
    ],
    regressions: [
      { name: "Wall Push-Up Plus", description: "Perform against a wall. At the end of the push, push further to protract the scapulae. Much lower load." },
      { name: "Kneeling Push-Up Plus", description: "Perform on knees to reduce body weight percentage. Focus on the plus motion at the top." },
    ],
    progressions: [
      { name: "Push-Up Plus on Unstable Surface", description: "Perform with hands on a BOSU or stability ball. Increases serratus anterior and stabilizer demand." },
      { name: "Single-Arm Push-Up Plus", description: "Elevated surface, single-arm push-up with plus. Advanced scapular stability challenge." },
    ],
  },
  {
    slug: "external-rotation-0-abduction",
    name: "External Rotation at 0° Abduction (Side-Lying or Band)",
    description: "Rotator cuff strengthening targeting infraspinatus through external rotation with the arm at the side. Side-lying or standing with resistance band. Prevents superior humeral head migration and reduces impingement risk. Foundational for shoulder stability, progressible with resistance bands.",
    confidence: 0.95,
    notes: "EMG data: infraspinatus 62% MVIC, teres minor 67% MVIC, supraspinatus 24-37% MVIC [Reinold 2004]. Dosing: 3×8 at 8-RM, 3 days/week [Mulroy 2020]. Motor control exercises superior to nonspecific (SMD: -0.29 short, -0.33 medium term) [Lafrance 2024]. Perform in scapular plane to minimize superior humeral head migration [Mulroy 2020]. Control eccentric phase 2 seconds [Rodrigues da Silva Barros 2023].",
    dosing: "3×8 at 8-RM, 3 days/week; 2-second eccentric",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "sidelying",
    evidenceLevel: "strong",
    emgNotes: "Infraspinatus 62% MVIC, teres minor 67% MVIC, supraspinatus 24-37% [Reinold 2004]",
    movementSlugs: ["shoulder-external-rotation"],
    muscleRoles: [
      { muscleSlug: "infraspinatus", role: "primary", notes: "Primary external rotator at 0° abduction" },
      { muscleSlug: "teres-minor", role: "primary" },
      { muscleSlug: "posterior-deltoid", role: "synergist", notes: "Minimal contribution at 0° abduction" },
      { muscleSlug: "supraspinatus", role: "stabilizer", notes: "Humeral head depressor role" },
    ],
    functionalTaskSlugs: ["reaching-overhead"],
    cues: [
      { text: "Keep your elbow pinned to your side — a rolled towel between elbow and body helps", cueType: "verbal" },
      { text: "Rotate your forearm outward slowly against the band, then return even slower", cueType: "verbal" },
      { text: "Don't let your shoulder hike up or your body twist", cueType: "verbal" },
      { text: "Side-lying: start with the forearm resting on your belly and rotate upward toward the ceiling", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active-Assisted ER with Cane", description: "Use a cane or dowel to assist the motion with the other hand. Reduces load on the rotator cuff." },
      { name: "Side-Lying ER (Gravity Only)", description: "Perform side-lying without additional resistance. Gravity provides the load." },
    ],
    progressions: [
      { name: "Band ER at 0° (Heavier Band)", description: "Progress resistance band color/thickness as strength improves. Maintain slow eccentric control." },
      { name: "90/90 External Rotation", description: "Shoulder abducted to 90°, elbow at 90°. Rotate forearm up against resistance. Higher demand, sport-specific position." },
    ],
  },
  // Hip and Pelvis
  {
    slug: "hip-abduction-strengthening",
    name: "Hip Strengthening (Clamshells / Side-Lying Hip Abduction)",
    description: "Hip abductor and extensor strengthening targeting gluteus medius and maximus. Includes clamshells and side-lying hip abduction. Addresses muscle weakness common in hip OA and improves functional stability for gait and single-leg activities.",
    confidence: 0.85,
    notes: "Evidence: hip abductor and extensor strengthening addresses weakness common in hip OA, improves functional stability [VA 2020, Cibulka 2017]. Targets glut med/max essential for gait and single-leg activities.",
    dosing: "3×15-20 reps per side, 2-3x/week",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "sidelying",
    evidenceLevel: "strong",
    movementSlugs: ["hip-abduction", "hip-external-rotation"],
    muscleRoles: [
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Primary hip abductor and pelvic stabilizer" },
      { muscleSlug: "gluteus-maximus", role: "secondary", notes: "Upper fibers assist abduction; key hip extensor" },
      { muscleSlug: "piriformis", role: "synergist", notes: "Assists external rotation in clamshell" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing", "single-leg-balance"],
    cues: [
      { text: "For clamshells: keep feet together, open knees like a book. Don't let your pelvis roll back", cueType: "verbal" },
      { text: "For side-lying abduction: keep your body in a straight line, lift the top leg toward the ceiling", cueType: "verbal" },
      { text: "Lead with the heel, not the toe — avoid rotating the hip forward", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Hip Abduction", description: "Lie on back with legs straight. Slide one leg out to the side along the floor. Gravity-eliminated position." },
    ],
    progressions: [
      { name: "Banded Clamshell", description: "Add a resistance band just above the knees. Increases gluteus medius demand." },
      { name: "Standing Hip Abduction with Band", description: "Standing on one leg, abduct the other against a band. Challenges both the moving and stance leg." },
      { name: "Side Plank with Hip Abduction", description: "Hold side plank and lift the top leg. Combines core stability with hip abduction." },
    ],
  },
  {
    slug: "hip-flexor-hamstring-stretch",
    name: "Hip Flexor and Hamstring Stretching",
    description: "Flexibility exercises addressing hip ROM impairments. Half-kneeling hip flexor stretch (iliopsoas, rectus femoris) and supine hamstring stretch. Improves function in hip OA and addresses limited hip mobility that affects lumbar spine mechanics.",
    confidence: 0.85,
    notes: "Evidence: flexibility exercises improve function in hip OA [Cibulka 2017]. Limited hip mobility affects lumbar spine mechanics and functional movement [Moreside 2012].",
    dosing: "3×30-60 seconds per side, daily; 10-30 seconds general, 30-60 for older adults",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "half-kneeling",
    evidenceLevel: "moderate",
    emgNotes: "Single session hip flexor stretch: 1.2° APT reduction but no lumbar lordosis change [Preece 2021]. Dynamic stretching ES 3.01-3.06 for hip ROM [Iranmanesh 2025]",
    movementSlugs: ["hip-extension", "hip-flexion", "knee-flexion"],
    muscleRoles: [
      { muscleSlug: "iliopsoas", role: "primary", notes: "Stretched during hip flexor stretch" },
      { muscleSlug: "rectus-femoris", role: "primary", notes: "Stretched during hip flexor stretch (two-joint)" },
      { muscleSlug: "hamstrings", role: "primary", notes: "Stretched during hamstring stretch" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Hip flexor: half-kneeling, tuck your tailbone under (posterior pelvic tilt) before leaning forward", cueType: "verbal" },
      { text: "You should feel the stretch in the front of the hip on the kneeling side", cueType: "verbal" },
      { text: "Hamstring: lie on back, loop a strap around the foot, straighten the leg toward the ceiling", cueType: "verbal" },
      { text: "Hold each stretch for 30-60 seconds, breathe normally", cueType: "verbal" },
    ],
    regressions: [
      { name: "Supine Hip Flexor Stretch", description: "Lie on back at edge of bed/table. Pull one knee to chest, let the other leg hang off the edge for gravity-assisted stretch." },
      { name: "Seated Hamstring Stretch", description: "Sit on a chair with one leg extended on a stool. Lean forward from the hips." },
    ],
    progressions: [
      { name: "Half-Kneeling with Rear Foot Elevated", description: "Elevate the rear foot on a bench behind you during the hip flexor stretch. Dramatically increases stretch on rectus femoris." },
      { name: "Active Hamstring Stretch", description: "Contract-relax technique: isometrically push leg into strap for 5 seconds, then stretch further on the relax. PNF approach." },
    ],
  },
  {
    slug: "pelvic-tilt-realignment",
    name: "Pelvic Realignment Exercises (Pelvic Tilts)",
    description: "Supine pelvic tilt exercises for lumbopelvic awareness and motor control. Patient alternates between anterior and posterior pelvic tilts, then practices holding neutral. Part of pericapsular soft tissue and realignment (PSTR) approach. Significantly improves pain (NRS) and function (Harris Hip Score) in hip OA. Enhances lumbopelvic awareness and reduces hypertonic guarding in low back pain.",
    confidence: 0.85,
    notes: "Evidence: PSTR exercises including pelvic tilts significantly improve pain and function even in severe hip OA [Hayashi 2022]. Enhance lumbopelvic awareness and reduce guarding in LBP.",
    dosing: "3×10-15 reps each direction; find neutral and hold 10 seconds",
    difficulty: "beginner",
    equipment: [],
    bodyPosition: "supine",
    evidenceLevel: "moderate",
    movementSlugs: ["lumbar-flexion", "lumbar-extension"],
    muscleRoles: [
      { muscleSlug: "rectus-abdominis", role: "primary", notes: "Posterior pelvic tilt" },
      { muscleSlug: "gluteus-maximus", role: "primary", notes: "Assists posterior tilt" },
      { muscleSlug: "erector-spinae", role: "secondary", notes: "Primary during anterior tilt only" },
      { muscleSlug: "iliopsoas", role: "secondary", notes: "Assists anterior tilt" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core control during both directions" },
    ],
    functionalTaskSlugs: ["posture-maintenance", "walking"],
    cues: [
      { text: "Lie on back with knees bent. Flatten your low back into the floor — that's a posterior tilt", cueType: "verbal" },
      { text: "Now arch your low back away from the floor — that's an anterior tilt", cueType: "verbal" },
      { text: "Rock gently between the two, then find the middle — that's your neutral", cueType: "verbal" },
      { text: "Practice finding neutral quickly — this is the foundation of all spinal exercise", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Pelvic Tilts", description: "Perform on a firm chair or stability ball. Rock the pelvis forward and back. More functional position for some patients." },
    ],
    progressions: [
      { name: "Pelvic Clock", description: "Imagine a clock face under your pelvis. Tilt to 12, 3, 6, 9 o'clock and all positions between. Builds multi-directional control." },
      { name: "Standing Pelvic Tilts", description: "Perform against a wall, then freestanding. Transfers lumbopelvic control to upright functional positions." },
    ],
  },
  // Knee
  {
    slug: "quad-strengthening-slr-tke",
    name: "Quadriceps Strengthening (SLR / Terminal Knee Extension)",
    description: "Foundational knee exercises combining straight leg raises and terminal knee extension. SLR: supine with knee locked, lift leg to 45°. TKE: standing with band behind knee, extend the last 30°. Both target quadriceps for OA management, improving pain, function, and joint stability through concentric and eccentric strengthening.",
    confidence: 0.9,
    notes: "Evidence: quadriceps strengthening is fundamental for knee OA — improves pain, function, and joint stability [VA 2020, Sharma 2021, Zeng 2022]. Both concentric and eccentric modes effective [VA 2020].",
    dosing: "3×10-15 reps; moderate intensity 3x/week",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "supine",
    evidenceLevel: "strong",
    movementSlugs: ["knee-extension", "hip-flexion"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary", notes: "VMO emphasis in TKE for patellar tracking" },
      { muscleSlug: "rectus-femoris", role: "primary", notes: "Active in SLR (two-joint)" },
      { muscleSlug: "iliopsoas", role: "secondary", notes: "Hip flexion component of SLR" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing", "squat-to-stand"],
    cues: [
      { text: "SLR: tighten your thigh to lock the knee before lifting — the knee should stay straight throughout", cueType: "verbal" },
      { text: "TKE: stand with the band behind your knee, push it straight — really lock out the last few degrees", cueType: "verbal" },
      { text: "Slow and controlled both directions — the lowering is as important as the lifting", cueType: "verbal" },
    ],
    regressions: [
      { name: "Quad Sets", description: "Seated or supine with leg straight. Tighten the thigh muscle to push the knee down. Hold 5-10 seconds. Isometric foundation." },
      { name: "Short-Arc Quad", description: "Place a roll under the knee, extend only the lower leg. Targets terminal extension with reduced hip flexor demand." },
    ],
    progressions: [
      { name: "Ankle Weight SLR", description: "Add progressive ankle weights (1-5 lbs) for increased resistance." },
      { name: "Eccentric Step-Down", description: "Stand on a step, slowly lower the opposite foot to the ground. Eccentric quad loading in a functional pattern." },
    ],
  },
  {
    slug: "neuromuscular-exercise-knee",
    name: "Neuromuscular Exercise (Step-Downs / Single-Leg Balance)",
    description: "Neuromuscular exercises improving sensorimotor control, functional stability, and fall risk in knee OA. Includes step-downs from various heights, single-leg balance, and perturbation training. Addresses proprioceptive deficits and mimics activities of daily living.",
    confidence: 0.85,
    notes: "Evidence: neuromuscular exercises improve sensorimotor control, functional stability, and reduce fall risk in knee OA [Sharma 2021, Zeng 2022, Roos 2025]. Address proprioceptive deficits and mimic ADLs [Roos 2025].",
    dosing: "Progressive program over 12 weeks; step-down height and balance surface progress",
    difficulty: "intermediate",
    equipment: ["step"],
    bodyPosition: "standing",
    evidenceLevel: "strong",
    movementSlugs: ["knee-flexion", "knee-extension", "hip-abduction"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary", notes: "Eccentric control during step-downs" },
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Pelvic stability during single-leg stance" },
      { muscleSlug: "hamstrings", role: "secondary", notes: "Co-contraction for joint stability" },
      { muscleSlug: "gastrocnemius", role: "stabilizer", notes: "Ankle strategy for balance" },
      { muscleSlug: "soleus", role: "stabilizer", notes: "Postural ankle stabilization" },
    ],
    functionalTaskSlugs: ["stair-climbing", "walking", "single-leg-balance"],
    cues: [
      { text: "Step-down: stand on a step, slowly lower the other foot to the ground — take 3-5 seconds", cueType: "verbal" },
      { text: "Keep your knee tracking over your 2nd toe — don't let it cave inward", cueType: "verbal" },
      { text: "Single-leg balance: stand on one foot for 30 seconds. If too easy, close your eyes or stand on foam", cueType: "verbal" },
    ],
    regressions: [
      { name: "Double-Leg Mini Squat", description: "Bilateral mini squats to build baseline quad strength before progressing to single-leg work." },
      { name: "Tandem Stance Balance", description: "Stand with one foot directly in front of the other (heel-to-toe). Builds balance before single-leg stance." },
    ],
    progressions: [
      { name: "Step-Down with Perturbation", description: "Have a partner apply gentle pushes during single-leg stance or step-down. Trains reactive stability." },
      { name: "Single-Leg Squat", description: "Full single-leg squat to chair depth. Advanced lower extremity control challenge." },
    ],
  },
  {
    slug: "posterior-chain-strengthening",
    name: "Hamstring and Calf Strengthening",
    description: "Posterior chain strengthening to balance knee joint forces and improve functional capacity. Includes prone hamstring curls, seated heel raises, and nordic hamstring eccentric exercises. Supports weight-bearing activities and stair negotiation.",
    confidence: 0.85,
    notes: "Evidence: posterior chain strengthening balances knee joint forces and improves functional capacity [VA 2020, Zeng 2022]. Supports weight-bearing activities and stair negotiation.",
    dosing: "3×10-12 reps; eccentric emphasis for tendinopathy (3-4 second lowering)",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "moderate",
    emgNotes: "Nordic hamstring exercise: highest hamstring activation among eccentric exercises; semitendinosus significantly higher [Sahinis 2025]",
    movementSlugs: ["knee-flexion", "ankle-plantarflexion"],
    muscleRoles: [
      { muscleSlug: "hamstrings", role: "primary", notes: "Knee flexion and co-contraction for joint stability" },
      { muscleSlug: "gastrocnemius", role: "primary", notes: "Plantarflexion and weak knee flexion" },
      { muscleSlug: "soleus", role: "primary", notes: "Plantarflexion for push-off in gait" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Hamstring curl: lie face down, bend your knee against resistance, then lower slowly", cueType: "verbal" },
      { text: "Heel raise: rise straight up on the balls of your feet, then lower over 3-4 seconds", cueType: "verbal" },
      { text: "Both directions matter — don't let gravity do the lowering for you", cueType: "verbal" },
    ],
    regressions: [
      { name: "Seated Hamstring Curl", description: "Use a seated hamstring curl machine or band. Less balance demand than prone." },
      { name: "Double-Leg Heel Raise", description: "Standing bilateral heel raises with wall support. Build calf endurance before progressing." },
    ],
    progressions: [
      { name: "Nordic Hamstring Curl", description: "Kneel with ankles anchored, slowly lower body forward using eccentric hamstring control. Gold standard for hamstring eccentric strength." },
      { name: "Single-Leg Heel Lower off Step", description: "Rise on two legs, lower on one leg off a step edge. Eccentric calf loading for Achilles and functional strength." },
    ],
  },
  // Ankle and Foot
  {
    slug: "ankle-dorsiflexion-plantarflexion-band",
    name: "Ankle Dorsiflexion/Plantarflexion (Resistance Band)",
    description: "Seated resisted ankle exercises. Dorsiflexion: band anchored forward, pull foot up. Plantarflexion: band around foot, push foot down. Restores ROM and strength after ankle injury. Limited dorsiflexion decreases ankle stability during landing and gait.",
    confidence: 0.85,
    notes: "Evidence: resisted dorsiflexion/plantarflexion restores ROM and strength after ankle injury [Wu 2025, AAFP 2025]. Limited dorsiflexion decreases ankle stability [Wu 2025].",
    dosing: "3×15 reps each direction, daily during acute recovery",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["ankle-dorsiflexion", "ankle-plantarflexion"],
    muscleRoles: [
      { muscleSlug: "tibialis-anterior", role: "primary", notes: "Dorsiflexion against band resistance" },
      { muscleSlug: "gastrocnemius", role: "primary", notes: "Plantarflexion against band resistance" },
      { muscleSlug: "soleus", role: "primary", notes: "Plantarflexion — especially when knee is bent" },
    ],
    functionalTaskSlugs: ["walking", "stair-climbing"],
    cues: [
      { text: "Dorsiflexion: anchor the band in front, pull your toes toward your shin against the resistance", cueType: "verbal" },
      { text: "Plantarflexion: loop band around the ball of your foot, push down like pressing a gas pedal", cueType: "verbal" },
      { text: "Control both directions — 2 seconds up, 3 seconds back", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active ROM (No Band)", description: "Pump the ankle up and down without resistance. Focus on full range of motion. Alphabet tracing with the foot is also effective." },
    ],
    progressions: [
      { name: "Heavier Band", description: "Progress to a thicker/stronger resistance band as strength improves." },
      { name: "Standing Heel Raise / Toe Raise", description: "Progress to standing exercises — weight-bearing dorsiflexion (toe raises) and plantarflexion (heel raises)." },
    ],
  },
  {
    slug: "ankle-eversion-inversion-strengthening",
    name: "Ankle Eversion/Inversion Strengthening",
    description: "Targeted strengthening of ankle evertors (peroneus longus) and invertors (tibialis anterior/posterior) with resistance band. Band is anchored laterally for eversion, medially for inversion. Prevents recurrent ankle sprains and chronic instability by targeting lateral ankle stabilizers.",
    confidence: 0.85,
    notes: "Evidence: strengthening evertors/invertors prevents recurrent ankle sprains and chronic instability [Wu 2025, AAFP 2025]. Targets lateral ankle stabilizers.",
    dosing: "3×15 reps each direction, progress resistance weekly",
    difficulty: "beginner",
    equipment: ["resistance-band"],
    bodyPosition: "seated",
    evidenceLevel: "moderate",
    movementSlugs: ["foot-eversion", "foot-inversion"],
    muscleRoles: [
      { muscleSlug: "peroneus-longus", role: "primary", notes: "Eversion — key lateral ankle stabilizer" },
      { muscleSlug: "tibialis-anterior", role: "primary", notes: "Inversion component" },
      { muscleSlug: "tibialis-posterior", role: "primary", notes: "Inversion and medial arch support" },
    ],
    functionalTaskSlugs: ["walking", "single-leg-balance"],
    cues: [
      { text: "Eversion: anchor band to the inside, turn the sole of your foot outward against resistance", cueType: "verbal" },
      { text: "Inversion: anchor band to the outside, turn the sole of your foot inward against resistance", cueType: "verbal" },
      { text: "Keep your leg still — isolate the motion to the ankle and foot", cueType: "verbal" },
    ],
    regressions: [
      { name: "Active Eversion/Inversion (No Band)", description: "Perform the motions without resistance, focusing on full range and motor control." },
    ],
    progressions: [
      { name: "Standing Single-Leg Balance on Foam", description: "Stand on one foot on a foam pad. Challenges dynamic eversion/inversion reactively." },
      { name: "Lateral Band Walks", description: "Walk sideways with a band around the ankles. Functional eversion/inversion with hip abduction." },
    ],
  },
  {
    slug: "single-leg-balance-star-excursion",
    name: "Single-Leg Balance Exercises (Star Excursion Balance Test)",
    description: "Balance exercises progressing from firm to unstable surfaces. Includes single-leg stance, star excursion balance test (reaching in 8 directions while standing on one leg), and eyes-closed balance. Enhances proprioception, ankle strength, and postural control. Long-term multifaceted exercise including proprioceptive training demonstrates superior rehabilitation efficacy for chronic ankle instability.",
    confidence: 0.85,
    notes: "Evidence: balance exercises on firm/unstable surfaces enhance proprioception and postural control [Wu 2025, Zhang 2025]. Multifaceted proprioceptive training shows superior efficacy for chronic ankle instability [Zhang 2025].",
    dosing: "3×30 seconds per leg; progress from firm → foam → eyes closed",
    difficulty: "intermediate",
    equipment: [],
    bodyPosition: "standing",
    evidenceLevel: "strong",
    emgNotes: "Multifaceted proprioceptive training shows superior efficacy for chronic ankle instability [Zhang 2025]",
    movementSlugs: ["ankle-dorsiflexion", "ankle-plantarflexion", "foot-inversion", "foot-eversion"],
    muscleRoles: [
      { muscleSlug: "peroneus-longus", role: "primary", notes: "Dynamic lateral stabilizer during single-leg stance" },
      { muscleSlug: "tibialis-anterior", role: "primary", notes: "Dorsiflexion control for balance" },
      { muscleSlug: "tibialis-posterior", role: "primary", notes: "Inversion control and arch support" },
      { muscleSlug: "gastrocnemius", role: "secondary", notes: "Plantarflexion strategy for balance" },
      { muscleSlug: "soleus", role: "secondary", notes: "Tonic postural stabilizer" },
      { muscleSlug: "gluteus-medius", role: "stabilizer", notes: "Pelvic stability during single-leg stance" },
    ],
    functionalTaskSlugs: ["single-leg-balance", "walking"],
    cues: [
      { text: "Stand on one foot, keep a slight bend in the knee — don't lock it out", cueType: "verbal" },
      { text: "For star excursion: reach the free leg as far as possible in each direction while staying balanced", cueType: "verbal" },
      { text: "Lightly tap the ground with your toe — don't put weight on it", cueType: "verbal" },
      { text: "Keep your hips level and torso upright throughout", cueType: "verbal" },
    ],
    regressions: [
      { name: "Tandem Stance", description: "Stand heel-to-toe, one foot in front of the other. Narrowed base of support without going to single leg." },
      { name: "Single-Leg with Fingertip Support", description: "Stand on one leg with fingertips on a wall or counter for light balance assist." },
    ],
    progressions: [
      { name: "Foam Pad Balance", description: "Stand on one foot on a foam pad or BOSU ball. Unstable surface increases proprioceptive demand." },
      { name: "Eyes-Closed Single-Leg Balance", description: "Remove visual input to further challenge proprioception and vestibular balance." },
      { name: "Star Excursion with Squat", description: "Add a single-leg squat depth during each reach direction. Combines strength with balance." },
    ],
  },
];

export async function seedExercises() {
  logSection("Exercises");

  const movementMap = new Map<string, string>();
  const movs = await prisma.movement.findMany({ select: { id: true, slug: true } });
  for (const m of movs) movementMap.set(m.slug, m.id);

  const muscleMap = new Map<string, string>();
  const muscs = await prisma.muscle.findMany({ select: { id: true, slug: true } });
  for (const m of muscs) muscleMap.set(m.slug, m.id);

  const taskMap = new Map<string, string>();
  const tsks = await prisma.functionalTask.findMany({ select: { id: true, slug: true } });
  for (const t of tsks) taskMap.set(t.slug, t.id);

  for (const ex of exercises) {
    const exercise = await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: {
        name: ex.name,
        description: ex.description,
        confidence: ex.confidence,
        notes: ex.notes,
        dosing: ex.dosing,
        emgNotes: ex.emgNotes,
        evidenceLevel: ex.evidenceLevel,
        difficulty: ex.difficulty,
        equipment: ex.equipment ?? [],
        bodyPosition: ex.bodyPosition,
      },
      create: {
        slug: ex.slug,
        name: ex.name,
        description: ex.description,
        status: "draft",
        confidence: ex.confidence,
        notes: ex.notes,
        dosing: ex.dosing,
        emgNotes: ex.emgNotes,
        evidenceLevel: ex.evidenceLevel,
        difficulty: ex.difficulty,
        equipment: ex.equipment ?? [],
        bodyPosition: ex.bodyPosition,
      },
    });

    // Movement links
    for (const ms of ex.movementSlugs) {
      const movementId = movementMap.get(ms);
      if (!movementId) throw new Error(`Movement not found: ${ms}`);
      await prisma.exerciseMovement.upsert({
        where: { exerciseId_movementId: { exerciseId: exercise.id, movementId } },
        update: {},
        create: { exerciseId: exercise.id, movementId },
      });
    }

    // Muscle roles
    for (const mr of ex.muscleRoles) {
      const muscleId = muscleMap.get(mr.muscleSlug);
      if (!muscleId) throw new Error(`Muscle not found: ${mr.muscleSlug}`);
      await prisma.exerciseMuscle.upsert({
        where: { exerciseId_muscleId: { exerciseId: exercise.id, muscleId } },
        update: { role: mr.role, notes: mr.notes },
        create: { exerciseId: exercise.id, muscleId, role: mr.role, notes: mr.notes },
      });
    }

    // Functional task links
    if (ex.functionalTaskSlugs) {
      for (const ts of ex.functionalTaskSlugs) {
        const functionalTaskId = taskMap.get(ts);
        if (!functionalTaskId) throw new Error(`Functional task not found: ${ts}`);
        await prisma.exerciseFunctionalTask.upsert({
          where: { exerciseId_functionalTaskId: { exerciseId: exercise.id, functionalTaskId } },
          update: {},
          create: { exerciseId: exercise.id, functionalTaskId },
        });
      }
    }

    // Cues
    await prisma.cue.deleteMany({ where: { exerciseId: exercise.id } });
    for (let i = 0; i < ex.cues.length; i++) {
      await prisma.cue.create({
        data: {
          text: ex.cues[i].text,
          cueType: ex.cues[i].cueType,
          order: i,
          exerciseId: exercise.id,
        },
      });
    }

    // Regressions
    await prisma.regression.deleteMany({ where: { exerciseId: exercise.id } });
    for (let i = 0; i < ex.regressions.length; i++) {
      await prisma.regression.create({
        data: {
          name: ex.regressions[i].name,
          description: ex.regressions[i].description,
          order: i,
          exerciseId: exercise.id,
        },
      });
    }

    // Progressions
    await prisma.progression.deleteMany({ where: { exerciseId: exercise.id } });
    for (let i = 0; i < ex.progressions.length; i++) {
      await prisma.progression.create({
        data: {
          name: ex.progressions[i].name,
          description: ex.progressions[i].description,
          order: i,
          exerciseId: exercise.id,
        },
      });
    }
  }

  logCount("exercises", exercises.length);
}
