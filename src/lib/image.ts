const IMAGE_PROXY = "https://wsrv.nl/";
const FIRST_PARTY_HOSTS = ["bitcoinminingdepot.net", "supabase.co"];

/**
 * Some product photos are hosted directly on a manufacturer's own site (large,
 * uncompressed originals meant for their marketing pages, not ours) instead of our
 * own storage. Those origins are slow and outside our control, and can disappear at
 * any time. Routing them through a resizing/optimizing CDN proxy fixes both: the
 * proxy fetches the source once, then serves a resized WebP from its own fast cache
 * on every request after. First-party assets (bundled files, our own Supabase
 * storage) pass straight through untouched.
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

  const params = new URLSearchParams({
    url,
    w: String(width),
    output: "webp",
    q: "80",
    fit: "inside",
  });
  return `${IMAGE_PROXY}?${params.toString()}`;
}
