import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SITE } from "@/lib/site";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  INDEXNOW_SCOPES,
  type IndexNowScope,
} from "@/lib/indexnow";

import sitemapPages from "../../../../public/sitemap-pages.xml?raw";
import sitemapProducts from "../../../../public/sitemap-products.xml?raw";
import sitemapBlog from "../../../../public/sitemap-blog.xml?raw";
import sitemapMarket1 from "../../../../public/sitemap-marketplace-1.xml?raw";
import sitemapMarket2 from "../../../../public/sitemap-marketplace-2.xml?raw";
import sitemapMarket3 from "../../../../public/sitemap-marketplace-3.xml?raw";

const SITEMAPS: Record<Exclude<IndexNowScope, "all">, string[]> = {
  pages: [sitemapPages],
  products: [sitemapProducts],
  blog: [sitemapBlog],
  marketplace: [sitemapMarket1, sitemapMarket2, sitemapMarket3],
};

const bodySchema = z
  .object({ urls: z.array(z.string().url()).min(1).max(10_000).optional() })
  .optional();

function sitemapsForScope(scope: IndexNowScope) {
  if (scope === "all") return Object.values(SITEMAPS).flat();
  return SITEMAPS[scope];
}

async function readSitemapUrls(_origin: string, scope: IndexNowScope) {
  const urls: string[] = [];
  for (const xml of sitemapsForScope(scope)) {
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = match[1]?.trim();
      if (loc) urls.push(loc);
    }
  }
  return [...new Set(urls)];
}



async function submitBatch(urls: string[]) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: SITE.domain,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urls,
    }),
  });
  const text = await res.text();
  const message =
    res.status === 200
      ? "Accepted"
      : res.status === 202
        ? "Accepted — key validation pending"
        : text.slice(0, 200) || `HTTP ${res.status}`;
  return { count: urls.length, status: res.status, ok: res.ok, message };
}

export const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          key: INDEXNOW_KEY,
          keyLocation: INDEXNOW_KEY_LOCATION,
          scopes: INDEXNOW_SCOPES,
          usage: "POST /api/public/indexnow?scope=all — or POST { urls: [...] }",
        }),

      POST: async ({ request }) => {
        const url = new URL(request.url);
        const scopeParam = url.searchParams.get("scope") ?? "all";
        if (!INDEXNOW_SCOPES.includes(scopeParam as IndexNowScope)) {
          return Response.json({ error: `Unknown scope "${scopeParam}"` }, { status: 400 });
        }
        const scope = scopeParam as IndexNowScope;

        let explicit: string[] | undefined;
        if (request.headers.get("content-type")?.includes("application/json")) {
          const raw = await request.json().catch(() => undefined);
          const parsed = bodySchema.safeParse(raw);
          if (!parsed.success) {
            return Response.json({ error: "Invalid request body" }, { status: 400 });
          }
          explicit = parsed.data?.urls;
        }

        // Only our own canonical URLs may be submitted for this host.
        const urls = (explicit ?? (await readSitemapUrls(SITE.url, scope))).filter((u) =>
          u.startsWith(`${SITE.url}/`),
        );

        if (!urls.length) {
          return Response.json({ error: "No submittable URLs were found" }, { status: 400 });
        }

        const batches: Awaited<ReturnType<typeof submitBatch>>[] = [];
        for (let i = 0; i < urls.length; i += 10_000) {
          batches.push(await submitBatch(urls.slice(i, i + 10_000)));
        }

        const submitted = batches.filter((b) => b.ok).reduce((sum, b) => sum + b.count, 0);
        return Response.json({
          scope: explicit ? "pages" : scope,
          urls: urls.length,
          batches,
          submitted,
          failed: urls.length - submitted,
        });
      },
    },
  },
});
