/**
 * Google Merchant Center feed builder.
 *
 * Shared by the static generator (scripts/generate-merchant-feed.ts) and the
 * always-fresh endpoint (/api/public/merchant-feed) so both emit identical,
 * Shopping-optimised markup: unique titles/descriptions, brand + MPN
 * identifiers, product highlights, extra images and campaign custom labels.
 */

export interface FeedProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  hashrate: string;
  power: string;
  efficiency: string;
  algorithm: string;
  condition: string;
  stock_status: string;
  price: number;
  sale_price: number | null;
  short_description: string;
  description: string;
  specs: Record<string, string> | null;
  images: string[] | null;
  category_id: string | null;
}

export const FEED_SITE = "https://bitcoinminingdepot.net";

const SHIP_COUNTRIES = [
  "US","CA","GB","IE","DE","FR","NL","BE","LU","AT","CH","IT","ES","PT","SE","NO","DK","FI","PL","CZ",
  "SK","HU","RO","GR","TR","AU","NZ","JP","KR","SG","MY","TH","VN","PH","ID","IN","HK","TW","AE","SA",
  "QA","KW","BH","OM","IL","ZA","NG","KE","EG","MA","BR","AR","CL","CO","MX","PE","UY","RU","UA","KZ",
  "GE","PK","BD","LK","NP","CN",
];
export const FEED_SHIPPING = SHIP_COUNTRIES.map((c) => `${c}:::0.00 USD`).join(",");

export const esc = (s: string) =>
  (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();

function stableHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
}

/**
 * Google Merchant Center's `id` attribute is capped at 50 characters. Most of our
 * slugs fit as-is; for the ones that don't, truncate and append a short stable hash
 * of the full slug so the id stays unique and — critically — identical on every
 * feed regeneration (Merchant Center tracks an item by this id over time, so it must
 * not change between runs).
 */
export function feedId(slug: string, max = 50): string {
  if (slug.length <= max) return slug;
  const suffix = `-${stableHash(slug)}`;
  return slug.slice(0, max - suffix.length) + suffix;
}

export function clamp(s: string, max: number) {
  const t = clean(s);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const i = cut.lastIndexOf(" ");
  return (i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[,;:\-–]$/, "") + "…";
}

export function feedTitle(p: FeedProduct) {
  const prefix = p.brand && !p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? `${p.brand} ` : "";
  const tail = p.hashrate && !p.name.includes(p.hashrate) ? ` ${p.hashrate}` : "";
  return clamp(`${prefix}${p.name}${tail}`, 148);
}

export function feedHighlights(p: FeedProduct): string[] {
  const out: string[] = [];
  if (p.hashrate) out.push(`${p.hashrate} hashrate on ${p.algorithm || "SHA-256"}`);
  if (p.power) out.push(`${p.power} power draw`);
  if (p.efficiency) out.push(`${p.efficiency} energy efficiency`);
  out.push(`${p.condition} unit, bench-tested before dispatch`);
  out.push("Ships worldwide from Hong Kong by DHL / FedEx express");
  out.push("30-day functional warranty and in-house repair support");
  const specs = p.specs ?? {};
  for (const key of ["Cooling", "Voltage", "Chip", "Noise", "Coins"]) {
    if (specs[key] && out.length < 10) out.push(`${key}: ${specs[key]}`);
  }
  return out.slice(0, 10);
}

