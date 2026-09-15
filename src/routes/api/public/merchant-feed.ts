import { createFileRoute } from "@tanstack/react-router";

import { buildFeedXml } from "@/lib/merchant-feed";
import { fetchCategories, fetchProductsFull } from "@/lib/data";

/**
 * Always-fresh Google Merchant Center feed. Point the Merchant Center scheduled
 * fetch at this URL so new stock, price and availability changes reach Shopping
 * without regenerating a static file.
 *
 * Reuses the same Supabase client and data functions the product pages already
 * rely on (src/lib/data.ts) instead of re-reading env vars separately here --
 * this route previously read process.env["VITE_SUPABASE_URL"] directly, which
 * is empty in production (the platform binds the runtime secret as plain
 * SUPABASE_URL; VITE_-prefixed names are only for client-bundle build-time
 * replacement), so every request threw and the endpoint always 503'd.
 */
export const Route = createFileRoute("/api/public/merchant-feed")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [products, categories] = await Promise.all([fetchProductsFull(), fetchCategories()]);
          const xml = buildFeedXml(products, new Map(categories.map((c) => [c.id, c.name])));
          return new Response(xml, {
            headers: {
              "content-type": "application/xml; charset=utf-8",
              "cache-control": "public, max-age=1800, s-maxage=1800",
            },
          });
        } catch (error) {
          console.error("[merchant-feed] generation failed", error);
          return new Response("Feed temporarily unavailable", { status: 503 });
        }
      },
    },
  },
});
