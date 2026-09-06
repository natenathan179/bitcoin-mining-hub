/**
 * Server-side page builders used directly by route loaders during SSR.
 *
 * Rendering a blog or marketplace page used to call a server function, which is
 * an internal HTTP round-trip back into the same worker. With ~1,600 crawlable
 * URLs, an audit crawler walking the site in parallel exhausts those internal
 * subrequests and the failed ones render as HTTP 5xx — which then also count as
 * broken internal links on every page that links to them.
 *
 * On the server we skip the round-trip entirely and build the page from the
 * local data modules. Client-side navigation still uses the server functions.
 * The `.server.ts` filename keeps this module out of every client bundle.
 */
import type { BlogPageData } from "./blog.functions";
import type { MarketplacePageData } from "./marketplace.functions";

export async function loadMarketplacePage(slug: string): Promise<MarketplacePageData | null> {
  const { getLocation, buildPage, relatedLocations } = await import("./marketplace");
  const loc = getLocation(slug);
  if (!loc) return null;
  return {
    page: buildPage(loc),
    related: relatedLocations(loc, 12).map((r) => ({ slug: r.slug, keyword: r.keyword })),
  };
}

export async function loadBlogPage(slug: string): Promise<BlogPageData | null> {
  const [{ getPost }, { getIndexEntry, relatedIndexPosts }] = await Promise.all([
    import("./blog"),
    import("./blog-index"),
  ]);
  const entry = getIndexEntry(slug);
  const post = getPost(slug);
  if (!entry || !post) return null;
  return {
    post,
    entry: {
      slug: entry.slug,
      metaTitle: entry.metaTitle,
      description: entry.description,
      keywords: entry.keywords,
      date: entry.date,
    },
    related: relatedIndexPosts(post.slug, post.categoryId, 6).map((r) => ({
      slug: r.slug,
      title: r.title,
    })),
  };
}
