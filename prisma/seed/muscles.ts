import { prisma, logSection, logCount } from "./client";
import { MuscleRole } from "@prisma/client";

interface MuscleDef {
  slug: string;
  name: string;
  description: string;
  origin: string;
  insertion: string;
  action: string;
  innervation: string;
  bloodSupply: string;
  confidence: number;
  notes?: string;
}

interface MovementMuscleDef {
  movementSlug: string;
  muscleSlug: string;
  role: MuscleRole;
  notes?: string;
}

// ─── Muscle Definitions ──────────────────────────────────────────────────────

const muscles: MuscleDef[] = [
  // ── Shoulder / Rotator Cuff ─────────────────────────────────────────────
  {
    slug: "infraspinatus",
    name: "Infraspinatus",
    description: "Rotator cuff muscle on the posterior scapula. Primary external rotator of the shoulder.",
    origin: "Infraspinous fossa of scapula",
    insertion: "Middle facet of greater tubercle of humerus",
    action: "External rotation of shoulder; stabilizes humeral head in glenoid",
    innervation: "Suprascapular nerve (C5, C6)",
    bloodSupply: "Suprascapular artery, circumflex scapular artery",
    confidence: 0.9,
  },
  {
    slug: "supraspinatus",
    name: "Supraspinatus",
    description: "Rotator cuff muscle superior to the spine of the scapula. Initiates shoulder abduction.",
    origin: "Supraspinous fossa of scapula",
    insertion: "Superior facet of greater tubercle of humerus",
    action: "Initiates abduction of shoulder (first 15°); stabilizes humeral head",
    innervation: "Suprascapular nerve (C5, C6)",
    bloodSupply: "Suprascapular artery",
    confidence: 0.9,
  },
  {
    slug: "subscapularis",
    name: "Subscapularis",
    description: "Rotator cuff muscle on the anterior surface of the scapula. Primary internal rotator.",
    origin: "Subscapular fossa of scapula",
    insertion: "Lesser tubercle of humerus",
    action: "Internal rotation of shoulder; stabilizes humeral head",
    innervation: "Upper and lower subscapular nerves (C5, C6, C7)",
    bloodSupply: "Subscapular artery, lateral thoracic artery",
    confidence: 0.9,
  },
  {
    slug: "teres-minor",
    name: "Teres Minor",
    description: "Rotator cuff muscle on the lateral border of the scapula. Assists external rotation.",
    origin: "Upper two-thirds of lateral border of scapula",
    insertion: "Inferior facet of greater tubercle of humerus",
    action: "External rotation of shoulder; weak adduction",
    innervation: "Axillary nerve (C5, C6)",
    bloodSupply: "Circumflex scapular artery, posterior circumflex humeral artery",
    confidence: 0.9,
  },
  // ── Deltoid ─────────────────────────────────────────────────────────────
  {
    slug: "anterior-deltoid",
    name: "Anterior Deltoid",
    description: "Anterior fibers of the deltoid muscle. Primary shoulder flexor and assists with internal rotation.",
    origin: "Lateral third of clavicle",
    insertion: "Deltoid tuberosity of humerus",
    action: "Shoulder flexion, horizontal adduction, internal rotation",
    innervation: "Axillary nerve (C5, C6)",
    bloodSupply: "Thoracoacromial artery (deltoid branch), posterior circumflex humeral artery",
    confidence: 0.85,
  },
  {
    slug: "middle-deltoid",
    name: "Middle Deltoid",
    description: "Middle fibers of the deltoid. Primary shoulder abductor after supraspinatus initiates.",
    origin: "Acromion of scapula",
    insertion: "Deltoid tuberosity of humerus",
    action: "Shoulder abduction (primary mover after 15°)",
    innervation: "Axillary nerve (C5, C6)",
    bloodSupply: "Thoracoacromial artery (deltoid branch), posterior circumflex humeral artery",
    confidence: 0.85,
  },
  {
    slug: "posterior-deltoid",
    name: "Posterior Deltoid",
    description: "Posterior fibers of the deltoid. Shoulder extender and horizontal abductor.",
    origin: "Spine of scapula",
    insertion: "Deltoid tuberosity of humerus",
    action: "Shoulder extension, horizontal abduction, external rotation",
    innervation: "Axillary nerve (C5, C6)",
    bloodSupply: "Posterior circumflex humeral artery",
    confidence: 0.85,
  },
  // ── Scapular Stabilizers ────────────────────────────────────────────────
  {
    slug: "trapezius-upper",
    name: "Upper Trapezius",
    description: "Upper fibers of the trapezius. Elevates and upwardly rotates the scapula.",
    origin: "External occipital protuberance, nuchal ligament, spinous processes C1-C7",
    insertion: "Lateral third of clavicle, acromion",
    action: "Scapular elevation, upward rotation, retraction",
    innervation: "Spinal accessory nerve (CN XI), C3-C4",
    bloodSupply: "Transverse cervical artery",
    confidence: 0.85,
  },
  {
    slug: "trapezius-middle",
    name: "Middle Trapezius",
    description: "Middle fibers of the trapezius. Primary scapular retractor.",
    origin: "Spinous processes T1-T5",
    insertion: "Medial acromion, superior spine of scapula",
    action: "Scapular retraction (adduction)",
    innervation: "Spinal accessory nerve (CN XI), C3-C4",
    bloodSupply: "Transverse cervical artery",
    confidence: 0.85,
  },
  {
    slug: "serratus-anterior",
    name: "Serratus Anterior",
    description: "Fan-shaped muscle on the lateral thorax. Protracts and upwardly rotates the scapula.",
    origin: "Lateral surfaces of ribs 1-9",
    insertion: "Medial border of scapula (costal surface)",
    action: "Scapular protraction, upward rotation; holds scapula against thorax",
    innervation: "Long thoracic nerve (C5, C6, C7)",
    bloodSupply: "Lateral thoracic artery, thoracodorsal artery",
    confidence: 0.9,
  },
  {
    slug: "rhomboid-major",
    name: "Rhomboid Major",
    description: "Deep to the trapezius. Retracts and downwardly rotates the scapula.",
    origin: "Spinous processes T2-T5",
    insertion: "Medial border of scapula (below spine of scapula)",
    action: "Scapular retraction, downward rotation, elevation",
    innervation: "Dorsal scapular nerve (C4, C5)",
    bloodSupply: "Dorsal scapular artery",
    confidence: 0.85,
  },
  // ── Latissimus & Pectoralis ─────────────────────────────────────────────
  {
    slug: "latissimus-dorsi",
    name: "Latissimus Dorsi",
    description: "Broad muscle of the back. Powerful extender, adductor, and internal rotator of the shoulder.",
    origin: "Spinous processes T7-L5, thoracolumbar fascia, iliac crest, lower 3-4 ribs",
    insertion: "Floor of intertubercular (bicipital) groove of humerus",
    action: "Shoulder extension, adduction, internal rotation",
    innervation: "Thoracodorsal nerve (C6, C7, C8)",
    bloodSupply: "Thoracodorsal artery",
    confidence: 0.9,
  },
  {
    slug: "pectoralis-major",
    name: "Pectoralis Major",
    description: "Large chest muscle. Flexes, adducts, and internally rotates the shoulder.",
    origin: "Clavicle (clavicular head), sternum and costal cartilages 1-6 (sternal head)",
    insertion: "Lateral lip of intertubercular groove of humerus",
    action: "Shoulder flexion (clavicular head), adduction, internal rotation, horizontal adduction",
    innervation: "Medial and lateral pectoral nerves (C5-T1)",
    bloodSupply: "Pectoral branch of thoracoacromial artery, internal thoracic artery",
    confidence: 0.9,
  },
  // ── Elbow / Forearm ─────────────────────────────────────────────────────
  {
    slug: "biceps-brachii",
    name: "Biceps Brachii",
    description: "Two-headed muscle of the anterior arm. Flexes elbow and supinates forearm.",
    origin: "Long head: supraglenoid tubercle; Short head: coracoid process of scapula",
    insertion: "Radial tuberosity, bicipital aponeurosis",
    action: "Elbow flexion, forearm supination, weak shoulder flexion",
    innervation: "Musculocutaneous nerve (C5, C6)",
    bloodSupply: "Brachial artery",
    confidence: 0.9,
  },
  {
    slug: "triceps-brachii",
    name: "Triceps Brachii",
    description: "Three-headed muscle of the posterior arm. Primary elbow extensor.",
    origin: "Long head: infraglenoid tubercle; Lateral head: posterior humerus (above radial groove); Medial head: posterior humerus (below radial groove)",
    insertion: "Olecranon process of ulna",
    action: "Elbow extension; long head assists shoulder extension",
    innervation: "Radial nerve (C6, C7, C8)",
    bloodSupply: "Deep brachial artery, posterior circumflex humeral artery",
    confidence: 0.9,
  },
  {
    slug: "brachialis",
    name: "Brachialis",
    description: "Deep to biceps brachii. Primary elbow flexor regardless of forearm position.",
    origin: "Distal half of anterior humerus",
    insertion: "Coronoid process and tuberosity of ulna",
    action: "Elbow flexion (primary mover)",
    innervation: "Musculocutaneous nerve (C5, C6), radial nerve (small contribution)",
    bloodSupply: "Brachial artery, radial recurrent artery",
    confidence: 0.9,
  },
  {
    slug: "pronator-teres",
    name: "Pronator Teres",
    description: "Superficial forearm muscle. Pronates the forearm and assists elbow flexion.",
    origin: "Medial epicondyle of humerus (humeral head), coronoid process of ulna (ulnar head)",
    insertion: "Middle of lateral surface of radius",
    action: "Forearm pronation, weak elbow flexion",
    innervation: "Median nerve (C6, C7)",
    bloodSupply: "Ulnar artery, anterior ulnar recurrent artery",
    confidence: 0.85,
  },
  {
    slug: "supinator",
    name: "Supinator",
    description: "Deep forearm muscle. Supinates the forearm, especially during slow movements.",
    origin: "Lateral epicondyle of humerus, supinator crest of ulna",
    insertion: "Lateral surface of proximal radius",
    action: "Forearm supination",
    innervation: "Deep branch of radial nerve (C5, C6)",
    bloodSupply: "Radial recurrent artery",
    confidence: 0.85,
  },
  // ── Wrist / Hand ────────────────────────────────────────────────────────
  {
    slug: "flexor-carpi-radialis",
    name: "Flexor Carpi Radialis",
    description: "Superficial forearm flexor. Flexes and radially deviates the wrist.",
    origin: "Medial epicondyle of humerus (common flexor origin)",
    insertion: "Base of 2nd and 3rd metacarpals",
    action: "Wrist flexion, radial deviation",
    innervation: "Median nerve (C6, C7)",
    bloodSupply: "Radial artery",
    confidence: 0.85,
  },
  {
    slug: "flexor-carpi-ulnaris",
    name: "Flexor Carpi Ulnaris",
    description: "Medial superficial forearm flexor. Flexes and ulnarly deviates the wrist.",
    origin: "Medial epicondyle (humeral head), olecranon and posterior ulna (ulnar head)",
    insertion: "Pisiform, hook of hamate, base of 5th metacarpal",
    action: "Wrist flexion, ulnar deviation",
    innervation: "Ulnar nerve (C7, C8)",
    bloodSupply: "Ulnar artery",
    confidence: 0.85,
  },
  {
    slug: "extensor-carpi-radialis-longus",
    name: "Extensor Carpi Radialis Longus",
    description: "Lateral forearm extensor. Extends and radially deviates the wrist.",
    origin: "Lateral supracondylar ridge of humerus",
    insertion: "Base of 2nd metacarpal",
    action: "Wrist extension, radial deviation",
    innervation: "Radial nerve (C6, C7)",
    bloodSupply: "Radial artery",
    confidence: 0.85,
  },
  {
    slug: "extensor-digitorum",
    name: "Extensor Digitorum",
    description: "Common finger extensor. Extends the MCP joints of fingers 2-5.",
    origin: "Lateral epicondyle of humerus (common extensor origin)",
    insertion: "Extensor expansions of fingers 2-5",
    action: "Extension of MCP joints of fingers 2-5; assists wrist extension",
    innervation: "Posterior interosseous nerve (C7, C8)",
    bloodSupply: "Posterior interosseous artery",
    confidence: 0.85,
  },
  {
    slug: "flexor-digitorum-superficialis",
    name: "Flexor Digitorum Superficialis",
    description: "Intermediate forearm flexor. Flexes the PIP joints of fingers 2-5.",
    origin: "Medial epicondyle, coronoid process, anterior radius",
    insertion: "Middle phalanges of fingers 2-5",
    action: "Flexion of PIP joints, assists MCP and wrist flexion",
    innervation: "Median nerve (C7, C8, T1)",
    bloodSupply: "Ulnar artery, radial artery",
    confidence: 0.85,
  },
  {
    slug: "opponens-pollicis",
    name: "Opponens Pollicis",
    description: "Thenar muscle deep to abductor pollicis brevis. Opposes the thumb.",
    origin: "Flexor retinaculum, trapezium",
    insertion: "Lateral border of 1st metacarpal",
    action: "Opposition of thumb (flexion + medial rotation of 1st metacarpal)",
    innervation: "Median nerve (recurrent branch, C8, T1)",
    bloodSupply: "Superficial palmar branch of radial artery",
    confidence: 0.8,
  },
  // ── Hip ─────────────────────────────────────────────────────────────────
  {
    slug: "gluteus-maximus",
    name: "Gluteus Maximus",
    description: "Largest and most superficial gluteal muscle. Powerful hip extensor.",
    origin: "Posterior ilium, sacrum, coccyx, sacrotuberous ligament",
    insertion: "Iliotibial tract, gluteal tuberosity of femur",
    action: "Hip extension (especially from flexed position), external rotation, upper fibers assist abduction",
    innervation: "Inferior gluteal nerve (L5, S1, S2)",
    bloodSupply: "Superior and inferior gluteal arteries",
    confidence: 0.9,
  },
  {
    slug: "gluteus-medius",
    name: "Gluteus Medius",
    description: "Fan-shaped muscle on the lateral pelvis. Primary hip abductor and pelvic stabilizer.",
    origin: "External surface of ilium between anterior and posterior gluteal lines",
    insertion: "Lateral surface of greater trochanter of femur",
    action: "Hip abduction (primary), internal rotation (anterior fibers), external rotation (posterior fibers), pelvic stabilization in single-leg stance",
    innervation: "Superior gluteal nerve (L4, L5, S1)",
    bloodSupply: "Superior gluteal artery",
    confidence: 0.9,
  },
  {
    slug: "iliopsoas",
    name: "Iliopsoas",
    description: "Combined iliacus and psoas major. Primary hip flexor and most powerful flexor of the hip.",
    origin: "Iliacus: iliac fossa; Psoas major: T12-L5 vertebral bodies and transverse processes",
    insertion: "Lesser trochanter of femur",
    action: "Hip flexion (primary mover), assists lateral rotation and trunk flexion",
    innervation: "Femoral nerve (L1-L4) for iliacus; ventral rami L1-L3 for psoas",
    bloodSupply: "Iliolumbar artery, medial circumflex femoral artery",
    confidence: 0.9,
  },
  {
    slug: "adductor-group",
    name: "Adductor Group (Longus/Brevis/Magnus)",
    description: "Medial thigh muscles. Primary hip adductors. Magnus also assists extension.",
    origin: "Pubic bone (various surfaces for each muscle)",
    insertion: "Linea aspera of femur (longus/brevis); linea aspera and adductor tubercle (magnus)",
    action: "Hip adduction; magnus also assists hip extension and flexion depending on fiber direction",
    innervation: "Obturator nerve (L2-L4); hamstring portion of magnus: tibial nerve (L4)",
    bloodSupply: "Deep femoral artery (profunda femoris), obturator artery",
    confidence: 0.8,
    notes: "Grouped for simplicity. In a detailed model, these would be separate entries.",
  },
  {
    slug: "piriformis",
    name: "Piriformis",
    description: "Deep external rotator of the hip. Clinically important due to its relationship with the sciatic nerve.",
    origin: "Anterior surface of sacrum (S2-S4)",
    insertion: "Superior border of greater trochanter of femur",
    action: "External rotation of hip, abduction when hip is flexed",
    innervation: "Nerve to piriformis (S1, S2)",
    bloodSupply: "Superior and inferior gluteal arteries, internal pudendal artery",
    confidence: 0.85,
  },
  // ── Knee ────────────────────────────────────────────────────────────────
  {
    slug: "quadriceps",
    name: "Quadriceps Femoris",
    description: "Four-headed anterior thigh muscle group (rectus femoris, vastus lateralis, vastus medialis, vastus intermedius). Primary knee extensor.",
    origin: "Rectus femoris: AIIS and ilium; Vasti: various surfaces of femoral shaft",
    insertion: "Tibial tuberosity via patellar tendon",
    action: "Knee extension; rectus femoris also assists hip flexion",
    innervation: "Femoral nerve (L2, L3, L4)",
    bloodSupply: "Femoral artery, lateral circumflex femoral artery",
    confidence: 0.9,
  },
  {
    slug: "hamstrings",
    name: "Hamstrings (Biceps Femoris, Semimembranosus, Semitendinosus)",
    description: "Posterior thigh muscle group. Primary knee flexors and hip extensors.",
    origin: "Ischial tuberosity (long heads); biceps short head: linea aspera of femur",
    insertion: "Biceps: head of fibula; Semimembranosus: medial tibial condyle; Semitendinosus: pes anserinus",
    action: "Knee flexion, hip extension; medial hamstrings assist internal rotation of knee; biceps assists external rotation",
    innervation: "Tibial nerve (L5, S1, S2) for semis; common peroneal nerve for biceps short head",
    bloodSupply: "Perforating branches of deep femoral artery, inferior gluteal artery",
    confidence: 0.9,
  },
  // ── Ankle / Lower Leg ──────────────────────────────────────────────────
  {
    slug: "gastrocnemius",
    name: "Gastrocnemius",
    description: "Superficial posterior calf muscle. Powerful plantarflexor and weak knee flexor.",
    origin: "Medial head: medial femoral condyle; Lateral head: lateral femoral condyle",
    insertion: "Calcaneus via calcaneal (Achilles) tendon",
    action: "Ankle plantarflexion, assists knee flexion",
    innervation: "Tibial nerve (S1, S2)",
    bloodSupply: "Sural arteries (branches of popliteal artery)",
    confidence: 0.9,
  },
  {
    slug: "soleus",
    name: "Soleus",
    description: "Deep to gastrocnemius. Tonic plantarflexor active during standing and walking.",
    origin: "Posterior surface of fibular head, proximal tibia (soleal line)",
    insertion: "Calcaneus via calcaneal (Achilles) tendon",
    action: "Ankle plantarflexion (especially during slow/postural activities)",
    innervation: "Tibial nerve (S1, S2)",
    bloodSupply: "Posterior tibial artery, peroneal artery",
    confidence: 0.9,
  },
  {
    slug: "tibialis-anterior",
    name: "Tibialis Anterior",
    description: "Anterior compartment of the leg. Primary dorsiflexor and foot invertor.",
    origin: "Lateral tibial condyle, upper two-thirds of lateral tibial surface, interosseous membrane",
    insertion: "Medial cuneiform and base of 1st metatarsal",
    action: "Ankle dorsiflexion, foot inversion",
    innervation: "Deep peroneal nerve (L4, L5)",
    bloodSupply: "Anterior tibial artery",
    confidence: 0.9,
  },
  {
    slug: "tibialis-posterior",
    name: "Tibialis Posterior",
    description: "Deepest posterior compartment muscle. Primary invertor and supports the medial arch.",
    origin: "Posterior tibia, fibula, and interosseous membrane",
    insertion: "Navicular tuberosity and plantar surfaces of cuneiforms and metatarsals 2-4",
    action: "Foot inversion, assists plantarflexion, supports medial longitudinal arch",
    innervation: "Tibial nerve (L4, L5)",
    bloodSupply: "Posterior tibial artery, peroneal artery",
    confidence: 0.85,
  },
  {
    slug: "peroneus-longus",
    name: "Peroneus Longus (Fibularis Longus)",
    description: "Lateral compartment of the leg. Everts the foot and assists plantarflexion.",
    origin: "Head and upper two-thirds of lateral fibula",
    insertion: "Base of 1st metatarsal and medial cuneiform (plantar surface)",
    action: "Foot eversion, assists plantarflexion, supports transverse arch",
    innervation: "Superficial peroneal nerve (L5, S1)",
    bloodSupply: "Peroneal artery",
    confidence: 0.85,
  },
  // ── Core / Trunk (used as stabilizers) ──────────────────────────────────
  {
    slug: "erector-spinae",
    name: "Erector Spinae Group",
    description: "Group of muscles (iliocostalis, longissimus, spinalis) running along the vertebral column. Primary trunk extensors.",
    origin: "Sacrum, iliac crest, spinous and transverse processes of vertebrae",
    insertion: "Ribs, transverse and spinous processes of vertebrae, mastoid process",
    action: "Bilateral: trunk extension, maintains upright posture; Unilateral: lateral flexion",
    innervation: "Posterior rami of spinal nerves",
    bloodSupply: "Posterior intercostal arteries, lumbar arteries",
    confidence: 0.85,
  },
  {
    slug: "transversus-abdominis",
    name: "Transversus Abdominis",
    description: "Deepest abdominal muscle. Provides core stability through intra-abdominal pressure.",
    origin: "Iliac crest, inguinal ligament, thoracolumbar fascia, costal cartilages 7-12",
    insertion: "Linea alba, pubic crest",
    action: "Core stabilization, increases intra-abdominal pressure, compresses abdominal contents",
    innervation: "Intercostal nerves (T7-T12), iliohypogastric and ilioinguinal nerves (L1)",
    bloodSupply: "Posterior intercostal, subcostal, and lumbar arteries",
    confidence: 0.85,
  },
  {
    slug: "rectus-femoris",
    name: "Rectus Femoris",
    description: "Two-joint quadriceps muscle. Only quad that crosses the hip — assists hip flexion in addition to knee extension.",
    origin: "Anterior inferior iliac spine (AIIS) and superior acetabular rim",
    insertion: "Tibial tuberosity via patellar tendon",
    action: "Knee extension, hip flexion",
    innervation: "Femoral nerve (L2, L3, L4)",
    bloodSupply: "Lateral circumflex femoral artery",
    confidence: 0.9,
  },
];

