/**
 * Resolve DOIs, PMIDs, PMC IDs, and free fulltext URLs for research sources.
 * 
 * Strategy:
 * 1. Search PubMed by title to get PMID
 * 2. Use NCBI ID converter to get DOI and PMCID from PMID
 * 3. For sources with PMCID, construct free fulltext + PDF links
 * 4. For sources without PMCID, try Unpaywall via DOI for OA copies
 * 5. Write results to a JSON file for review before updating seed data
 */

const NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const NCBI_CONVERTER = "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0";
const UNPAYWALL_EMAIL = "bodyiq@example.com"; // Required by Unpaywall API

// Rate limiting — NCBI allows 3 req/sec without API key
const DELAY_MS = 350;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface SourceInput {
  slug: string;
  title: string;
  authors?: string;
  year?: number;
  journal?: string;
  sourceType?: string;
}

interface ResolvedSource {
  slug: string;
  title: string;
  pmid?: string;
  doi?: string;
  pmcid?: string;
  fulltextUrl?: string;
  pdfUrl?: string;
  source: "pubmed" | "crossref" | "unpaywall" | "none";
  freeFulltext: boolean;
}

// ─── Extract sources from seed file ──────────────────────────────────────────

async function extractSources(): Promise<SourceInput[]> {
  const seedPath = "./prisma/seed/sources.ts";
  const fs = await import("fs");
  const content = fs.readFileSync(seedPath, "utf-8");
  
  const sources: SourceInput[] = [];
  
  // Split on object boundaries — each source starts with `slug:`
  const blocks = content.split(/\n\s*\{/).slice(1); // skip everything before first {
  
  for (const block of blocks) {
    const getField = (name: string): string | undefined => {
      const m = block.match(new RegExp(`${name}:\\s*"([^"]*)"`, "m"));
      return m?.[1] || undefined;
    };
    const getNum = (name: string): number | undefined => {
      const m = block.match(new RegExp(`${name}:\\s*(\\d+)`, "m"));
      return m ? parseInt(m[1]) : undefined;
    };
    
    const slug = getField("slug");
    const title = getField("title");
    if (!slug || !title) continue;
    
    sources.push({
      slug,
      title,
      authors: getField("authors"),
      year: getNum("year"),
      journal: getField("journal"),
      sourceType: getField("sourceType"),
    });
  }
  
  return sources;
}

// ─── PubMed search ──────────────────────────────────────────────────────────

async function searchPubMed(title: string, author?: string, year?: number): Promise<string | null> {
  // Build search query — title is most reliable
  // Clean title: remove special chars that break the search
  const cleanTitle = title
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Use first ~80 chars of title for search (long titles cause issues)
  const shortTitle = cleanTitle.slice(0, 100);
  
  let query = `${shortTitle}[Title]`;
  if (year) query += ` AND ${year}[dp]`;
  
  const url = `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=3`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as any;
    const ids = data?.esearchresult?.idlist;
    if (ids && ids.length > 0) {
      return ids[0]; // Take first match
    }
  } catch (e) {
    // Retry with shorter title
    try {
      const veryShort = cleanTitle.slice(0, 60);
      const fallbackQuery = year 
        ? `${veryShort}[Title] AND ${year}[dp]`
        : `${veryShort}[Title]`;
      const url2 = `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(fallbackQuery)}&retmode=json&retmax=3`;
      const res2 = await fetch(url2);
      if (!res2.ok) return null;
      const data2 = await res2.json() as any;
      const ids2 = data2?.esearchresult?.idlist;
      if (ids2 && ids2.length > 0) return ids2[0];
    } catch {
      // give up
    }
  }
  
  return null;
}

// ─── NCBI ID Converter (PMID → DOI, PMCID) ─────────────────────────────────

interface IdConversion {
  doi?: string;
  pmcid?: string;
}

async function convertIds(pmid: string): Promise<IdConversion> {
  const url = `${NCBI_CONVERTER}/?ids=${pmid}&format=json&idtype=pmid`;
  try {
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json() as any;
    const record = data?.records?.[0];
    if (!record) return {};
    return {
      doi: record.doi || undefined,
      pmcid: record.pmcid || undefined,
    };
  } catch {
    return {};
  }
}

// ─── CrossRef fallback (title → DOI) ────────────────────────────────────────

async function searchCrossRef(title: string, author?: string): Promise<string | null> {
  const query = encodeURIComponent(title.slice(0, 150));
  const url = `https://api.crossref.org/works?query.title=${query}&rows=3&select=DOI,title`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BodyIQ/1.0 (bodyiq@example.com)" }
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    const items = data?.message?.items;
    if (!items || items.length === 0) return null;
    
    // Simple title match — check first result
    const titleLower = title.toLowerCase().slice(0, 50);
    for (const item of items) {
      const itemTitle = (item.title?.[0] || "").toLowerCase();
      if (itemTitle.includes(titleLower.slice(0, 30)) || titleLower.includes(itemTitle.slice(0, 30))) {
        return item.DOI;
      }
    }
    // Return first if close enough
    return items[0]?.DOI || null;
  } catch {
    return null;
  }
}

// ─── Unpaywall (DOI → OA link) ──────────────────────────────────────────────

interface UnpaywallResult {
  fulltextUrl?: string;
  pdfUrl?: string;
  isOa: boolean;
}

