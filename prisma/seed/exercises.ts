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
