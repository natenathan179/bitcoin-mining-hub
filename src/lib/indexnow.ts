import { SITE } from "./site";

/**
 * IndexNow key. This value is public by design: it must be served as a plain
 * text file at the site root so Bing/Yandex can verify ownership.
 */
export const INDEXNOW_KEY = "07868dbbf7e885a3e3d02b7a404ae5ab";
export const INDEXNOW_KEY_LOCATION = `${SITE.url}/${INDEXNOW_KEY}.txt`;

export const INDEXNOW_SCOPES = ["all", "pages", "products", "blog", "marketplace"] as const;
export type IndexNowScope = (typeof INDEXNOW_SCOPES)[number];

/** Page counts per sitemap, kept in step with the static sitemap files. */
export const INDEXNOW_COUNTS: Record<IndexNowScope, number> = {
  pages: 25,
  products: 137,
  blog: 299,
  marketplace: 1075,
  all: 25 + 137 + 299 + 1075,
};

export type IndexNowResult = {
  scope: IndexNowScope;
  urls: number;
  batches: { count: number; status: number; ok: boolean; message: string }[];
  submitted: number;
  failed: number;
};

export type IndexNowSubmission = {
  id: string;
  scope: string;
  source: string;
  url_count: number;
  accepted: number;
  failed: number;
  message: string;
  created_at: string;
};

/** Recent submission runs, newest first. */
export async function fetchIndexNowHistory(limit = 15): Promise<IndexNowSubmission[]> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase
    .from("indexnow_submissions")
    .select("id, scope, source, url_count, accepted, failed, message, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as IndexNowSubmission[];
}


/** Ping the site's own IndexNow endpoint from the browser (admin action). */
export async function pingIndexNow(scope: IndexNowScope): Promise<IndexNowResult> {
  const res = await fetch(`/api/public/indexnow?scope=${scope}`, { method: "POST" });
  const body = (await res.json()) as IndexNowResult & { error?: string };
  if (!res.ok) throw new Error(body.error ?? "IndexNow submission failed");
  return body;
}

/** Submit a handful of specific URLs (e.g. a product that was just saved). */
export async function pingIndexNowUrls(urls: string[]): Promise<IndexNowResult> {
  const res = await fetch("/api/public/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  const body = (await res.json()) as IndexNowResult & { error?: string };
  if (!res.ok) throw new Error(body.error ?? "IndexNow submission failed");
  return body;
}
