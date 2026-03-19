import { notFound } from "next/navigation";
import { getExercise } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge, RoleBadge } from "@/components/badges";
import { EntityLink, PageHeader, Card, SectionTitle, EmptyState } from "@/components/ui-helpers";

export default async function ExerciseDetailPage({ params }: { params: { slug: string } }) {
  const exercise = await getExercise(params.slug);
  if (!exercise) notFound();

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={exercise.name}
        badges={
          <>
            <StatusBadge status={exercise.status} />
            <ConfidenceBadge confidence={exercise.confidence} />
          </>
        }
      />

      <Card className="mb-6">
        <p className="text-sm text-gray-700">{exercise.description}</p>
        {exercise.notes && (
          <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded p-2">
            <strong>Note:</strong> {exercise.notes}
          </p>
        )}
      </Card>

      {/* Muscle Roles */}
      <Card className="mb-6">
        <SectionTitle>Muscle Roles ({exercise.muscles.length})</SectionTitle>
        {exercise.muscles.length === 0 ? (
          <EmptyState message="No muscles linked." />
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
                {exercise.muscles.map((em) => (
                  <tr key={em.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <EntityLink href={`/muscles/${em.muscle.slug}`}>
                        {em.muscle.name}
                      </EntityLink>
                    </td>
                    <td className="py-2 pr-4">
                      <RoleBadge role={em.role} />
                    </td>
                    <td className="py-2 text-gray-500">{em.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Target Movements */}
      {exercise.movements.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Target Movements ({exercise.movements.length})</SectionTitle>
          <div className="space-y-2">
            {exercise.movements.map((em) => (
              <div key={em.id} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <EntityLink href={`/movements/${em.movement.slug}`}>
                  {em.movement.name}
                </EntityLink>
                <span className="text-xs text-gray-400 ml-2">
                  {em.movement.joint.name}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Cues */}
      {exercise.cues.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Cues ({exercise.cues.length})</SectionTitle>
          <ol className="space-y-2 list-decimal list-inside">
            {exercise.cues.map((c) => (
              <li key={c.id} className="text-sm text-gray-700">
                {c.text}
                {c.cueType && (
                  <span className="ml-2 text-xs text-gray-400">({c.cueType})</span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Regressions & Progressions side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {exercise.regressions.length > 0 && (
          <Card>
            <SectionTitle>Regressions ↓</SectionTitle>
            <div className="space-y-3">
              {exercise.regressions.map((r) => (
                <div key={r.id}>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {exercise.progressions.length > 0 && (
          <Card>
            <SectionTitle>Progressions ↑</SectionTitle>
            <div className="space-y-3">
              {exercise.progressions.map((p) => (
                <div key={p.id}>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Functional Tasks */}
      {exercise.functionalTasks.length > 0 && (
        <Card className="mb-6">
          <SectionTitle>Functional Relevance</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {exercise.functionalTasks.map((eft) => (
              <EntityLink
                key={eft.id}
                href={`/tasks/${eft.functionalTask.slug}`}
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm"
              >
                {eft.functionalTask.name}
              </EntityLink>
            ))}
          </div>
        </Card>
      )}

      {/* Sources */}
      {exercise.sources.length > 0 && (
        <Card>
          <SectionTitle>Sources</SectionTitle>
          <ul className="space-y-2">
            {exercise.sources.map((s) => (
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
