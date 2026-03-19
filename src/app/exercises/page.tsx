import { getExercises } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div>
      <PageHeader title="Exercises" subtitle={`${exercises.length} PT exercises`} />

      <div className="grid gap-4">
        {exercises.map((e) => (
          <EntityLink key={e.slug} href={`/exercises/${e.slug}`} className="block no-underline">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{e.name}</h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{e.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {e._count.muscles} muscle{e._count.muscles !== 1 ? "s" : ""} •{" "}
                    {e._count.movements} movement{e._count.movements !== 1 ? "s" : ""} •{" "}
                    {e._count.cues} cue{e._count.cues !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={e.status} />
                  <ConfidenceBadge confidence={e.confidence} />
                </div>
              </div>
            </div>
          </EntityLink>
        ))}
      </div>
    </div>
  );
}
