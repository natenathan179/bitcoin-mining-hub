/**
 * Regenerates the Google Merchant Center feeds (XML + CSV + TSV) from the live
 * product catalogue. Run with: bun scripts/generate-merchant-feed.ts
 *
 * The feed is optimised for Shopping / free-listing placement:
 *  - every in-stock product is included (no stale hand-maintained subset)
 *  - unique, keyword-front-loaded titles capped at 150 chars
 *  - unique descriptions (no repeated boilerplate block across items)
 *  - brand + mpn identifiers, product_highlight bullets, extra images
 *  - custom labels so campaigns can be segmented by condition/algorithm/price
 */
import { writeFileSync } from "node:fs";

import {
  buildFeedXml,
  clamp,
  feedDescription as description,
  feedHighlights as highlights,
  feedTitle,
  isFeedEligible,
  priceBand,
  FEED_SHIPPING as SHIPPING,
  type FeedProduct as Row,
} from "../src/lib/merchant-feed";

const SUPABASE_URL = "https://qdhcyorsmkzxhepdjugo.supabase.co";
const ANON = "sb_publishable_tAjtH7tA3Z0LYSVrzqYFfA_VncPruzL";
const SITE = "https://bitcoinminingdepot.com";

const products = await get<Row[]>(
  "products?select=id,name,slug,brand,hashrate,power,efficiency,algorithm,condition,stock_status,price,sale_price,short_description,description,specs,images,category_id&order=created_at.desc",
);
const cats = await get<Cat[]>("categories?select=id,name,slug");
const catName = new Map(cats.map((c) => [c.id, c.name]));

const live = products.filter(isFeedEligible);

const xml = buildFeedXml(products, catName);
const items = live;

writeFileSync("public/google-merchant-feed.xml", xml);

// Flat-file variants (same data, Merchant Center flat schema)
const cols = [
  "id","title","description","link","image_link","additional_image_link","availability","price","sale_price",
  "condition","brand","mpn","identifier_exists","google_product_category","product_type","item_group_id",
  "product_highlight","shipping","shipping_weight","custom_label_0","custom_label_1","custom_label_2",
  "custom_label_3","custom_label_4",
];
const rows = live.map((p) => {
  const images = (p.images ?? []).filter((i) => i?.startsWith("https://"));
  const isUsed = /used|refurb/i.test(p.condition);
  const gCondition = isUsed ? "used" : "new";
  return {
    id: p.slug,
    title: feedTitle(p),
    description: description(p),
    link: `${SITE}/products/${p.slug}`,
    image_link: images[0] ?? "",
    additional_image_link: images.slice(1, 11).join(","),
    availability: "in_stock",
    price: `${p.price.toFixed(2)} USD`,
    sale_price: p.sale_price && p.sale_price < p.price ? `${p.sale_price.toFixed(2)} USD` : "",
    condition: gCondition,
    brand: p.brand || "Bitcoin Mining Depot",
    mpn: p.slug.toUpperCase(),
    identifier_exists: "yes",
    google_product_category: "5710",
    product_type: `Bitcoin Mining Hardware > ${catName.get(p.category_id ?? "") ?? (isUsed ? "Used & Refurbished Miners" : "ASIC Miners")}`,
    item_group_id: `${(p.brand || "bmd").toLowerCase().replace(/\s+/g, "-")}-${gCondition}`,
    product_highlight: highlights(p).join(","),
    shipping: SHIPPING,
    shipping_weight: "15 kg",
    custom_label_0: gCondition,
    custom_label_1: p.algorithm || "SHA-256",
    custom_label_2: priceBand(p.sale_price ?? p.price),
    custom_label_3: p.brand || "other",
    custom_label_4: (p.specs ?? {})["Cooling"] || "air-cooled",
  } as Record<string, string>;
});

const csvCell = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
writeFileSync(
  "public/google-merchant-products.csv",
  [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c] ?? "")).join(","))].join("\n") + "\n",
);
writeFileSync(
  "public/google-merchant-products.tsv",
  [cols.join("\t"), ...rows.map((r) => cols.map((c) => (r[c] ?? "").replace(/[\t\n\r]+/g, " ")).join("\t"))].join("\n") +
    "\n",
);

console.log(`feed items: ${items.length} (catalogue ${products.length})`);
