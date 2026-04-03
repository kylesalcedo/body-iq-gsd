import { PageHeader } from "@/components/ui-helpers";
import { ApiExplorer } from "@/components/api-explorer";

export default function ApiPage() {
  return (
    <div className="max-w-5xl">
      <PageHeader
        title="API Reference"
        subtitle="All available REST endpoints for the Body IQ knowledge graph"
      />

      <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <p className="text-sm text-indigo-800">
          <strong>Base URL:</strong>{" "}
          <code className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-indigo-700">
            http://localhost:3000
          </code>
        </p>
        <p className="mt-2 text-sm text-indigo-700">
          All endpoints return JSON. Click any endpoint to see parameters, then hit <strong>Send →</strong> to try it live.
        </p>
      </div>

      <ApiExplorer />
    </div>
  );
}
