/**
 * Merge resolved source identifiers back into the seed file.
 * Adds doi, pmid, pmcid, fulltextUrl, pdfUrl fields to each source object.
 * 
 * Usage: npx tsx scripts/merge-resolved-sources.ts
 * 
 * Run after resolve-sources.ts to update prisma/seed/sources.ts with
 * DOIs, PMIDs, PMC IDs, and free fulltext/PDF links.
 */

import * as fs from "fs";

interface ResolvedSource {
  slug: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
  fulltextUrl?: string;
  pdfUrl?: string;
  freeFulltext: boolean;
}

function main() {
  const resolvedPath = "./scripts/resolved-sources.json";
  if (!fs.existsSync(resolvedPath)) {
    console.error("❌ No resolved-sources.json found. Run resolve-sources.ts first.");
    process.exit(1);
  }

  const resolved: ResolvedSource[] = JSON.parse(
    fs.readFileSync(resolvedPath, "utf-8")
  );

  // Build lookup by slug
  const lookup = new Map<string, ResolvedSource>();
  for (const r of resolved) {
    lookup.set(r.slug, r);
  }

  let content = fs.readFileSync("./prisma/seed/sources.ts", "utf-8");

  let updated = 0;
  let skipped = 0;

  for (const [slug, r] of lookup) {
    // Build the fields to insert after the confidence line
    const fields: string[] = [];
    if (r.doi) fields.push(`      doi: "${r.doi}",`);
    if (r.pmid) fields.push(`      pmid: "${r.pmid}",`);
    if (r.pmcid) fields.push(`      pmcid: "${r.pmcid}",`);
    if (r.fulltextUrl) fields.push(`      fulltextUrl: "${r.fulltextUrl}",`);
    if (r.pdfUrl) fields.push(`      pdfUrl: "${r.pdfUrl}",`);

    if (fields.length === 0) continue;

    // Find the slug in the file
    const slugPattern = `slug: "${slug}",`;
    const slugIndex = content.indexOf(slugPattern);
    if (slugIndex === -1) continue;

    // Find the next `confidence:` line after this slug
    const afterSlug = content.substring(slugIndex);
    const confMatch = afterSlug.match(/confidence:\s*[\d.]+,?\s*\n/);

    if (confMatch && confMatch.index !== undefined) {
      const insertPoint = slugIndex + confMatch.index + confMatch[0].length;

      // Check if we've already added these fields (idempotent)
      const nextChunk = content.substring(insertPoint, insertPoint + 200);
      if (nextChunk.includes("doi:") || nextChunk.includes("pmid:") || nextChunk.includes("pmcid:")) {
        skipped++;
        continue;
      }

      const insertion = fields.join("\n") + "\n";
      content = content.substring(0, insertPoint) + insertion + content.substring(insertPoint);
      updated++;
    }
  }

  fs.writeFileSync("./prisma/seed/sources.ts", content);
  console.log(`✅ Updated ${updated} sources in prisma/seed/sources.ts`);
  console.log(`   ${skipped} already had identifiers (skipped)`);
  console.log(`   ${lookup.size} total in resolved-sources.json`);
}

main();