async function checkUnpaywall(doi: string): Promise<UnpaywallResult> {
  const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${UNPAYWALL_EMAIL}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { isOa: false };
    const data = await res.json() as any;
    if (!data.is_oa) return { isOa: false };
    
    const best = data.best_oa_location;
    return {
      fulltextUrl: best?.url_for_landing_page || best?.url || undefined,
      pdfUrl: best?.url_for_pdf || undefined,
      isOa: true,
    };
  } catch {
    return { isOa: false };
  }
}

// ─── Main pipeline ──────────────────────────────────────────────────────────

async function main() {
  console.log("📚 Resolving research source identifiers and fulltext links...\n");
  
  const sources = await extractSources();
  // Filter to journal articles only (textbooks won't be on PubMed)
  const journalSources = sources.filter(s => s.sourceType === "journal" || s.sourceType === "guideline");
  console.log(`Found ${sources.length} total sources, ${journalSources.length} journal/guideline articles to resolve.\n`);
  
  const results: ResolvedSource[] = [];
  let pmidFound = 0;
  let doiFound = 0;
  let pmcFound = 0;
  let freeFulltext = 0;
  let errors = 0;

  for (let i = 0; i < journalSources.length; i++) {
    const s = journalSources[i];
    const progress = `[${i + 1}/${journalSources.length}]`;
    
    const result: ResolvedSource = {
      slug: s.slug,
      title: s.title,
      source: "none",
      freeFulltext: false,
    };

    try {
      // Step 1: Search PubMed
      const pmid = await searchPubMed(s.title, s.authors, s.year);
      await sleep(DELAY_MS);
      
      if (pmid) {
        result.pmid = pmid;
        pmidFound++;
        
        // Step 2: Convert PMID → DOI + PMCID
        const ids = await convertIds(pmid);
        await sleep(DELAY_MS);
        
        if (ids.doi) {
          result.doi = ids.doi;
          doiFound++;
        }
        if (ids.pmcid) {
          result.pmcid = ids.pmcid;
          result.fulltextUrl = `https://www.ncbi.nlm.nih.gov/pmc/articles/${ids.pmcid}/`;
          result.pdfUrl = `https://www.ncbi.nlm.nih.gov/pmc/articles/${ids.pmcid}/pdf/`;
          result.freeFulltext = true;
          result.source = "pubmed";
          pmcFound++;
          freeFulltext++;
          console.log(`${progress} ✅ ${s.slug} → PMC free fulltext (${ids.pmcid})`);
        } else if (ids.doi) {
          // Step 3: Try Unpaywall for OA copy
          const oa = await checkUnpaywall(ids.doi);
          await sleep(DELAY_MS);
          
          if (oa.isOa) {
            result.fulltextUrl = oa.fulltextUrl;
            result.pdfUrl = oa.pdfUrl;
            result.freeFulltext = true;
            result.source = "unpaywall";
            freeFulltext++;
            console.log(`${progress} 🔓 ${s.slug} → Unpaywall OA`);
          } else {
            result.source = "pubmed";
            console.log(`${progress} 🔒 ${s.slug} → DOI found, paywalled`);
          }
        } else {
          result.source = "pubmed";
          console.log(`${progress} ⚠️  ${s.slug} → PMID only, no DOI/PMC`);
        }
      } else {
        // Step 4: CrossRef fallback for DOI
        const doi = await searchCrossRef(s.title, s.authors);
        await sleep(DELAY_MS);
        
        if (doi) {
          result.doi = doi;
          doiFound++;
          
          // Try Unpaywall
          const oa = await checkUnpaywall(doi);
          await sleep(DELAY_MS);
          
          if (oa.isOa) {
            result.fulltextUrl = oa.fulltextUrl;
            result.pdfUrl = oa.pdfUrl;
            result.freeFulltext = true;
            result.source = "unpaywall";
            freeFulltext++;
            console.log(`${progress} 🔓 ${s.slug} → CrossRef+Unpaywall OA`);
          } else {
            result.source = "crossref";
            console.log(`${progress} 🔒 ${s.slug} → CrossRef DOI, paywalled`);
          }
        } else {
          console.log(`${progress} ❌ ${s.slug} → not found`);
        }
      }
    } catch (e) {
      errors++;
      console.log(`${progress} 💥 ${s.slug} → error: ${(e as Error).message}`);
    }

    results.push(result);
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log("\n" + "─".repeat(60));
  console.log("📊 Resolution Summary");
  console.log("─".repeat(60));
  console.log(`  Total journal/guideline sources:  ${journalSources.length}`);
  console.log(`  PMIDs found:                      ${pmidFound}`);
  console.log(`  DOIs found:                       ${doiFound}`);
  console.log(`  PMC free fulltext:                ${pmcFound}`);
  console.log(`  Total free fulltext (PMC+OA):     ${freeFulltext}`);
  console.log(`  Paywalled:                        ${doiFound - freeFulltext + pmidFound - doiFound}`);
  console.log(`  Not found:                        ${journalSources.length - pmidFound - (doiFound - pmidFound > 0 ? doiFound - pmidFound : 0)}`);
  console.log(`  Errors:                           ${errors}`);
  console.log("─".repeat(60));

  // Write results
  const outPath = "./scripts/resolved-sources.json";
  const fs = await import("fs");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results written to ${outPath}`);

  // Write free fulltext summary
  const freeOnes = results.filter(r => r.freeFulltext);
  console.log(`\n📗 Free fulltext articles: ${freeOnes.length}`);
  for (const f of freeOnes) {
    console.log(`  ${f.slug}: ${f.fulltextUrl || "—"}`);
  }
}

main().catch(console.error);
