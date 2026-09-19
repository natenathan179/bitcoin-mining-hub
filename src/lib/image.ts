const FIRST_PARTY_HOSTS = ["bitcoinminingdepot.net", "supabase.co"];

/**
 * Some product photos are hosted directly on a manufacturer's own site (large,
 * uncompressed originals meant for their marketing pages, not ours) instead of our
 * own storage. Those origins are slow and outside our control, and can disappear at
 * any time. Routing them through our own /api/public/img resizing proxy (which in
 * turn fetches from wsrv.nl server-side) fixes both: the proxy fetches the source
 * once, then serves a resized WebP from its own fast cache on every request after.
 * First-party assets (bundled files, our own Supabase storage) pass straight
 * through untouched.
 *
 * The resize request goes through our own origin rather than wsrv.nl directly
 * because wsrv.nl's robots.txt disallows every URL with a query string, which
 * blocked crawlers from every proxied product image on every page.
 */
export function optimizeImageUrl(url: string | null | undefined, width = 800): string {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:")) return url;

  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return url;
  }
  if (FIRST_PARTY_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))) return url;

  const params = new URLSearchParams({ url, w: String(width) });
  return `/api/public/img?${params.toString()}`;
}
