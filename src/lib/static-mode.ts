/**
 * Static-export awareness for UI links.
 *
 * Both values are inlined at build time by `next.config.js` (the `env` block),
 * so they are safe to read at module scope in server and client components.
 *
 * Why this exists: `basePath` rewrites `next/link` hrefs and framework-managed
 * assets, but NOT raw `<a href>` / `<img src>`. Anything pointing at a file we
 * serve ourselves has to be prefixed by hand — the same gotcha already recorded
 * for the sidebar icons and favicon in wiki/concepts/static-demo.md.
 */

export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix an app-absolute path with the deployment base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

/**
 * Where to find an exercise's FHIR R4 ActivityDefinition.
 *
 * Live app  → the API route, generated per request.
 * Static demo → a build-time snapshot under `public/fhir/`, written by
 * `pnpm export:fhir public/fhir` in the Pages workflow. The API routes are
 * deleted before the export build (they can't be statically rendered), so the
 * route form would 404 there.
 *
 * Both branches go through `withBasePath` so the raw anchor survives any
 * basePath deployment, not just the Pages one.
 */
export function fhirHref(slug: string): string {
  return withBasePath(IS_STATIC ? `/fhir/${slug}.json` : `/api/exercises/${slug}/fhir`);
}
