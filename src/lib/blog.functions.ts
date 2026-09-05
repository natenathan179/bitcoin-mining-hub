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
