import { getSources } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader } from "@/components/ui-helpers";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <div>
      <PageHeader title="Research Sources" subtitle={`${sources.length} sources`} />

      <div className="grid gap-4">
        {sources.map((s) => (
          <EntityLink key={s.slug} href={`/sources/${s.slug}`} className="block no-underline">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {s.authors && <span>{s.authors}</span>}
                    {s.year && <span> ({s.year})</span>}
                    {s.sourceType && <span className="ml-2 text-xs text-gray-400">• {s.sourceType}</span>}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Linked to {s._count.entities} entit{s._count.entities !== 1 ? "ies" : "y"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={s.status} />
                  <ConfidenceBadge confidence={s.confidence} />
                </div>
              </div>
            </div>
          </EntityLink>
        ))}
      </div>
    </div>
  );
}
