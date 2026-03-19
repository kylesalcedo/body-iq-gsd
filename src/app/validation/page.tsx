import { getValidationQueue } from "@/lib/queries";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink, PageHeader, Card, SectionTitle, EmptyState } from "@/components/ui-helpers";

const entityPaths: Record<string, string> = {
  region: "/regions",
  joint: "/joints",
  movement: "/movements",
  muscle: "/muscles",
  task: "/tasks",
  exercise: "/exercises",
};

const entityLabels: Record<string, string> = {
  region: "Region",
  joint: "Joint",
  movement: "Movement",
  muscle: "Muscle",
  task: "Task",
  exercise: "Exercise",
};

function QueueItem({ item }: { item: any }) {
  const path = entityPaths[item.entityType];
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 bg-gray-200 rounded px-1.5 py-0.5 font-mono">
          {entityLabels[item.entityType]}
        </span>
        <EntityLink href={`${path}/${item.slug}`}>
          {item.name}
        </EntityLink>
      </div>
      <div className="flex gap-2">
        <StatusBadge status={item.status} />
        <ConfidenceBadge confidence={item.confidence} />
      </div>
    </div>
  );
}

export default async function ValidationPage() {
  const queue = await getValidationQueue();

  const totalItems = queue.draft.length + queue.lowConfidence.length + queue.needsReview.length;

  return (
    <div>
      <PageHeader
        title="Validation Queue"
        subtitle={`${totalItems} item${totalItems !== 1 ? "s" : ""} needing attention`}
      />

      {/* Draft items */}
      <Card className="mb-6">
        <SectionTitle>
          Draft Items ({queue.draft.length})
        </SectionTitle>
        <p className="text-xs text-gray-500 mb-3">Entities in draft status that haven&apos;t been reviewed.</p>
        {queue.draft.length === 0 ? (
          <EmptyState message="No draft items. All entities have been reviewed." />
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {queue.draft.map((item: any) => (
              <QueueItem key={`${item.entityType}-${item.slug}`} item={item} />
            ))}
          </div>
        )}
      </Card>

      {/* Low confidence */}
      <Card className="mb-6">
        <SectionTitle>
          Low Confidence ({queue.lowConfidence.length})
        </SectionTitle>
        <p className="text-xs text-gray-500 mb-3">Entities with confidence below 60% — data may be uncertain.</p>
        {queue.lowConfidence.length === 0 ? (
          <EmptyState message="No low-confidence items." />
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {queue.lowConfidence.map((item: any) => (
              <QueueItem key={`${item.entityType}-${item.slug}`} item={item} />
            ))}
          </div>
        )}
      </Card>

      {/* Needs review */}
      <Card className="mb-6">
        <SectionTitle>
          Needs Review ({queue.needsReview.length})
        </SectionTitle>
        <p className="text-xs text-gray-500 mb-3">Entities explicitly flagged for review.</p>
        {queue.needsReview.length === 0 ? (
          <EmptyState message="No items flagged for review." />
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {queue.needsReview.map((item: any) => (
              <QueueItem key={`${item.entityType}-${item.slug}`} item={item} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
