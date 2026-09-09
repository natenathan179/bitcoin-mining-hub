import { createServerFn } from "@tanstack/react-start";

import type { BlogPost } from "./blog-types";

/**
 * Fetch one full article on the server.
 *
 * The article library is roughly 2 MB of text, so it must never enter a client
 * bundle — the dynamic import inside the handler keeps it server-side while the
 * page still renders complete content for crawlers on first request.
 */
export const getBlogPostFn = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data?.slug ?? "") }))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { getPostAsync } = await import("./blog-shards");
    return await getPostAsync(data.slug);
  });

export interface BlogPageData {
  post: BlogPost;
  cluster: {
    label: string;
    query: string;
    posts: { slug: string; title: string }[];
  } | null;
  entry: {
    slug: string;
    metaTitle: string;
    description: string;
    keywords: string[];
    date: string;
  };
  related: { slug: string; title: string }[];
}

/**
 * Everything one article page needs, resolved on the server.
 *
 * The metadata index is ~150 KB, so keeping this lookup server-side means the
 * catalogue of every article never has to be downloaded to read one page.
 */
export const getBlogPageFn = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data?.slug ?? "") }))
  .handler(async ({ data }): Promise<BlogPageData | null> => {
    const [{ getPostAsync }, { getIndexEntry, relatedIndexPosts, modelCluster }] = await Promise.all([
      import("./blog-shards"),
      import("./blog-index"),
    ]);
    const entry = getIndexEntry(data.slug);
    const post = await getPostAsync(data.slug);
    if (!entry || !post) return null;
    const cl = modelCluster(post.slug, post.title, 8);
    return {
      post,
      cluster: cl
        ? { label: cl.label, query: cl.query, posts: cl.posts.map((p) => ({ slug: p.slug, title: p.title })) }
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
  });
