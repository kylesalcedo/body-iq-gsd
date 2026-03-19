import { notFound } from "next/navigation";
import { getMovement } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge, RoleBadge } from "@/components/badges";
import { EntityLink, PageHeader, Card, SectionTitle, EmptyState } from "@/components/ui-helpers";

export default async function MovementDetailPage({ params }: { params: { slug: string } }) {
  const movement = await getMovement(params.slug);
  if (!movement) notFound();

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={movement.name}
        subtitle={`${movement.joint.name} • ${movement.joint.region.name}${movement.plane ? ` • ${movement.plane} plane` : ""}`}
        badges={
          <>
            <StatusBadge status={movement.status} />
            <ConfidenceBadge confidence={movement.confidence} />
          </>
        }
      />

      {movement.description && (
        <Card className="mb-6">
          <p className="text-sm text-gray-700">{movement.description}</p>
          {movement.axis && (
            <p className="mt-2 text-xs text-gray-500">Axis: {movement.axis}</p>
          )}
        </Card>
      )}

      {/* Muscles with role weights */}
      <Card className="mb-6">
        <SectionTitle>Muscles ({movement.muscles.length})</SectionTitle>
        {movement.muscles.length === 0 ? (
          <EmptyState message="No muscles linked to this movement." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-700">Muscle</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-2 font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {movement.muscles.map((mm) => (
                  <tr key={mm.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <EntityLink href={`/muscles/${mm.muscle.slug}`}>
                        {mm.muscle.name}
                      </EntityLink>
                    </td>
                    <td className="py-2 pr-4">
                      <RoleBadge role={mm.role} />
                    </td>
                    <td className="py-2 text-gray-500">{mm.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Functional Tasks */}
      {movement.functionalTasks.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Functional Tasks ({movement.functionalTasks.length})</SectionTitle>
          <div className="space-y-2">
            {movement.functionalTasks.map((mft) => (
              <div key={mft.id} className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
                <EntityLink href={`/tasks/${mft.functionalTask.slug}`}>
                  {mft.functionalTask.name}
                </EntityLink>
                {mft.relevance && (
                  <span className="text-xs text-gray-500">{mft.relevance}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Exercises */}
      {movement.exercises.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Exercises ({movement.exercises.length})</SectionTitle>
          <div className="space-y-2">
            {movement.exercises.map((em) => (
              <div key={em.id} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <EntityLink href={`/exercises/${em.exercise.slug}`}>
                  {em.exercise.name}
                </EntityLink>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sources */}
      {movement.sources.length > 0 && (
        <Card>
          <SectionTitle>Sources</SectionTitle>
          <ul className="space-y-2">
            {movement.sources.map((s) => (
              <li key={s.id} className="text-sm">
                <EntityLink href={`/sources/${s.source.slug}`}>{s.source.title}</EntityLink>
                {s.notes && <span className="text-gray-500"> — {s.notes}</span>}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
