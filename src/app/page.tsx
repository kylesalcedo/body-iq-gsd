import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const counts = {
    regions: await prisma.region.count(),
    joints: await prisma.joint.count(),
    movements: await prisma.movement.count(),
    muscles: await prisma.muscle.count(),
    functionalTasks: await prisma.functionalTask.count(),
    exercises: await prisma.exercise.count(),
    sources: await prisma.researchSource.count(),
  };

  const stats = [
    { label: "Regions", count: counts.regions, href: "/regions", icon: "🗺️" },
    { label: "Joints", count: counts.joints, href: "/joints", icon: "🔗" },
    { label: "Movements", count: counts.movements, href: "/movements", icon: "↔️" },
    { label: "Muscles", count: counts.muscles, href: "/muscles", icon: "💪" },
    { label: "Functional Tasks", count: counts.functionalTasks, href: "/tasks", icon: "🎯" },
    { label: "Exercises", count: counts.exercises, href: "/exercises", icon: "🏋️" },
    { label: "Sources", count: counts.sources, href: "/sources", icon: "📚" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Movement Knowledge Engine</h1>
      <p className="mt-2 text-gray-600">
        Browse and validate the biomechanics knowledge graph.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.count}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <h2 className="font-semibold text-indigo-800">Tools</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/finder"
            className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-200 transition-colors"
          >
            🔍 Exercise Finder
          </Link>
          <Link
            href="/validation"
            className="inline-flex items-center rounded-md bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200 transition-colors"
          >
            ✅ Validation Queue
          </Link>
        </div>
      </div>
    </div>
  );
}
