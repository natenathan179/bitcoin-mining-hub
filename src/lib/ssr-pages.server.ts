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
  const [{ getLocationEntryAsync }, { buildPage }] = await Promise.all([
    import("./marketplace-shards"),
    import("./marketplace-page"),
  ]);
  const entry = await getLocationEntryAsync(slug);
  if (!entry) return null;
  return { page: buildPage(entry.loc), related: entry.related };
}


export async function loadBlogPage(slug: string): Promise<BlogPageData | null> {
  const [{ getPostAsync }, { getIndexEntry, relatedIndexPosts, modelCluster }] = await Promise.all([
    import("./blog-shards"),
    import("./blog-index"),
  ]);
  const entry = getIndexEntry(slug);
  const post = await getPostAsync(slug);
  if (!entry || !post) return null;
  const cl = modelCluster(post.slug, post.title, 8);
  return {
    post,
    cluster: cl
      ? {
          label: cl.label,
          query: cl.query,
          posts: cl.posts.map((p) => ({ slug: p.slug, title: p.title })),
        }
      : null,
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
