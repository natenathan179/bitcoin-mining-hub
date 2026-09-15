import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

function isLocal(hostname: string) {
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith(".local");
}

// We moved from the .com to the .net domain. Any request that still arrives on the old
// domain (stale backlinks, bookmarks, cached search results) is 301'd to the same path on
// the new one instead of 404ing — this only fires while the old domain's DNS still points
// at this server, so the registrar/host also needs the .com forwarded here (or to .net directly).
const RETIRED_DOMAIN = "bitcoinminingdepot.com";
const CURRENT_DOMAIN = "bitcoinminingdepot.net";

// Crawlers are conservative about robots.txt and sitemaps specifically: several treat a
// redirect to a *different* domain for these files as "unreachable" and fall back to
// disallow-all, rather than following it like a normal page redirect. So these paths get
// served directly on whatever domain asked (their content already points at the current
// domain), instead of bouncing the crawler across domains first.
const CRAWL_CONTROL_PATH = /^\/(robots\.txt|sitemap[^/]*\.xml)$/;

/**
 * Canonical-origin redirect: force HTTPS, strip a leading "www.", and move requests off
 * the retired domain onto the current one, so every page has exactly one indexable URL.
 * Skipped for local/sandbox hosts, and the domain swap is skipped for robots.txt/sitemaps.
 */
function canonicalRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (isLocal(url.hostname)) return undefined;

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || url.protocol.replace(":", "");
  let changed = false;

  if (proto === "http") {
    url.protocol = "https:";
    url.port = "";
    changed = true;
  }
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    changed = true;
  }
  if (
    !CRAWL_CONTROL_PATH.test(url.pathname) &&
    (url.hostname === RETIRED_DOMAIN || url.hostname === `www.${RETIRED_DOMAIN}`)
  ) {
    url.hostname = CURRENT_DOMAIN;
    changed = true;
  }
  if (!changed) return undefined;

  return new Response(null, {
    status: 301,
    headers: {
      location: url.toString(),
      "cache-control": "public, max-age=3600",
    },
  });
}

// Blog posts retired because they duplicated a richer post on the exact same topic
// (see scripts/fix-thin-content-2026-09.ts) — 301 straight to the surviving page so
// bookmarks, backlinks and search results don't 404.
const RETIRED_BLOG_POSTS: Record<string, string> = {
  "antminer-daily-profit-how-to-calculate-it-correctly": "antminer-daily-profit-how-to-compute-it-correctly",
  "antminer-l5-profitability-is-the-old-scrypt-unit-viable": "antminer-l5-profitability-legacy-scrypt-economics",
  "antminer-d9-profitability-dash-mining-returns-modelled": "antminer-d9-profitability-and-x11-hardware-outlook",
  "antminer-l7-9050-profitability-litecoin-doge-returns": "antminer-l7-9050-profitability-full-cost-model",
  "used-asic-miner-buying-guide-grades-tests-and-prices": "used-asic-miner-buying-guide-inspection-pricing-and-risk",
  "antminer-l9-for-sale-tested-units-price-and-warranty": "antminer-l9-for-sale-availability-and-pricing",
};

function retiredBlogPostRedirect(request: Request): Response | undefined {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/);
  const target = match && RETIRED_BLOG_POSTS[match[1]!];
  if (!target) return undefined;

  url.pathname = `/blog/${target}`;
  return new Response(null, {
    status: 301,
    headers: {
      location: url.toString(),
      "cache-control": "public, max-age=3600",
    },
  });
}

function withSecurityHeaders(response: Response, request: Request): Response {
  const url = new URL(request.url);
  if (isLocal(url.hostname)) return response;

  const headers = new Headers(response.headers);
  if (!headers.has("strict-transport-security")) {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  }
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");

  // Long-lived caching for hashed build assets, short shared cache for HTML.
  if (!headers.has("cache-control")) {
    if (/^\/(_build|assets)\//.test(url.pathname) || /\.(js|css|woff2?|jpg|jpeg|png|webp|avif|svg)$/i.test(url.pathname)) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
    } else {
      headers.set("cache-control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = canonicalRedirect(request) ?? retiredBlogPostRedirect(request);
      if (redirect) return redirect;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response), request);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
