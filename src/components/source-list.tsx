"use client";

import { useState } from "react";
import { StatusBadge, ConfidenceBadge } from "@/components/badges";
import { EntityLink } from "@/components/ui-helpers";

type Source = {
  slug: string;
  title: string;
  authors: string | null;
  year: number | null;
  sourceType: string | null;
  status: string;
  confidence: number;
  doi: string | null;
  pmid: string | null;
  pmcid: string | null;
  fulltextUrl: string | null;
  pdfUrl: string | null;
  _count: { entities: number };
};

type Filter = "all" | "fulltext" | "pdf";

export function SourceList({ sources }: { sources: Source[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const fulltextCount = sources.filter((s) => s.fulltextUrl).length;
  const pdfCount = sources.filter((s) => s.pdfUrl).length;

  const filtered = sources.filter((s) => {
    if (filter === "fulltext" && !s.fulltextUrl) return false;
    if (filter === "pdf" && !s.pdfUrl) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.authors?.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <FilterTab
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={`All (${sources.length})`}
          />
          <FilterTab
            active={filter === "fulltext"}
            onClick={() => setFilter("fulltext")}
            label={`Free Fulltext (${fulltextCount})`}
            icon="📄"
          />
          <FilterTab
            active={filter === "pdf"}
            onClick={() => setFilter("pdf")}
            label={`PDF Available (${pdfCount})`}
            icon="📕"
          />
        </div>
        <input
          type="text"
          placeholder="Search sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <span className="text-sm text-gray-400">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Source cards */}
      <div className="grid gap-4">
        {filtered.map((s) => (
          <div
            key={s.slug}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <EntityLink href={`/sources/${s.slug}`} className="no-underline">
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                    {s.title}
                  </h2>
                </EntityLink>
                <p className="mt-1 text-sm text-gray-500">
                  {s.authors && <span>{s.authors}</span>}
                  {s.year && <span> ({s.year})</span>}
                  {s.sourceType && (
                    <span className="ml-2 text-xs text-gray-400">• {s.sourceType}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Linked to {s._count.entities} entit{s._count.entities !== 1 ? "ies" : "y"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={s.status} />
                  <ConfidenceBadge confidence={s.confidence} />
                </div>

                {/* Access links */}
                <div className="flex gap-2">
                  {s.pdfUrl && (
                    <a
                      href={s.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      title="Download PDF"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📕 PDF
                    </a>
                  )}
                  {s.fulltextUrl && (
                    <a
                      href={s.fulltextUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                      title="View fulltext"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📄 Fulltext
                    </a>
                  )}
                  {s.doi && !s.fulltextUrl && (
                    <a
                      href={`https://doi.org/${s.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                      title="DOI (may be paywalled)"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔒 DOI
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No sources match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
}
