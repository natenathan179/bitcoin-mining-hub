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
    const { getPost } = await import("./blog");
    return getPost(data.slug) ?? null;
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
    const [{ getPost }, { getIndexEntry, relatedIndexPosts }] = await Promise.all([
      import("./blog"),
      import("./blog-index"),
    ]);
    const entry = getIndexEntry(data.slug);
    const post = getPost(data.slug);
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
  });
