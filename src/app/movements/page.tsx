import { getMovementsGroupedByRegion } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function MovementsPage() {
  const regions = await getMovementsGroupedByRegion();

  const totalMovements = regions.reduce(
    (sum, r) => sum + r.joints.reduce((js, j) => js + j.movements.length, 0),
    0
  );

  return (
    <div>
      <PageHeader
        title="Movements"
        subtitle={`${totalMovements} movements across ${regions.length} regions`}
      />

      <div className="space-y-8">
        {regions.map((region) => {
          const movementCount = region.joints.reduce((s, j) => s + j.movements.length, 0);
          if (movementCount === 0) return null;

          return (
            <section key={region.slug}>
              {/* Region header */}
              <div className="flex items-baseline gap-3 mb-4">
                <EntityLink href={`/regions/${region.slug}`} className="no-underline">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
                    {region.name}
                  </h2>
                </EntityLink>
                <span className="text-sm text-gray-400">
                  {movementCount} movement{movementCount !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Joints within region */}
              <div className="space-y-4 ml-1">
                {region.joints.map((joint) => {
                  if (joint.movements.length === 0) return null;

                  return (
                    <div key={joint.slug} className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                      {/* Joint header */}
                      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                        <EntityLink href={`/joints/${joint.slug}`} className="no-underline">
                          <h3 className="text-sm font-semibold text-gray-700 hover:text-indigo-700 transition-colors">
                            {joint.name}
                            <span className="ml-2 font-normal text-gray-400">
                              {joint.movements.length} movement{joint.movements.length !== 1 ? "s" : ""}
                            </span>
                          </h3>
                        </EntityLink>
                      </div>

                      {/* Movements list */}
                      <div className="divide-y divide-gray-100">
                        {joint.movements.map((m) => (
                          <EntityLink
                            key={m.slug}
                            href={`/movements/${m.slug}`}
                            className="block no-underline"
                          >
                            <div className="px-5 py-3 hover:bg-indigo-50/40 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                  <span className="text-sm font-medium text-gray-900">
                                    {m.name}
                                  </span>
                                  <span className="ml-3 text-xs text-gray-400">
                                    {m._count.muscles} muscle{m._count.muscles !== 1 ? "s" : ""}
                                    {" · "}
                                    {m._count.exercises} exercise{m._count.exercises !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-shrink-0 gap-2 ml-4">
                                  <StatusBadge status={m.status} />
                                  <ConfidenceBadge confidence={m.confidence} />
                                </div>
                              </div>
                              {m.plane && (
                                <p className="mt-0.5 text-xs text-gray-400">{m.plane} plane</p>
                              )}
                            </div>
                          </EntityLink>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
