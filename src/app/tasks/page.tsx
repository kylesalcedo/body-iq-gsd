import { getFunctionalTasks } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function TasksPage() {
  const tasks = await getFunctionalTasks();

  return (
    <div>
      <PageHeader title="Functional Tasks" subtitle={`${tasks.length} functional tasks`} />

      <div className="grid gap-4">
        {tasks.map((t) => (
          <EntityLink key={t.slug} href={`/tasks/${t.slug}`} className="block no-underline">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t.name}</h2>
                  {t.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{t.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {t.category && <span className="mr-2">{t.category}</span>}
                    {t._count.movements} movement{t._count.movements !== 1 ? "s" : ""} •{" "}
                    {t._count.exercises} exercise{t._count.exercises !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={t.status} />
                  <ConfidenceBadge confidence={t.confidence} />
                </div>
              </div>
            </div>
          </EntityLink>
        ))}
      </div>
    </div>
  );
}
