import { prisma, logSection, logCount } from "./client";
import { MuscleRole } from "@prisma/client";

interface ExerciseDef {
  slug: string;
  name: string;
  description: string;
  confidence: number;
  notes?: string;
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
    movementSlugs: ["hip-extension"],
    muscleRoles: [
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "secondary" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
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
    confidence: 0.85,
    movementSlugs: ["hip-external-rotation", "hip-abduction"],
    muscleRoles: [
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Posterior fibers" },
      { muscleSlug: "piriformis", role: "secondary" },
      { muscleSlug: "gluteus-maximus", role: "synergist" },
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
    confidence: 0.9,
    movementSlugs: ["hip-flexion", "hip-extension", "knee-flexion", "knee-extension", "ankle-dorsiflexion"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary" },
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "secondary" },
      { muscleSlug: "adductor-group", role: "secondary" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
      { muscleSlug: "gastrocnemius", role: "stabilizer" },
      { muscleSlug: "soleus", role: "stabilizer" },
    ],
    functionalTaskSlugs: ["squat-to-stand", "stair-climbing", "pushing-up-from-chair"],
    cues: [
      { text: "Sit back like you're reaching for a chair behind you", cueType: "verbal" },
      { text: "Keep your chest up and weight through your heels", cueType: "verbal" },
      { text: "Push your knees out over your toes — don't let them cave inward", cueType: "verbal" },
    ],
    regressions: [
      { name: "Chair Squat", description: "Squat down to a chair and use it as a depth target. Reduces fear of falling and limits range." },
      { name: "Counter-Supported Squat", description: "Hold onto a counter or sturdy surface for balance while squatting." },
    ],
    progressions: [
      { name: "Goblet Squat", description: "Hold a weight at chest level to add resistance and encourage upright posture." },
      { name: "Jump Squat", description: "Add an explosive jump at the top of the squat. For advanced patients with no joint restrictions." },
    ],
  },
  {
    slug: "sit-to-stand",
    name: "Sit-to-Stand",
    description: "Functional transfer exercise. Patient rises from a seated position without using arms, emphasizing lower extremity strength and weight shift.",
    confidence: 0.9,
    movementSlugs: ["hip-extension", "knee-extension"],
    muscleRoles: [
      { muscleSlug: "quadriceps", role: "primary" },
      { muscleSlug: "gluteus-maximus", role: "primary" },
      { muscleSlug: "hamstrings", role: "secondary" },
      { muscleSlug: "erector-spinae", role: "stabilizer" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
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
    movementSlugs: ["ankle-plantarflexion"],
    muscleRoles: [
      { muscleSlug: "gastrocnemius", role: "primary" },
      { muscleSlug: "soleus", role: "primary" },
      { muscleSlug: "tibialis-posterior", role: "synergist" },
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
    confidence: 0.85,
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
    confidence: 0.8,
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
    confidence: 0.8,
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
    confidence: 0.85,
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
    confidence: 0.85,
    movementSlugs: ["hip-flexion", "knee-extension"],
    muscleRoles: [
      { muscleSlug: "iliopsoas", role: "primary" },
      { muscleSlug: "rectus-femoris", role: "primary" },
      { muscleSlug: "quadriceps", role: "stabilizer", notes: "Keeps knee extended" },
      { muscleSlug: "transversus-abdominis", role: "stabilizer" },
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
    confidence: 0.85,
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
    confidence: 0.85,
    movementSlugs: ["shoulder-flexion", "shoulder-abduction", "elbow-extension"],
    muscleRoles: [
      { muscleSlug: "anterior-deltoid", role: "primary" },
      { muscleSlug: "middle-deltoid", role: "primary" },
      { muscleSlug: "supraspinatus", role: "synergist", notes: "Initiates abduction" },
      { muscleSlug: "triceps-brachii", role: "secondary" },
      { muscleSlug: "trapezius-upper", role: "stabilizer", notes: "Scapular upward rotation" },
      { muscleSlug: "serratus-anterior", role: "stabilizer", notes: "Scapular stability" },
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
    movementSlugs: ["shoulder-internal-rotation"],
    muscleRoles: [
      { muscleSlug: "subscapularis", role: "primary" },
      { muscleSlug: "pectoralis-major", role: "secondary", notes: "Sternal head assists" },
      { muscleSlug: "latissimus-dorsi", role: "secondary" },
      { muscleSlug: "anterior-deltoid", role: "synergist" },
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
    movementSlugs: ["shoulder-adduction", "shoulder-flexion", "elbow-extension", "scapular-protraction"],
    muscleRoles: [
      { muscleSlug: "pectoralis-major", role: "primary" },
      { muscleSlug: "anterior-deltoid", role: "secondary" },
      { muscleSlug: "triceps-brachii", role: "secondary" },
      { muscleSlug: "serratus-anterior", role: "stabilizer", notes: "Scapular protraction at end range" },
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
    movementSlugs: ["elbow-flexion", "forearm-supination"],
    muscleRoles: [
      { muscleSlug: "biceps-brachii", role: "primary" },
      { muscleSlug: "brachialis", role: "primary" },
      { muscleSlug: "supinator", role: "synergist", notes: "Maintains supination" },
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
    confidence: 0.85,
    movementSlugs: ["elbow-extension", "shoulder-extension"],
    muscleRoles: [
      { muscleSlug: "triceps-brachii", role: "primary" },
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
    confidence: 0.8,
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
    confidence: 0.75,
    movementSlugs: ["radial-deviation", "ulnar-deviation"],
    muscleRoles: [
      { muscleSlug: "flexor-carpi-radialis", role: "primary", notes: "Radial deviation" },
      { muscleSlug: "extensor-carpi-radialis-longus", role: "primary", notes: "Radial deviation" },
      { muscleSlug: "flexor-carpi-ulnaris", role: "primary", notes: "Ulnar deviation" },
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
    movementSlugs: ["finger-flexion", "finger-extension"],
    muscleRoles: [
      { muscleSlug: "flexor-digitorum-superficialis", role: "primary" },
      { muscleSlug: "extensor-digitorum", role: "secondary", notes: "Active release phase" },
      { muscleSlug: "opponens-pollicis", role: "synergist", notes: "Thumb positioning" },
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
    confidence: 0.8,
    movementSlugs: ["thumb-opposition"],
    muscleRoles: [
      { muscleSlug: "opponens-pollicis", role: "primary" },
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
    confidence: 0.8,
    movementSlugs: ["hip-adduction"],
    muscleRoles: [
      { muscleSlug: "adductor-group", role: "primary" },
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
    confidence: 0.75,
    notes: "Hip internal rotation is commonly limited. Assessment of ROM should precede strengthening.",
    movementSlugs: ["hip-internal-rotation"],
    muscleRoles: [
      { muscleSlug: "gluteus-medius", role: "primary", notes: "Anterior fibers" },
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
      },
      create: {
        slug: ex.slug,
        name: ex.name,
        description: ex.description,
        status: "draft",
        confidence: ex.confidence,
        notes: ex.notes,
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
