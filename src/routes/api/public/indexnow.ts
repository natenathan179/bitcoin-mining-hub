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

/** IndexNow accepts up to 10,000 URLs per request. */
const BATCH_SIZE = 10_000;
/** Safety rail: never send more than this in a single run. */
const MAX_URLS_PER_RUN = 50_000;

const bodySchema = z
  .object({ urls: z.array(z.string().url()).min(1).max(10_000).optional() })
  .optional();

function sitemapsForScope(scope: IndexNowScope) {
  if (scope === "all") return Object.values(SITEMAPS).flat();
  return SITEMAPS[scope];
}

function readSitemapUrls(scope: IndexNowScope) {
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

type Batch = Awaited<ReturnType<typeof submitBatch>>;

async function logRun(row: {
  scope: string;
  source: string;
  url_count: number;
  accepted: number;
  failed: number;
  message: string;
}) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("indexnow_submissions").insert(row as never);
  } catch {
    // History is a convenience; never fail the submission because of it.
  }
}

async function runSubmission(scope: IndexNowScope, source: string, explicit?: string[]) {
  // Only our own canonical URLs may be submitted for this host.
  const all = (explicit ?? readSitemapUrls(scope)).filter(
    (u) => u === SITE.url || u.startsWith(`${SITE.url}/`),
  );
  const urls = [...new Set(all)].slice(0, MAX_URLS_PER_RUN);

  if (!urls.length) {
    return { error: "No submittable URLs were found" as const };
  }

  const batches: Batch[] = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(await submitBatch(urls.slice(i, i + BATCH_SIZE)));
  }

  const submitted = batches.filter((b) => b.ok).reduce((sum, b) => sum + b.count, 0);
  const result = {
    scope,
    urls: urls.length,
    batches,
    submitted,
    failed: urls.length - submitted,
  };

  await logRun({
    scope,
    source,
    url_count: result.urls,
    accepted: result.submitted,
    failed: result.failed,
    message: batches.map((b) => `${b.count}: ${b.message}`).join(" | ").slice(0, 500),
  });

  return { result };
}

function cronAuthorized(request: Request) {
  const secret = process.env["INDEXNOW_CRON_SECRET"];
  if (!secret) return false;
  const url = new URL(request.url);
  const provided =
    request.headers.get("x-indexnow-secret") ??
    url.searchParams.get("token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  return provided.length === secret.length && provided === secret;
}

export const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      // Scheduled full resubmission: GET with the shared secret.
      // Without the secret it just reports the public configuration.
      GET: async ({ request }) => {
        if (cronAuthorized(request)) {
          const { result, error } = await runSubmission("all", "cron");
          if (error) return Response.json({ error }, { status: 400 });
          return Response.json(result);
        }
        return Response.json({
          key: INDEXNOW_KEY,
          keyLocation: INDEXNOW_KEY_LOCATION,
          scopes: INDEXNOW_SCOPES,
          usage: "POST /api/public/indexnow?scope=all — or POST { urls: [...] }",
        });
      },

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

        const source = cronAuthorized(request) ? "cron" : explicit ? "auto" : "admin";
        const { result, error } = await runSubmission(
          explicit ? "pages" : scope,
          source,
          explicit,
        );
        if (error) return Response.json({ error }, { status: 400 });
        return Response.json(result);
      },
    },
  },
});
