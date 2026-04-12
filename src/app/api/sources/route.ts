import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/sources
 * 
 * Query params:
 *   ?filter=fulltext  — only sources with free fulltext
 *   ?filter=pdf       — only sources with PDF URLs
 *   ?format=rag       — minimal format for RAG ingestion (slug, title, pdfUrl, fulltextUrl, doi)
 */
export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("filter");
  const format = req.nextUrl.searchParams.get("format");

  const where: any = {};
  if (filter === "fulltext") {
    where.fulltextUrl = { not: null };
  } else if (filter === "pdf") {
    where.pdfUrl = { not: null };
  }

  if (format === "rag") {
    const sources = await prisma.researchSource.findMany({
      where,
      orderBy: { title: "asc" },
      select: {
        slug: true,
        title: true,
        authors: true,
        year: true,
        journal: true,
        doi: true,
        pmid: true,
        pmcid: true,
        fulltextUrl: true,
        pdfUrl: true,
      },
    });

    return NextResponse.json({
      count: sources.length,
      sources,
    });
  }

  // Explicit select locks the v1 contract (see docs/api-v1.md §Endpoint 7).
  const sources = await prisma.researchSource.findMany({
    where,
    orderBy: { title: "asc" },
    select: {
      slug: true,
      title: true,
      authors: true,
      year: true,
      journal: true,
      doi: true,
      pmid: true,
      pmcid: true,
      fulltextUrl: true,
      pdfUrl: true,
      sourceType: true,
      _count: { select: { entities: true } },
    },
  });

  return NextResponse.json({
    count: sources.length,
    sources,
  });
}