export function feedDescription(p: FeedProduct) {
  const specs = p.specs ?? {};
  const specLine = Object.entries(specs)
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${v}`)
    .join(". ");
  const body = clean(p.description).replace(clean(p.name), "").trim();
  return clamp(
    [
      clean(p.short_description),
      specLine,
      clamp(body, 900),
      `Buy the ${p.name} from Bitcoin Mining Depot: verified ${p.condition.toLowerCase()} stock, crypto checkout, worldwide express delivery and hosting or repair support on request.`,
    ]
      .filter(Boolean)
      .join(" "),
    4900,
  );
}

export function priceBand(v: number) {
  if (v < 500) return "under-500";
  if (v < 1500) return "500-1500";
  if (v < 4000) return "1500-4000";
  if (v < 10000) return "4000-10000";
  return "10000-plus";
}

export function isFeedEligible(p: FeedProduct) {
  return p.stock_status !== "Out of Stock" && (p.images?.length ?? 0) > 0 && p.price > 0;
}

export function buildFeedItem(p: FeedProduct, categoryName?: string) {
  const images = (p.images ?? []).filter((i) => i?.startsWith("https://"));
  const isUsed = /used|refurb/i.test(p.condition);
  const gCondition = isUsed ? "used" : "new";
  const type = `Bitcoin Mining Hardware > ${categoryName ?? (isUsed ? "Used & Refurbished Miners" : "ASIC Miners")}`;
  const fields = [
    `<g:id>${esc(feedId(p.slug))}</g:id>`,
    `<g:title>${esc(feedTitle(p))}</g:title>`,
    `<g:description>${esc(feedDescription(p))}</g:description>`,
    `<g:link>${FEED_SITE}/products/${esc(p.slug)}</g:link>`,
    `<g:image_link>${esc(images[0] ?? "")}</g:image_link>`,
    ...images.slice(1, 11).map((i) => `<g:additional_image_link>${esc(i)}</g:additional_image_link>`),
    `<g:availability>in_stock</g:availability>`,
    `<g:price>${p.price.toFixed(2)} USD</g:price>`,
    ...(p.sale_price && p.sale_price < p.price
      ? [`<g:sale_price>${p.sale_price.toFixed(2)} USD</g:sale_price>`]
      : []),
    `<g:condition>${gCondition}</g:condition>`,
    `<g:brand>${esc(p.brand || "Bitcoin Mining Depot")}</g:brand>`,
    `<g:mpn>${esc(p.slug.toUpperCase())}</g:mpn>`,
    `<g:identifier_exists>yes</g:identifier_exists>`,
    `<g:google_product_category>5710</g:google_product_category>`,
    `<g:product_type>${esc(type)}</g:product_type>`,
    `<g:item_group_id>${esc((p.brand || "bmd").toLowerCase().replace(/\s+/g, "-"))}-${gCondition}</g:item_group_id>`,
    ...feedHighlights(p).map((h) => `<g:product_highlight>${esc(h)}</g:product_highlight>`),
    `<g:shipping>${FEED_SHIPPING}</g:shipping>`,
    `<g:min_handling_time>1</g:min_handling_time>`,
    `<g:max_handling_time>3</g:max_handling_time>`,
    `<g:min_transit_time>3</g:min_transit_time>`,
    `<g:max_transit_time>12</g:max_transit_time>`,
    `<g:shipping_weight>15 kg</g:shipping_weight>`,
    `<g:product_detail>${esc(
      Object.entries(p.specs ?? {})
        .map(([k, v]) => `${k}:${v}`)
        .join(", "),
    )}</g:product_detail>`,
    `<g:custom_label_0>${esc(gCondition)}</g:custom_label_0>`,
    `<g:custom_label_1>${esc(p.algorithm || "SHA-256")}</g:custom_label_1>`,
    `<g:custom_label_2>${priceBand(p.sale_price ?? p.price)}</g:custom_label_2>`,
    `<g:custom_label_3>${esc(p.brand || "other")}</g:custom_label_3>`,
    `<g:custom_label_4>${esc((p.specs ?? {})["Cooling"] || "air-cooled")}</g:custom_label_4>`,
  ];
  return `  <item>\n    ${fields.join("\n    ")}\n  </item>`;
}

export function buildFeedXml(products: FeedProduct[], categoryNames: Map<string, string>) {
  const items = products
    .filter(isFeedEligible)
    .map((p) => buildFeedItem(p, categoryNames.get(p.category_id ?? "")));
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Bitcoin Mining Depot — ASIC Miner Product Feed</title>
  <link>${FEED_SITE}</link>
  <description>New, used and refurbished ASIC Bitcoin, Litecoin, Kaspa and Monero miners shipped worldwide from Hong Kong.</description>
${items.join("\n")}
</channel>
</rss>
`;
}
