import { getSources } from "@/lib/queries";
import { PageHeader } from "@/components/ui-helpers";
import { SourceList } from "@/components/source-list";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <div>
      <PageHeader title="Research Sources" subtitle={`${sources.length} sources`} />
      <SourceList sources={sources as any} />
    </div>
  );
}
