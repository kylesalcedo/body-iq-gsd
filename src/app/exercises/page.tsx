import { getExercisesGroupedByRegion } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function ExercisesPage() {
  const regions = await getExercisesGroupedByRegion();

  const totalExercises = regions.reduce((sum, r) => sum + r.exercises.length, 0);
  const uniqueExercises = new Set(regions.flatMap((r) => r.exercises.map((e) => e.id))).size;
  const regionCount = regions.filter((r) => r.exercises.length > 0 && r.slug !== "unassigned").length;

  return (
    <div>
      <PageHeader
        title="Exercises"
        subtitle={`${uniqueExercises} PT exercises across ${regionCount} regions`}
      />

      <div className="space-y-8">
        {regions.map((region) => {
          if (region.exercises.length === 0) return null;

          return (
            <section key={region.slug}>
              {/* Region header */}
              <div className="flex items-baseline gap-3 mb-4">
                {region.slug !== "unassigned" ? (
                  <EntityLink href={`/regions/${region.slug}`} className="no-underline">
                    <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
                      {region.name}
                    </h2>
                  </EntityLink>
                ) : (
                  <h2 className="text-xl font-bold text-gray-400">{region.name}</h2>
                )}
                <span className="text-sm text-gray-400">
                  {region.exercises.length} exercise{region.exercises.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Exercises within region */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {region.exercises.map((e) => (
                    <EntityLink
                      key={e.slug}
                      href={`/exercises/${e.slug}`}
                      className="block no-underline"
                    >
                      <div className="px-5 py-4 hover:bg-indigo-50/40 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-900">
                              {e.name}
                            </span>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                              {e.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {e._count.muscles} muscle{e._count.muscles !== 1 ? "s" : ""}
                              {" · "}
                              {e._count.movements} movement{e._count.movements !== 1 ? "s" : ""}
                              {" · "}
                              {e._count.cues} cue{e._count.cues !== 1 ? "s" : ""}
                              {e._count.sources > 0 && (
                                <>
                                  {" · "}
                                  {e._count.sources} source{e._count.sources !== 1 ? "s" : ""}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 gap-2 ml-4">
                            <StatusBadge status={e.status} />
                            <ConfidenceBadge confidence={e.confidence} />
                          </div>
                        </div>
                      </div>
                    </EntityLink>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
