import { createFileRoute } from "@tanstack/react-router";

/**
 * First-party image proxy. Browsers and crawlers hit this route instead of
 * wsrv.nl directly; the server fetches from wsrv.nl and streams the result
 * back under our own origin.
 *
 * wsrv.nl's own robots.txt disallows every URL with a query string
 * (`Disallow: /*?*`), and our resize requests are query strings by nature
 * (`?url=...&w=...`). That made every proxied product image on every
 * product/marketplace page a "blocked by robots.txt" external resource in
 * Search Console — thousands of pages, one per product image. Routing
 * through bitcoinminingdepot.net/api/public/img instead means the resource
 * URL crawlers see is governed by our own robots.txt (which allows it), not
 * wsrv.nl's.
 */

const UPSTREAM = "https://wsrv.nl/";
const MIN_WIDTH = 16;
const MAX_WIDTH = 2000;
const DEFAULT_WIDTH = 800;

function clampWidth(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}

export const Route = createFileRoute("/api/public/img")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const source = requestUrl.searchParams.get("url");
        if (!source) return new Response("Missing url", { status: 400 });

        let sourceUrl: URL;
        try {
          sourceUrl = new URL(source);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }
        if (sourceUrl.protocol !== "http:" && sourceUrl.protocol !== "https:") {
          return new Response("Invalid url", { status: 400 });
        }

        const width = clampWidth(requestUrl.searchParams.get("w"));
        const upstream = new URL(UPSTREAM);
        upstream.searchParams.set("url", sourceUrl.toString());
        upstream.searchParams.set("w", String(width));
        upstream.searchParams.set("output", "webp");
        upstream.searchParams.set("q", "80");
        upstream.searchParams.set("fit", "inside");

        let upstreamRes: Response;
        try {
          upstreamRes = await fetch(upstream, { signal: AbortSignal.timeout(10_000) });
        } catch {
          return new Response("Upstream fetch failed", { status: 502 });
        }

        const contentType = upstreamRes.headers.get("content-type") ?? "";
        if (!upstreamRes.ok || !contentType.startsWith("image/")) {
          return new Response("Upstream fetch failed", { status: 502 });
        }

        return new Response(upstreamRes.body, {
          status: 200,
          headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=86400, s-maxage=2592000",
          },
        });
      },
    },
  },
});
