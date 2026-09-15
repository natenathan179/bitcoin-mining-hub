import { createFileRoute } from "@tanstack/react-router";

import { buildFeedXml, type FeedProduct } from "@/lib/merchant-feed";

// Cloudflare binds the runtime secret as plain SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY;
// VITE_-prefixed names only exist for client-bundle build-time replacement (see
// src/integrations/supabase/client.ts, which uses this same fallback order).
const SUPABASE_URL = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? "";
const SUPABASE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? "";

const PRODUCT_COLUMNS =
  "id,name,slug,brand,hashrate,power,efficiency,algorithm,condition,stock_status,price,sale_price,short_description,description,specs,images,category_id";

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Supabase read failed [${res.status}]: ${await res.text()}`);
  return (await res.json()) as T;
}

/**
 * Always-fresh Google Merchant Center feed. Point the Merchant Center scheduled
 * fetch at this URL so new stock, price and availability changes reach Shopping
 * without regenerating a static file.
 */
export const Route = createFileRoute("/api/public/merchant-feed")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [products, categories] = await Promise.all([
            rest<FeedProduct[]>(`products?select=${PRODUCT_COLUMNS}&order=created_at.desc`),
            rest<{ id: string; name: string }[]>("categories?select=id,name"),
          ]);
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
