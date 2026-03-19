import { getMovements } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function MovementsPage() {
  const movements = await getMovements();

  return (
    <div>
      <PageHeader title="Movements" subtitle={`${movements.length} movements across all joints`} />

      <div className="grid gap-4">
        {movements.map((m) => (
          <EntityLink key={m.slug} href={`/movements/${m.slug}`} className="block no-underline">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{m.name}</h2>
                  <p className="text-sm text-gray-500">
                    <EntityLink href={`/joints/${m.joint.slug}`}>{m.joint.name}</EntityLink>
                    <span className="text-gray-400"> • </span>
                    <EntityLink href={`/regions/${m.joint.region.slug}`}>{m.joint.region.name}</EntityLink>
                    {m.plane && <span className="ml-2 text-xs text-gray-400">• {m.plane} plane</span>}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {m._count.muscles} muscle{m._count.muscles !== 1 ? "s" : ""} •{" "}
                    {m._count.exercises} exercise{m._count.exercises !== 1 ? "s" : ""} •{" "}
                    {m._count.functionalTasks} task{m._count.functionalTasks !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={m.status} />
                  <ConfidenceBadge confidence={m.confidence} />
                </div>
              </div>
            </div>
          </EntityLink>
        ))}
      </div>
    </div>
  );
}
