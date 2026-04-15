import Link from "next/link";

export const metadata = {
  title: "Hand Assessment Reference",
};

// Mathiowetz 1985 normative data (dominant hand) with newer-study caveats
// noted in the copy. Values are approximate ranges across cited studies
// (Mathiowetz 1985; Werle 2009; Larson 2017; Sayadizadeh 2025).
const grip = [
  { band: "20–24", male: "45–50", female: "25–30" },
  { band: "25–39", male: "48–54", female: "27–32" },
  { band: "40–54", male: "45–50", female: "25–30" },
  { band: "55–69", male: "40–45", female: "22–27" },
  { band: "70+", male: "30–35", female: "18–22" },
];

const pinch = [
  {
    band: "20–24",
    tipM: "5.5–6.5",
    tipF: "3.5–4.5",
    latM: "8.5–10.0",
    latF: "5.5–6.5",
    jawM: "7.5–9.0",
    jawF: "4.5–5.5",
  },
  {
    band: "25–39",
    tipM: "6.0–7.0",
    tipF: "4.0–5.0",
    latM: "9.0–11.0",
    latF: "6.0–7.0",
    jawM: "8.0–10.0",
    jawF: "5.0–6.0",
  },
  {
    band: "40–54",
    tipM: "5.5–6.5",
    tipF: "3.5–4.5",
    latM: "8.5–10.0",
    latF: "5.5–6.5",
    jawM: "7.5–9.0",
    jawF: "4.5–5.5",
  },
  {
    band: "55–69",
    tipM: "5.0–6.0",
    tipF: "3.0–4.0",
    latM: "7.5–9.0",
    latF: "5.0–6.0",
    jawM: "7.0–8.5",
    jawF: "4.0–5.0",
  },
  {
    band: "70+",
    tipM: "4.5–5.5",
    tipF: "2.5–3.5",
    latM: "6.5–8.0",
    latF: "4.5–5.5",
    jawM: "6.0–7.5",
    jawF: "3.5–4.5",
  },
];

const clinicalTests = [
  {
    name: "Bunnell Intrinsic Tightness Test",
    purpose: "Detect intrinsic shortening",
    description:
      "Passively flex PIP with MCP extended, then with MCP flexed. Greater PIP flexion available with MCP flexed = intrinsic tightness.",
    quantitative: false,
  },
  {
    name: "Lumbrical-Plus Test",
    purpose: "Paradoxical IP extension during attempted flexion",
    description:
      "Patient tries to make a fist; IP joints extend instead of flexing — suggests lumbrical dominance from a displaced FDP insertion (often post tendon injury).",
    quantitative: false,
  },
  {
    name: "Froment Sign",
    purpose: "Adductor pollicis weakness (ulnar nerve)",
    description:
      "Patient holds paper between thumb and lateral index; thumb IP hyperflexes (FPL substitution) when the paper is pulled. Positive = adductor pollicis weakness.",
    quantitative: false,
  },
  {
    name: "Wartenberg Sign",
    purpose: "Small-finger abductor (ADM) overpull",
    description:
      "At rest, the small finger abducts and cannot be adducted — third palmar interosseous weakness (ulnar nerve).",
    quantitative: false,
  },
];

export default function HandAssessmentPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Hand Assessment Reference</h1>
          <p className="mt-2 text-gray-600">
            Normative pinch and grip values, intrinsic-muscle outcome measures, and
            quick-reference clinical tests for the hand.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          Work in progress
        </span>
      </div>

      <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Evidence-base caveats</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Isolated intrinsic-muscle training has sparse evidence; the only
            EMG-validated exercise is rubber-band finger abduction (Boudreau 2022).
          </li>
          <li>
            Grip/pinch dynamometry <em>cannot</em> isolate intrinsic function. The
            Rotterdam Intrinsic Hand Myometer (RIHM) is the validated alternative
            but is rarely available clinically (Schreuders 2006; McGee 2019).
          </li>
          <li>
            Normative values below are approximated from Mathiowetz 1985 (dominant
            hand). Newer data suggest lower absolute values in contemporary
            populations (Sayadizadeh 2025; Larson 2017; Werle 2009).
          </li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Grip strength (kg, dominant hand)</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-2">Age band</th>
                <th className="px-4 py-2">Male</th>
                <th className="px-4 py-2">Female</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grip.map((r) => (
                <tr key={r.band}>
                  <td className="px-4 py-2 font-medium text-gray-800">{r.band}</td>
                  <td className="px-4 py-2 text-gray-700">{r.male}</td>
                  <td className="px-4 py-2 text-gray-700">{r.female}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Pinch strength (kg, dominant hand)</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-2">Age band</th>
                <th className="px-4 py-2">Tip ♂</th>
                <th className="px-4 py-2">Tip ♀</th>
                <th className="px-4 py-2">Lateral ♂</th>
                <th className="px-4 py-2">Lateral ♀</th>
                <th className="px-4 py-2">3-jaw ♂</th>
                <th className="px-4 py-2">3-jaw ♀</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pinch.map((r) => (
                <tr key={r.band}>
                  <td className="px-4 py-2 font-medium text-gray-800">{r.band}</td>
                  <td className="px-4 py-2 text-gray-700">{r.tipM}</td>
                  <td className="px-4 py-2 text-gray-700">{r.tipF}</td>
                  <td className="px-4 py-2 text-gray-700">{r.latM}</td>
                  <td className="px-4 py-2 text-gray-700">{r.latF}</td>
                  <td className="px-4 py-2 text-gray-700">{r.jawM}</td>
                  <td className="px-4 py-2 text-gray-700">{r.jawF}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Typical pinch-to-grip ratios: tip ≈ 15–20%; lateral ≈ 20–25%. Not validated
          as a measure of intrinsic function.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Intrinsic-specific outcome measures</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">
            Rotterdam Intrinsic Hand Myometer (RIHM)
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            Validated, reliable (ICC 0.85–0.95), and more sensitive than grip/pinch
            for detecting intrinsic weakness. Measures isolated index/small finger
            abduction, thumb opposition, and intrinsic-plus position. Normative
            adult data available (McGee 2019).
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Key citations: Schreuders 2006; McGee 2019, 2024; Selles 2006 (CMT).
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">
            General hand-function measures (do <em>not</em> isolate intrinsics)
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>DASH — Disabilities of the Arm, Shoulder and Hand</li>
            <li>AUSCAN — Australian/Canadian Hand Osteoarthritis Index</li>
            <li>Moberg pick-up test (dexterity + sensibility)</li>
            <li>Purdue Pegboard and 9-Hole Peg Test (dexterity)</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Quick-reference clinical tests</h2>
        <div className="space-y-3">
          {clinicalTests.map((t) => (
            <div key={t.name} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                <span className="text-xs text-gray-500">{t.purpose}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{t.description}</p>
              {!t.quantitative && (
                <p className="mt-1 text-xs italic text-gray-500">
                  Qualitative / diagnostic — not a reliability-established outcome measure.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Related</h2>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/exercises?region=hand" className="text-indigo-700 hover:underline">
              Hand exercises →
            </Link>
          </li>
          <li>
            <Link href="/muscles" className="text-indigo-700 hover:underline">
              Browse hand muscles →
            </Link>
          </li>
          <li>
            <Link href="/planner" className="text-indigo-700 hover:underline">
              Workout planner (Hand region) →
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-10 text-xs text-gray-400">
        This page is a reference scaffold — pinch-grip calculators, age-adjusted
        percentile plots, and RIHM normative tables are planned. Contributions
        welcome.
      </p>
    </div>
  );
}
