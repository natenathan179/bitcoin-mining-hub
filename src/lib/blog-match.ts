// Guide matching for category and product pages.
//
// Kept in its own module so the 291-entry article index only loads on the pages
// that actually render guide links, instead of shipping in the shared bundle
// that every visitor downloads on the first page view.
import type { BlogIndexEntry as BlogPost } from "./blog-index";
import { BLOG_INDEX as BLOG_POSTS } from "./blog-index";
import type { Product } from "./data";
import { type Collection, linkSeed, modelTokens, rotatingSlice } from "./collections";

export function matchPosts(collection: Collection, limit = 12): BlogPost[] {
  const scored = BLOG_POSTS.map((post) => {
    const hay = `${post.title} ${post.description} ${post.keywords.join(" ")}`.toLowerCase();
    let score = collection.blogTerms.reduce((n, t) => (hay.includes(t) ? n + 2 : n), 0);
    if (collection.blogCategoryIds?.includes(post.categoryId)) score += 1;
    return { post, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title));
  return scored.slice(0, limit).map((s) => s.post);
}

/** Blog posts most relevant to one specific product. */
export function postsForProduct(product: Product, limit = 3): BlogPost[] {
  const tokens = modelTokens(product);
  const brand = product.brand?.toLowerCase() ?? "";
  const used = /used|refurb/i.test(product.condition);
  const scored = BLOG_POSTS.map((post) => {
    const hay = `${post.title} ${post.description} ${post.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score += t.length > 2 ? 3 : 1;
    if (brand && hay.includes(brand)) score += 3;
    if (used && /(used|refurbish|second-hand|budget)/.test(hay)) score += 2;
    if (post.categoryId === "profit" || post.categoryId === "buy") score += 1;
    return { post, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title));
  const ranked = scored.map((s) => s.post);
  if (ranked.length <= limit) return ranked;
  // Keep the two strongest topical matches, rotate the rest so deeper guides
  // also collect incoming links from product pages.
  const head = ranked.slice(0, Math.min(2, limit));
  const tail = rotatingSlice(ranked.slice(head.length), limit - head.length, linkSeed(product.slug));
  return [...head, ...tail];
}
