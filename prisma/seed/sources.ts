import { prisma, logSection, logCount } from "./client";

export async function seedSources() {
  logSection("Research Sources");

  const sources = [
    {
      slug: "neumann-kinesiology-2017",
      title: "Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation",
      authors: "Neumann DA",
      year: 2017,
      sourceType: "textbook",
      description: "Comprehensive kinesiology textbook widely used in PT education. Covers detailed musculoskeletal anatomy and biomechanics.",
      confidence: 0.95,
    },
    {
      slug: "kendall-muscles-2005",
      title: "Muscles: Testing and Function with Posture and Pain",
      authors: "Kendall FP, McCreary EK, Provance PG, Rodgers MM, Romani WA",
      year: 2005,
      sourceType: "textbook",
      description: "Classic reference for manual muscle testing, muscle anatomy, and postural assessment.",
      confidence: 0.9,
    },
    {
      slug: "magee-orthopedic-2014",
      title: "Orthopedic Physical Assessment",
      authors: "Magee DJ",
      year: 2014,
      sourceType: "textbook",
      description: "Standard reference for orthopedic assessment techniques and clinical reasoning in PT.",
      confidence: 0.9,
    },
    {
      slug: "kisner-therapeutic-2017",
      title: "Therapeutic Exercise: Foundations and Techniques",
      authors: "Kisner C, Colby LA, Borstad J",
      year: 2017,
      sourceType: "textbook",
      description: "Foundational text on therapeutic exercise prescription, progressions, and clinical application.",
      confidence: 0.9,
    },
    {
      slug: "acsm-guidelines-2021",
      title: "ACSM's Guidelines for Exercise Testing and Prescription",
      authors: "American College of Sports Medicine",
      year: 2021,
      sourceType: "guideline",
      description: "Evidence-based guidelines for exercise prescription across healthy and clinical populations.",
      confidence: 0.9,
    },
    // ── Region-Based Exercise Evidence Sources ────────────────────────────
    // Cervical Spine
    {
      slug: "sun-cervicothoracic-2024",
      title: "Effects of Exercise Combined With Cervicothoracic Spine Self-Mobilization on Chronic Non-Specific Neck Pain",
      authors: "Sun X, Chai L, Huang Q, Zhou H, Liu H",
      year: 2024,
      journal: "Scientific Reports",
      sourceType: "journal",
      description: "RCT showing combined cervical and thoracic self-mobilization exercises improve chronic neck pain outcomes superior to cervical-only interventions.",
      confidence: 0.85,
    },
    {
      slug: "gross-neck-exercises-2015",
      title: "Exercises for Mechanical Neck Disorders",
      authors: "Gross A, Kay TM, Paquin JP, et al.",
      year: 2015,
      journal: "The Cochrane Database of Systematic Reviews",
      sourceType: "journal",
      description: "Cochrane systematic review of exercise interventions for mechanical neck disorders. Supports cervico-scapulothoracic strengthening.",
      confidence: 0.95,
    },
    {
      slug: "amiri-arimi-deep-flexors-2017",
      title: "The Effect of Different Exercise Programs on Size and Function of Deep Cervical Flexor Muscles in Patients With Chronic Nonspecific Neck Pain: A Systematic Review of Randomized Controlled Trials",
      authors: "Amiri Arimi S, Mohseni Bandpei MA, Javanshir K, Rezasoltani A, Biglarian A",
      year: 2017,
      journal: "American Journal of Physical Medicine & Rehabilitation",
      sourceType: "journal",
      description: "Systematic review of RCTs showing exercise programs improve deep cervical flexor size and function in chronic neck pain.",
      confidence: 0.9,
    },
    {
      slug: "moon-cervical-muscle-2021",
      title: "Effects of Exercise on Cervical Muscle Strength and Cross-Sectional Area in Patients With Thoracic Hyperkyphosis and Chronic Cervical Pain",
      authors: "Moon H, Lee SK, Kim WM, Seo YG",
      year: 2021,
      journal: "Scientific Reports",
      sourceType: "journal",
      description: "Exercise improves cervical muscle strength and cross-sectional area in patients with thoracic hyperkyphosis and chronic cervical pain.",
      confidence: 0.8,
    },
    {
      slug: "mueller-neck-dose-response-2023",
      title: "Resistance, Motor Control, and Mindfulness-Based Exercises Are Effective for Treating Chronic Nonspecific Neck Pain: A Systematic Review With Meta-Analysis and Dose-Response Meta-Regression",
      authors: "Mueller J, Weinig J, Niederer D, Tenberg S, Mueller S",
      year: 2023,
      journal: "The Journal of Orthopaedic and Sports Physical Therapy",
      sourceType: "journal",
      description: "Systematic review with dose-response meta-regression supporting 2-3 sessions/week for chronic neck pain. Supports resistance and motor control exercises.",
      confidence: 0.9,
    },
    // Thoracic Spine
    {
      slug: "cho-thoracic-vs-cervical-2017",
      title: "Upper Thoracic Spine Mobilization and Mobility Exercise Versus Upper Cervical Spine Mobilization and Stabilization Exercise in Individuals With Forward Head Posture: A Randomized Clinical Trial",
      authors: "Cho J, Lee E, Lee S",
      year: 2017,
      journal: "BMC Musculoskeletal Disorders",
      sourceType: "journal",
      description: "RCT showing thoracic mobilization is more effective than cervical-only intervention for forward head posture.",
      confidence: 0.85,
    },
    {
      slug: "ozdemir-schroth-2023",
      title: "A Randomized Controlled Study of the Effect of Functional Exercises on Postural Kyphosis: Schroth-Based Three-Dimensional Exercises Versus Postural Corrective Exercises",
      authors: "Özdemir Görgü S, Algun ZC",
      year: 2023,
      journal: "Disability and Rehabilitation",
      sourceType: "journal",
      description: "RCT demonstrating large effect sizes for Schroth exercises on kyphosis reduction (14.76° mean), lumbar lordosis, balance, and quality of life.",
      confidence: 0.85,
    },
    {
      slug: "feng-kyphosis-correction-2018",
      title: "The Effect of a Corrective Functional Exercise Program on Postural Thoracic Kyphosis in Teenagers: A Randomized Controlled Trial",
      authors: "Feng Q, Wang M, Zhang Y, Zhou Y",
      year: 2018,
      journal: "Clinical Rehabilitation",
      sourceType: "journal",
      description: "RCT showing corrective functional exercises reduce postural thoracic kyphosis in teenagers.",
      confidence: 0.8,
    },
    {
      slug: "csepregi-breathing-posture-2022",
      title: "Effects of Classical Breathing Exercises on Posture, Spinal and Chest Mobility Among Female University Students Compared to Currently Popular Training Programs",
      authors: "Csepregi É, Gyurcsik Z, Veres-Balajti I, et al.",
      year: 2022,
      journal: "International Journal of Environmental Research and Public Health",
      sourceType: "journal",
      description: "Breathing exercises improve chest expansion, spinal mobility (especially lateral flexion), and posture comparably to yoga and Pilates.",
      confidence: 0.8,
    },
    {
      slug: "eftekhari-breathing-kyphosis-2024",
      title: "Effects of Telerehabilitation-Based Respiratory and Corrective Exercises Among the Elderly With Thoracic Hyper-Kyphosis: A Clinical Trial",
      authors: "Eftekhari E, Sheikhhoseini R, Salahzadeh Z, Dadfar M",
      year: 2024,
      journal: "BMC Geriatrics",
      sourceType: "journal",
      description: "Telerehabilitation-based respiratory and corrective exercises improve thoracic kyphosis in elderly populations.",
      confidence: 0.8,
    },
    // Lumbar Spine and Core
    {
      slug: "calatayud-core-tolerability-2019",
      title: "Tolerability and Muscle Activity of Core Muscle Exercises in Chronic Low-Back Pain",
      authors: "Calatayud J, Escriche-Escuder A, Cruz-Montecinos C, et al.",
      year: 2019,
      journal: "International Journal of Environmental Research and Public Health",
      sourceType: "journal",
      description: "EMG study of core exercises in chronic LBP patients. Bird dog: 29% nEMG erector spinae. Curl-up: 48-50% nEMG rectus abdominis. All exercises well-tolerated.",
      confidence: 0.85,
    },
    {
      slug: "puntumetakul-core-adim-2021",
      title: "The Effects of Core Stabilization Exercise With the Abdominal Drawing-in Maneuver Technique Versus General Strengthening Exercise on Lumbar Segmental Motion in Patients With Clinical Lumbar Instability: A Randomized Controlled Trial With 12-Month Follow-Up",
      authors: "Puntumetakul R, Saiklang P, Tapanya W, et al.",
      year: 2021,
      journal: "International Journal of Environmental Research and Public Health",
      sourceType: "journal",
      description: "RCT with 12-month follow-up showing ADIM-based core stabilization reduces lumbar segmental translation more than general strengthening.",
      confidence: 0.85,
    },
    {
      slug: "guo-core-training-types-2025",
      title: "Effects of Different Types of Core Training on Pain and Functional Status in Patients With Chronic Nonspecific Low Back Pain: A Systematic Review and Meta-Analysis",
      authors: "Guo XB, Lan Q, Ding J, Tang L, Yang M",
      year: 2025,
      journal: "Frontiers in Physiology",
      sourceType: "journal",
      description: "Systematic review and meta-analysis comparing core training types for chronic nonspecific low back pain. Motor control exercises effective.",
      confidence: 0.85,
    },
    {
      slug: "kim-lumbar-stabilization-emg-2016",
      title: "Electromyographic Changes in Trunk Muscles During Graded Lumbar Stabilization Exercises",
      authors: "Kim CR, Park DK, Lee ST, Ryu JS",
      year: 2016,
      journal: "PM & R: The Journal of Injury, Function, and Rehabilitation",
      sourceType: "journal",
      description: "EMG analysis of trunk muscle activation during graded lumbar stabilization exercises including bird dog and dead bug progressions.",
      confidence: 0.8,
    },
    {
      slug: "fernandez-rodriguez-pilates-lbp-2022",
      title: "Best Exercise Options for Reducing Pain and Disability in Adults With Chronic Low Back Pain: Pilates, Strength, Core-Based, and Mind-Body. A Network Meta-Analysis",
      authors: "Fernández-Rodríguez R, Álvarez-Bueno C, Cavero-Redondo I, et al.",
      year: 2022,
      journal: "The Journal of Orthopaedic and Sports Physical Therapy",
      sourceType: "journal",
      description: "Network meta-analysis: Pilates has highest likelihood (93% for pain, 98% for disability) of reducing chronic low back pain.",
      confidence: 0.9,
    },
    // Shoulder Girdle
    {
      slug: "mendez-rebolledo-scapular-emg-2024",
      title: "Comparative Electromyographic Study of Scapular Stabilizing Muscles During Five Main Rehabilitation Exercises",
      authors: "Mendez-Rebolledo G, Araya-Quintanilla F, Guzmán-Muñoz E, et al.",
      year: 2024,
      journal: "American Journal of Physical Medicine & Rehabilitation",
      sourceType: "journal",
      description: "EMG study showing prone horizontal abduction with ER achieves optimal UT/MT (0.43) and UT/LT (0.30) activation ratios.",
      confidence: 0.85,
    },
    {
      slug: "andersen-scapular-intensity-2012",
      title: "Scapular Muscle Activity From Selected Strengthening Exercises Performed at Low and High Intensities",
      authors: "Andersen CH, Zebis MK, Saervoll C, et al.",
      year: 2012,
      journal: "Journal of Strength and Conditioning Research",
      sourceType: "journal",
      description: "Scapular muscle activation study at various intensities. Push-up plus activates serratus anterior highly with favorable LT/UT ratio.",
      confidence: 0.8,
    },
    {
      slug: "kibler-scapular-rehab-2008",
      title: "Electromyographic Analysis of Specific Exercises for Scapular Control in Early Phases of Shoulder Rehabilitation",
      authors: "Kibler WB, Sciascia AD, Uhl TL, Tambay N, Cunningham T",
      year: 2008,
      journal: "The American Journal of Sports Medicine",
      sourceType: "journal",
      description: "EMG analysis of exercises for early-phase scapular rehabilitation. Push-up plus addresses winging and promotes upward rotation.",
      confidence: 0.85,
    },
    {
      slug: "mulroy-shoulder-sci-2020",
      title: "A Primary Care Provider's Guide to Shoulder Pain After Spinal Cord Injury",
      authors: "Mulroy SJ, Hafdahl L, Dyson-Hudson T",
      year: 2020,
      journal: "Topics in Spinal Cord Injury Rehabilitation",
      sourceType: "guideline",
      description: "Clinical guideline on shoulder pain management. ER strengthening prevents superior humeral head migration and reduces impingement.",
      confidence: 0.85,
    },
    {
      slug: "escamilla-shoulder-rehab-2009",
      title: "Shoulder Muscle Activity and Function in Common Shoulder Rehabilitation Exercises",
      authors: "Escamilla RF, Yamashiro K, Paulos L, Andrews JR",
      year: 2009,
      journal: "Sports Medicine",
      sourceType: "journal",
      description: "Comprehensive review of shoulder muscle EMG during common rehabilitation exercises. Foundational reference for exercise selection.",
      confidence: 0.9,
    },
    // Hip and Pelvis
    {
      slug: "va-hip-knee-oa-2020",
      title: "The Non-Surgical Management of Hip & Knee Osteoarthritis (OA) (2020)",
      authors: "Matthew Bair MD MS, John Cody MD, Jess Edison MD, et al.",
      year: 2020,
      sourceType: "guideline",
      description: "VA clinical practice guideline for non-surgical management of hip and knee OA. Supports hip abductor/extensor and quadriceps strengthening.",
      confidence: 0.9,
    },
    {
      slug: "cibulka-hip-oa-cpg-2017",
      title: "Hip Pain and Mobility Deficits-Hip Osteoarthritis: Revision 2017",
      authors: "Cibulka MT, Bloom NJ, Enseki KR, et al.",
      year: 2017,
      journal: "The Journal of Orthopaedic and Sports Physical Therapy",
      sourceType: "guideline",
      description: "Clinical practice guideline for hip OA. Flexibility exercises and hip ROM improvement essential for function.",
      confidence: 0.9,
    },
    {
      slug: "moreside-hip-rom-2012",
      title: "Hip Joint Range of Motion Improvements Using Three Different Interventions",
      authors: "Moreside JM, McGill SM",
      year: 2012,
      journal: "Journal of Strength and Conditioning Research",
      sourceType: "journal",
      description: "Three interventions for hip ROM improvement. Limited hip mobility affects lumbar spine mechanics.",
      confidence: 0.8,
    },
    {
      slug: "hayashi-pstr-hip-2022",
      title: "Effects of Pericapsular Soft Tissue and Realignment Exercises for Patients With Osteoarthritis of the Hip and Harris Hip Score Below 60 Points",
      authors: "Hayashi K, Tsunoda T, Tobo Y, Ichikawa F, Shimose T",
      year: 2022,
      journal: "Current Medical Research and Opinion",
      sourceType: "journal",
      description: "PSTR exercises including pelvic tilts significantly improve pain (NRS) and function (Harris Hip Score) even in severe hip OA.",
      confidence: 0.8,
    },
    // Knee
    {
      slug: "sharma-knee-oa-2021",
      title: "Osteoarthritis of the Knee",
      authors: "Sharma L",
      year: 2021,
      journal: "The New England Journal of Medicine",
      sourceType: "journal",
      description: "Comprehensive NEJM review of knee OA. Quadriceps strengthening fundamental for management.",
      confidence: 0.95,
    },
    {
      slug: "zeng-exercise-knee-oa-2022",
      title: "Benefits and Mechanisms of Exercise Training for Knee Osteoarthritis",
      authors: "Zeng CY, Zhang ZR, Tang ZM, Hua FZ",
      year: 2022,
      journal: "Frontiers in Physiology",
      sourceType: "journal",
      description: "Review of benefits and mechanisms of exercise for knee OA. Supports combined quad and posterior chain strengthening.",
      confidence: 0.85,
    },
    {
      slug: "roos-neuromuscular-2025",
      title: "An Exercise Therapists' Guide to Neuromuscular Exercise for People With Knee or Hip Osteoarthritis",
      authors: "Roos EM, Kroman S, Ageberg E",
      year: 2025,
      journal: "The Journal of Orthopaedic and Sports Physical Therapy",
      sourceType: "journal",
      description: "Practical guide for neuromuscular exercise in knee/hip OA. Addresses proprioceptive deficits and ADL function.",
      confidence: 0.85,
    },
    // Ankle and Foot
    {
      slug: "wu-ankle-sprain-2025",
      title: "Management of Acute Ankle Sprains: Common Questions and Answers",
      authors: "Wu V, Padilla CA, Smith NA",
      year: 2025,
      journal: "American Family Physician",
      sourceType: "journal",
      description: "Clinical guidance on ankle sprain management including resisted exercises for restoring ROM and strength.",
      confidence: 0.85,
    },
    {
      slug: "aafp-ankle-recovery-2025",
      title: "Recovering From an Ankle Sprain",
      authors: "American Academy of Family Physicians",
      year: 2025,
      sourceType: "guideline",
      description: "AAFP patient guideline for ankle sprain recovery. Supports resisted dorsiflexion/plantarflexion and eversion/inversion strengthening.",
      confidence: 0.8,
    },
    {
      slug: "zhang-ankle-instability-2025",
      title: "Effectiveness of Exercise Therapy on Chronic Ankle Instability: A Meta-Analysis",
      authors: "Zhang C, Luo Z, Wu D, et al.",
      year: 2025,
      journal: "Scientific Reports",
      sourceType: "journal",
      description: "Meta-analysis showing long-term multifaceted exercise including proprioceptive training has superior efficacy for chronic ankle instability.",
      confidence: 0.85,
    },
    // Integration / Low Back Pain
    {
      slug: "liu-lbp-exercise-2025",
      title: "Effects of Different Exercise Interventions on Lower Back Pain: A Systematic Review and Meta-Analysis",
      authors: "Liu X, Gao W, Wu P, et al.",
      year: 2025,
      journal: "Frontiers in Physiology",
      sourceType: "journal",
      description: "Systematic review of exercise interventions for lower back pain. Supports pelvic tilts and multimodal approaches.",
      confidence: 0.85,
    },
  ];

  for (const s of sources) {
    await prisma.researchSource.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        authors: s.authors,
        year: s.year,
        sourceType: s.sourceType,
        description: s.description,
        confidence: s.confidence,
      },
      create: {
        slug: s.slug,
        title: s.title,
        authors: s.authors,
        year: s.year,
        sourceType: s.sourceType,
        description: s.description,
        status: "reviewed",
        confidence: s.confidence,
      },
    });
  }

  logCount("sources", sources.length);

  // Wire sources broadly to entities
  logSection("Source–Entity links");
  const neumannSource = await prisma.researchSource.findUnique({ where: { slug: "neumann-kinesiology-2017" } });
  const kendallSource = await prisma.researchSource.findUnique({ where: { slug: "kendall-muscles-2005" } });
  const kisnerSource = await prisma.researchSource.findUnique({ where: { slug: "kisner-therapeutic-2017" } });
  const mageeSource = await prisma.researchSource.findUnique({ where: { slug: "magee-orthopedic-2014" } });
  const acsmSource = await prisma.researchSource.findUnique({ where: { slug: "acsm-guidelines-2021" } });

  async function linkSource(sourceId: string, entityType: string, entityId: string, field: string, notes: string) {
    const existing = await prisma.sourceOnEntity.findFirst({
      where: { sourceId, [field]: entityId },
    });
    if (!existing) {
      await prisma.sourceOnEntity.create({
        data: { entityType, [field]: entityId, sourceId, notes },
      });
    }
  }

  let count = 0;

  if (neumannSource) {
    // Neumann covers all muscles, movements, and regions
    const allMuscles = await prisma.muscle.findMany();
    for (const m of allMuscles) { await linkSource(neumannSource.id, "Muscle", m.id, "muscleId", "Anatomy reference"); count++; }
    const allMovements = await prisma.movement.findMany();
    for (const m of allMovements) { await linkSource(neumannSource.id, "Movement", m.id, "movementId", "Biomechanics reference"); count++; }
    const allRegions = await prisma.region.findMany();
    for (const r of allRegions) { await linkSource(neumannSource.id, "Region", r.id, "regionId", "Regional anatomy reference"); count++; }
  }

  if (kendallSource) {
    // Kendall covers all muscles (testing reference)
    const allMuscles = await prisma.muscle.findMany();
    for (const m of allMuscles) { await linkSource(kendallSource.id, "Muscle", m.id, "muscleId", "Muscle testing reference"); count++; }
  }

  if (kisnerSource) {
    // Kisner covers all exercises
    const allExercises = await prisma.exercise.findMany();
    for (const e of allExercises) { await linkSource(kisnerSource.id, "Exercise", e.id, "exerciseId", "Exercise technique reference"); count++; }
  }

  if (mageeSource) {
    // Magee covers all joints
    const allJoints = await prisma.joint.findMany();
    for (const j of allJoints) { await linkSource(mageeSource.id, "Joint", j.id, "jointId", "Joint assessment reference"); count++; }
  }

  if (acsmSource) {
    // ACSM covers all exercises (prescription guidelines)
    const allExercises = await prisma.exercise.findMany();
    for (const e of allExercises) { await linkSource(acsmSource.id, "Exercise", e.id, "exerciseId", "Exercise prescription guidelines"); count++; }
  }

  logCount("source–entity links", count);

  // ── Targeted Evidence Links: Research Sources → Specific Exercises ──────
  logSection("Targeted evidence links");

  const exerciseSourceMap: Record<string, string[]> = {
    // Cervical Spine
    "deep-neck-flexor-training": [
      "sun-cervicothoracic-2024", "gross-neck-exercises-2015",
      "amiri-arimi-deep-flexors-2017", "moon-cervical-muscle-2021",
    ],
    "scapular-stability-rows": [
      "sun-cervicothoracic-2024", "gross-neck-exercises-2015",
      "mueller-neck-dose-response-2023", "cho-thoracic-vs-cervical-2017",
    ],
    "cervicothoracic-self-mobilization": [
      "sun-cervicothoracic-2024", "cho-thoracic-vs-cervical-2017",
    ],
    // Thoracic Spine
    "thoracic-extension-rotation-mobilization": [
      "cho-thoracic-vs-cervical-2017", "feng-kyphosis-correction-2018",
    ],
    "schroth-three-dimensional-exercises": [
      "ozdemir-schroth-2023",
    ],
    "diaphragmatic-breathing": [
      "csepregi-breathing-posture-2022", "eftekhari-breathing-kyphosis-2024",
    ],
    // Lumbar Spine and Core
    "core-stabilization-adim": [
      "calatayud-core-tolerability-2019", "puntumetakul-core-adim-2021",
      "guo-core-training-types-2025",
    ],
    "bird-dog": [
      "calatayud-core-tolerability-2019", "kim-lumbar-stabilization-emg-2016",
    ],
    "modified-curl-up-dead-bug": [
      "calatayud-core-tolerability-2019", "kim-lumbar-stabilization-emg-2016",
    ],
    // Shoulder Girdle
    "prone-horizontal-abduction-er": [
      "mendez-rebolledo-scapular-emg-2024", "andersen-scapular-intensity-2012",
    ],
    "push-up-plus": [
      "andersen-scapular-intensity-2012", "kibler-scapular-rehab-2008",
    ],
    "external-rotation-0-abduction": [
      "mulroy-shoulder-sci-2020", "escamilla-shoulder-rehab-2009",
    ],
    // Hip and Pelvis
    "hip-abduction-strengthening": [
      "va-hip-knee-oa-2020", "cibulka-hip-oa-cpg-2017",
    ],
    "hip-flexor-hamstring-stretch": [
      "cibulka-hip-oa-cpg-2017", "moreside-hip-rom-2012",
    ],
    "pelvic-tilt-realignment": [
      "hayashi-pstr-hip-2022", "liu-lbp-exercise-2025",
    ],
    // Knee
    "quad-strengthening-slr-tke": [
      "va-hip-knee-oa-2020", "sharma-knee-oa-2021", "zeng-exercise-knee-oa-2022",
    ],
    "neuromuscular-exercise-knee": [
      "sharma-knee-oa-2021", "zeng-exercise-knee-oa-2022", "roos-neuromuscular-2025",
    ],
    "posterior-chain-strengthening": [
      "va-hip-knee-oa-2020", "zeng-exercise-knee-oa-2022",
    ],
    // Ankle and Foot
    "ankle-dorsiflexion-plantarflexion-band": [
      "wu-ankle-sprain-2025", "aafp-ankle-recovery-2025",
    ],
    "ankle-eversion-inversion-strengthening": [
      "wu-ankle-sprain-2025", "aafp-ankle-recovery-2025",
    ],
    "single-leg-balance-star-excursion": [
      "wu-ankle-sprain-2025", "zhang-ankle-instability-2025",
    ],
    // Existing exercises that gain new evidence links
    "scapular-retraction-exercise": [
      "cho-thoracic-vs-cervical-2017", "mendez-rebolledo-scapular-emg-2024",
    ],
    "resisted-external-rotation": [
      "mulroy-shoulder-sci-2020", "escamilla-shoulder-rehab-2009",
    ],
    "clamshell": [
      "va-hip-knee-oa-2020", "cibulka-hip-oa-cpg-2017",
    ],
    "straight-leg-raise": [
      "va-hip-knee-oa-2020", "sharma-knee-oa-2021",
    ],
    "terminal-knee-extension": [
      "va-hip-knee-oa-2020", "sharma-knee-oa-2021",
    ],
    "heel-raise": [
      "wu-ankle-sprain-2025", "zeng-exercise-knee-oa-2022",
    ],
  };

  let targetedCount = 0;
  for (const [exerciseSlug, sourceSlugs] of Object.entries(exerciseSourceMap)) {
    const exercise = await prisma.exercise.findUnique({ where: { slug: exerciseSlug } });
    if (!exercise) {
      console.warn(`    ⚠ Exercise not found: ${exerciseSlug}`);
      continue;
    }
    for (const sourceSlug of sourceSlugs) {
      const source = await prisma.researchSource.findUnique({ where: { slug: sourceSlug } });
      if (!source) {
        console.warn(`    ⚠ Source not found: ${sourceSlug}`);
        continue;
      }
      await linkSource(source.id, "Exercise", exercise.id, "exerciseId", "Region-specific evidence");
      targetedCount++;
    }
  }

  logCount("targeted evidence links", targetedCount);
}
