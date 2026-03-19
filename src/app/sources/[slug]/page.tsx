import { notFound } from "next/navigation";
import { getSource } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { PageHeader, Card, SectionTitle, EmptyState } from "@/components/ui-helpers";

export default async function SourceDetailPage({ params }: { params: { slug: string } }) {
  const source = await getSource(params.slug);
  if (!source) notFound();

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={source.title}
        subtitle={[source.authors, source.year ? `(${source.year})` : null, source.journal].filter(Boolean).join(" ")}
        badges={
          <>
            <StatusBadge status={source.status} />
            <ConfidenceBadge confidence={source.confidence} />
            {source.sourceType && (
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {source.sourceType}
              </span>
            )}
          </>
        }
      />

      {source.description && (
        <Card className="mb-6">
          <p className="text-sm text-gray-700">{source.description}</p>
        </Card>
      )}

      {(source.doi || source.url) && (
        <Card className="mb-6">
          <SectionTitle>Links</SectionTitle>
          {source.doi && (
            <p className="text-sm">
              <strong className="text-gray-600">DOI:</strong>{" "}
              <a href={`https://doi.org/${source.doi}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {source.doi}
              </a>
            </p>
          )}
          {source.url && (
            <p className="text-sm mt-1">
              <strong className="text-gray-600">URL:</strong>{" "}
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {source.url}
              </a>
            </p>
          )}
        </Card>
      )}

      <Card>
        <SectionTitle>Linked Entities ({source.entities.length})</SectionTitle>
        {source.entities.length === 0 ? (
          <EmptyState message="No entities linked to this source." />
        ) : (
          <div className="space-y-2">
            {source.entities.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">
                <span className="text-gray-700">{e.entityType}</span>
                {e.notes && <span className="text-gray-500">{e.notes}</span>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