// ─── Movement–Muscle Relationships (Weighted) ───────────────────────────────

const movementMuscleLinks: MovementMuscleDef[] = [
  // Shoulder Flexion
  { movementSlug: "shoulder-flexion", muscleSlug: "anterior-deltoid", role: "primary" },
  { movementSlug: "shoulder-flexion", muscleSlug: "pectoralis-major", role: "primary", notes: "Clavicular head" },
  { movementSlug: "shoulder-flexion", muscleSlug: "biceps-brachii", role: "synergist", notes: "Long head assists" },
  // Shoulder Extension
  { movementSlug: "shoulder-extension", muscleSlug: "latissimus-dorsi", role: "primary" },
  { movementSlug: "shoulder-extension", muscleSlug: "posterior-deltoid", role: "primary" },
  { movementSlug: "shoulder-extension", muscleSlug: "triceps-brachii", role: "synergist", notes: "Long head assists" },
  // Shoulder Abduction
  { movementSlug: "shoulder-abduction", muscleSlug: "middle-deltoid", role: "primary" },
  { movementSlug: "shoulder-abduction", muscleSlug: "supraspinatus", role: "primary", notes: "Initiates first 15°" },
  { movementSlug: "shoulder-abduction", muscleSlug: "trapezius-upper", role: "synergist", notes: "Upward rotation of scapula" },
  { movementSlug: "shoulder-abduction", muscleSlug: "serratus-anterior", role: "synergist", notes: "Upward rotation of scapula" },
  // Shoulder Adduction
  { movementSlug: "shoulder-adduction", muscleSlug: "pectoralis-major", role: "primary" },
  { movementSlug: "shoulder-adduction", muscleSlug: "latissimus-dorsi", role: "primary" },
  { movementSlug: "shoulder-adduction", muscleSlug: "teres-minor", role: "secondary" },
  // Shoulder Internal Rotation
  { movementSlug: "shoulder-internal-rotation", muscleSlug: "subscapularis", role: "primary" },
  { movementSlug: "shoulder-internal-rotation", muscleSlug: "pectoralis-major", role: "secondary" },
  { movementSlug: "shoulder-internal-rotation", muscleSlug: "latissimus-dorsi", role: "secondary" },
  { movementSlug: "shoulder-internal-rotation", muscleSlug: "anterior-deltoid", role: "synergist" },
  // Shoulder External Rotation
  { movementSlug: "shoulder-external-rotation", muscleSlug: "infraspinatus", role: "primary" },
  { movementSlug: "shoulder-external-rotation", muscleSlug: "teres-minor", role: "primary" },
  { movementSlug: "shoulder-external-rotation", muscleSlug: "posterior-deltoid", role: "secondary" },
  // Scapular Protraction
  { movementSlug: "scapular-protraction", muscleSlug: "serratus-anterior", role: "primary" },
  { movementSlug: "scapular-protraction", muscleSlug: "pectoralis-major", role: "secondary", notes: "Minor assist via sternal head" },
  // Scapular Retraction
  { movementSlug: "scapular-retraction", muscleSlug: "trapezius-middle", role: "primary" },
  { movementSlug: "scapular-retraction", muscleSlug: "rhomboid-major", role: "primary" },
  // Elbow Flexion
  { movementSlug: "elbow-flexion", muscleSlug: "brachialis", role: "primary" },
  { movementSlug: "elbow-flexion", muscleSlug: "biceps-brachii", role: "primary", notes: "Most effective in supination" },
  { movementSlug: "elbow-flexion", muscleSlug: "pronator-teres", role: "synergist" },
  // Elbow Extension
  { movementSlug: "elbow-extension", muscleSlug: "triceps-brachii", role: "primary" },
  // Forearm Pronation
  { movementSlug: "forearm-pronation", muscleSlug: "pronator-teres", role: "primary" },
  // Forearm Supination
  { movementSlug: "forearm-supination", muscleSlug: "supinator", role: "primary", notes: "Primary for slow supination" },
  { movementSlug: "forearm-supination", muscleSlug: "biceps-brachii", role: "primary", notes: "Primary for fast/resisted supination" },
  // Wrist Flexion
  { movementSlug: "wrist-flexion", muscleSlug: "flexor-carpi-radialis", role: "primary" },
  { movementSlug: "wrist-flexion", muscleSlug: "flexor-carpi-ulnaris", role: "primary" },
  { movementSlug: "wrist-flexion", muscleSlug: "flexor-digitorum-superficialis", role: "secondary" },
  // Wrist Extension
  { movementSlug: "wrist-extension", muscleSlug: "extensor-carpi-radialis-longus", role: "primary" },
  { movementSlug: "wrist-extension", muscleSlug: "extensor-digitorum", role: "secondary" },
  // Radial Deviation
  { movementSlug: "radial-deviation", muscleSlug: "flexor-carpi-radialis", role: "primary" },
  { movementSlug: "radial-deviation", muscleSlug: "extensor-carpi-radialis-longus", role: "primary" },
  // Ulnar Deviation
  { movementSlug: "ulnar-deviation", muscleSlug: "flexor-carpi-ulnaris", role: "primary" },
  // Finger Flexion
  { movementSlug: "finger-flexion", muscleSlug: "flexor-digitorum-superficialis", role: "primary" },
  // Finger Extension
  { movementSlug: "finger-extension", muscleSlug: "extensor-digitorum", role: "primary" },
  // Thumb Opposition
  { movementSlug: "thumb-opposition", muscleSlug: "opponens-pollicis", role: "primary" },
  // Hip Flexion
  { movementSlug: "hip-flexion", muscleSlug: "iliopsoas", role: "primary" },
  { movementSlug: "hip-flexion", muscleSlug: "rectus-femoris", role: "secondary" },
  // Hip Extension
  { movementSlug: "hip-extension", muscleSlug: "gluteus-maximus", role: "primary" },
  { movementSlug: "hip-extension", muscleSlug: "hamstrings", role: "primary" },
  { movementSlug: "hip-extension", muscleSlug: "adductor-group", role: "synergist", notes: "Adductor magnus hamstring portion" },
  // Hip Abduction
  { movementSlug: "hip-abduction", muscleSlug: "gluteus-medius", role: "primary" },
  { movementSlug: "hip-abduction", muscleSlug: "gluteus-maximus", role: "secondary", notes: "Upper fibers" },
  // Hip Adduction
  { movementSlug: "hip-adduction", muscleSlug: "adductor-group", role: "primary" },
  // Hip Internal Rotation
  { movementSlug: "hip-internal-rotation", muscleSlug: "gluteus-medius", role: "primary", notes: "Anterior fibers" },
  // Hip External Rotation
  { movementSlug: "hip-external-rotation", muscleSlug: "piriformis", role: "primary" },
  { movementSlug: "hip-external-rotation", muscleSlug: "gluteus-maximus", role: "secondary" },
  // Knee Flexion
  { movementSlug: "knee-flexion", muscleSlug: "hamstrings", role: "primary" },
  { movementSlug: "knee-flexion", muscleSlug: "gastrocnemius", role: "secondary" },
  // Knee Extension
  { movementSlug: "knee-extension", muscleSlug: "quadriceps", role: "primary" },
  { movementSlug: "knee-extension", muscleSlug: "rectus-femoris", role: "primary", notes: "Two-joint component of quadriceps" },
  // Ankle Dorsiflexion
  { movementSlug: "ankle-dorsiflexion", muscleSlug: "tibialis-anterior", role: "primary" },
  // Ankle Plantarflexion
  { movementSlug: "ankle-plantarflexion", muscleSlug: "gastrocnemius", role: "primary" },
  { movementSlug: "ankle-plantarflexion", muscleSlug: "soleus", role: "primary" },
  { movementSlug: "ankle-plantarflexion", muscleSlug: "tibialis-posterior", role: "secondary" },
  { movementSlug: "ankle-plantarflexion", muscleSlug: "peroneus-longus", role: "secondary" },
  // Foot Inversion
  { movementSlug: "foot-inversion", muscleSlug: "tibialis-anterior", role: "primary" },
  { movementSlug: "foot-inversion", muscleSlug: "tibialis-posterior", role: "primary" },
  // Foot Eversion
  { movementSlug: "foot-eversion", muscleSlug: "peroneus-longus", role: "primary" },
  // ── Additional cross-connections (stabilizers, synergists, secondary roles) ──
  { movementSlug: "shoulder-adduction", muscleSlug: "subscapularis", role: "synergist" },
  { movementSlug: "shoulder-flexion", muscleSlug: "middle-deltoid", role: "stabilizer" },
  { movementSlug: "shoulder-flexion", muscleSlug: "supraspinatus", role: "stabilizer", notes: "Stabilizes humeral head" },
  { movementSlug: "shoulder-external-rotation", muscleSlug: "supraspinatus", role: "stabilizer" },
  { movementSlug: "shoulder-flexion", muscleSlug: "trapezius-upper", role: "synergist", notes: "Scapular upward rotation component" },
  { movementSlug: "shoulder-extension", muscleSlug: "trapezius-middle", role: "stabilizer", notes: "Scapular stability" },
  { movementSlug: "shoulder-adduction", muscleSlug: "rhomboid-major", role: "synergist", notes: "Scapular retraction component" },
  { movementSlug: "shoulder-abduction", muscleSlug: "infraspinatus", role: "stabilizer", notes: "Stabilizes humeral head inferiorly" },
  { movementSlug: "forearm-pronation", muscleSlug: "brachialis", role: "stabilizer", notes: "Stabilizes elbow during pronation" },
  { movementSlug: "elbow-flexion", muscleSlug: "supinator", role: "stabilizer", notes: "Maintains supination during flexion" },
  { movementSlug: "finger-flexion", muscleSlug: "opponens-pollicis", role: "synergist", notes: "Positions thumb for grip" },
  { movementSlug: "hip-external-rotation", muscleSlug: "iliopsoas", role: "synergist", notes: "Assists when hip is flexed" },
  { movementSlug: "hip-abduction", muscleSlug: "piriformis", role: "secondary", notes: "Abducts when hip is flexed" },
  { movementSlug: "hip-flexion", muscleSlug: "quadriceps", role: "synergist", notes: "Via rectus femoris" },
  { movementSlug: "ankle-dorsiflexion", muscleSlug: "soleus", role: "stabilizer", notes: "Eccentric control" },
  { movementSlug: "hip-extension", muscleSlug: "erector-spinae", role: "stabilizer", notes: "Maintains trunk extension" },
  { movementSlug: "hip-flexion", muscleSlug: "erector-spinae", role: "stabilizer", notes: "Eccentric control of trunk" },
  { movementSlug: "knee-extension", muscleSlug: "erector-spinae", role: "stabilizer", notes: "Trunk stability during squatting" },
  { movementSlug: "shoulder-flexion", muscleSlug: "erector-spinae", role: "stabilizer", notes: "Postural stability" },
  { movementSlug: "hip-flexion", muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core stabilization" },
  { movementSlug: "hip-extension", muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core stabilization" },
  { movementSlug: "shoulder-flexion", muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core stabilization during overhead motion" },
  { movementSlug: "knee-extension", muscleSlug: "transversus-abdominis", role: "stabilizer", notes: "Core stability during squatting" },
  { movementSlug: "shoulder-internal-rotation", muscleSlug: "teres-minor", role: "stabilizer", notes: "Eccentric control / stabilizer" },
  { movementSlug: "shoulder-extension", muscleSlug: "teres-minor", role: "synergist" },
  { movementSlug: "elbow-extension", muscleSlug: "brachialis", role: "stabilizer", notes: "Eccentric control" },
  { movementSlug: "hip-adduction", muscleSlug: "gluteus-maximus", role: "stabilizer", notes: "Lower fibers stabilize" },
  { movementSlug: "hip-internal-rotation", muscleSlug: "adductor-group", role: "secondary", notes: "Adductors assist internal rotation" },
  { movementSlug: "foot-inversion", muscleSlug: "soleus", role: "synergist", notes: "Assists via calcaneal pull" },
  { movementSlug: "foot-eversion", muscleSlug: "tibialis-anterior", role: "stabilizer", notes: "Eccentric control" },
  { movementSlug: "knee-extension", muscleSlug: "gastrocnemius", role: "stabilizer", notes: "Eccentric role during knee extension" },
  { movementSlug: "hip-external-rotation", muscleSlug: "hamstrings", role: "synergist", notes: "Biceps femoris assists" },
];

export async function seedMuscles() {
  logSection("Muscles");

  for (const m of muscles) {
    await prisma.muscle.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        description: m.description,
        origin: m.origin,
        insertion: m.insertion,
        action: m.action,
        innervation: m.innervation,
        bloodSupply: m.bloodSupply,
        confidence: m.confidence,
      },
      create: {
        slug: m.slug,
        name: m.name,
        description: m.description,
        origin: m.origin,
        insertion: m.insertion,
        action: m.action,
        innervation: m.innervation,
        bloodSupply: m.bloodSupply,
        status: "draft",
        confidence: m.confidence,
      },
    });
  }

  logCount("muscles", muscles.length);
}

export async function seedMovementMuscleLinks() {
  logSection("Movement–Muscle relationships");

  const movementMap = new Map<string, string>();
  const movs = await prisma.movement.findMany({ select: { id: true, slug: true } });
  for (const m of movs) movementMap.set(m.slug, m.id);

  const muscleMap = new Map<string, string>();
  const muscs = await prisma.muscle.findMany({ select: { id: true, slug: true } });
  for (const m of muscs) muscleMap.set(m.slug, m.id);

  let count = 0;
  for (const link of movementMuscleLinks) {
    const movementId = movementMap.get(link.movementSlug);
    const muscleId = muscleMap.get(link.muscleSlug);
    if (!movementId) throw new Error(`Movement not found: ${link.movementSlug}`);
    if (!muscleId) throw new Error(`Muscle not found: ${link.muscleSlug}`);

    await prisma.movementMuscle.upsert({
      where: { movementId_muscleId: { movementId, muscleId } },
      update: { role: link.role, notes: link.notes },
      create: { movementId, muscleId, role: link.role, notes: link.notes },
    });
    count++;
  }

  logCount("movement–muscle links", count);
}
