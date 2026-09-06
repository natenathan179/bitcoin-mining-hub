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

const SUPABASE_URL = "https://qdhcyorsmkzxhepdjugo.supabase.co";
const ANON = "sb_publishable_tAjtH7tA3Z0LYSVrzqYFfA_VncPruzL";
const SITE = "https://bitcoinminingdepot.com";

const SHIP_COUNTRIES = [
  "US","CA","GB","IE","DE","FR","NL","BE","LU","AT","CH","IT","ES","PT","SE","NO","DK","FI","PL","CZ",
  "SK","HU","RO","GR","TR","AU","NZ","JP","KR","SG","MY","TH","VN","PH","ID","IN","HK","TW","AE","SA",
  "QA","KW","BH","OM","IL","ZA","NG","KE","EG","MA","BR","AR","CL","CO","MX","PE","UY","RU","UA","KZ",
  "GE","PK","BD","LK","NP","CN",
];
const SHIPPING = SHIP_COUNTRIES.map((c) => `${c}:::0.00 USD`).join(",");

interface Row {
  id: string; name: string; slug: string; brand: string; hashrate: string; power: string;
  efficiency: string; algorithm: string; condition: string; stock_status: string;
  price: number; sale_price: number | null; short_description: string; description: string;
  specs: Record<string, string> | null; images: string[] | null; category_id: string | null;
}
interface Cat { id: string; name: string; slug: string }

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clean = (s: string) => (s || "").replace(/\s+/g, " ").trim();

function clamp(s: string, max: number) {
  const t = clean(s);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const i = cut.lastIndexOf(" ");
  return (i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[,;:\-–]$/, "") + "…";
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

function highlights(p: Row): string[] {
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

function description(p: Row): string {
  const specs = p.specs ?? {};
  const specLine = Object.entries(specs)
    .slice(0, 8)
    .map(([k, v]) => `${k}: ${v}`)
    .join(". ");
  const body = clean(p.description).replace(clean(p.name), "").trim();
  const unique = [
    clean(p.short_description),
    specLine,
    clamp(body, 900),
    `Buy the ${p.name} from Bitcoin Mining Depot: verified ${p.condition.toLowerCase()} stock, crypto checkout, worldwide express delivery and hosting or repair support on request.`,
  ]
    .filter(Boolean)
    .join(" ");
  return clamp(unique, 4900);
}

function priceBand(v: number) {
  if (v < 500) return "under-500";
  if (v < 1500) return "500-1500";
  if (v < 4000) return "1500-4000";
  if (v < 10000) return "4000-10000";
  return "10000-plus";
}

const products = await get<Row[]>(
  "products?select=id,name,slug,brand,hashrate,power,efficiency,algorithm,condition,stock_status,price,sale_price,short_description,description,specs,images,category_id&order=created_at.desc",
);
const cats = await get<Cat[]>("categories?select=id,name,slug");
const catName = new Map(cats.map((c) => [c.id, c.name]));

const live = products.filter(
  (p) => p.stock_status !== "Out of Stock" && (p.images?.length ?? 0) > 0 && p.price > 0,
);

const items = live.map((p) => {
  const images = (p.images ?? []).filter((i) => i?.startsWith("https://"));
  const isUsed = /used|refurb/i.test(p.condition);
  const gCondition = isUsed ? "used" : "new";
  const title = clamp(
    `${p.brand && !p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? `${p.brand} ` : ""}${p.name}${p.hashrate && !p.name.includes(p.hashrate) ? ` ${p.hashrate}` : ""}`,
    148,
  );
  const type = `Bitcoin Mining Hardware > ${catName.get(p.category_id ?? "") ?? (isUsed ? "Used & Refurbished Miners" : "ASIC Miners")}`;
  const fields: string[] = [
    `<g:id>${esc(p.slug)}</g:id>`,
    `<g:title>${esc(title)}</g:title>`,
    `<g:description>${esc(description(p))}</g:description>`,
    `<g:link>${SITE}/products/${esc(p.slug)}</g:link>`,
    `<g:image_link>${esc(images[0])}</g:image_link>`,
    ...images.slice(1, 11).map((i) => `<g:additional_image_link>${esc(i)}</g:additional_image_link>`),
    `<g:availability>in_stock</g:availability>`,
    `<g:price>${p.price.toFixed(2)} USD</g:price>`,
    ...(p.sale_price && p.sale_price < p.price ? [`<g:sale_price>${p.sale_price.toFixed(2)} USD</g:sale_price>`] : []),
    `<g:condition>${gCondition}</g:condition>`,
    `<g:brand>${esc(p.brand || "Bitcoin Mining Depot")}</g:brand>`,
    `<g:mpn>${esc(p.slug.toUpperCase())}</g:mpn>`,
    `<g:identifier_exists>yes</g:identifier_exists>`,
    `<g:google_product_category>5710</g:google_product_category>`,
    `<g:product_type>${esc(type)}</g:product_type>`,
    `<g:item_group_id>${esc((p.brand || "bmd").toLowerCase().replace(/\s+/g, "-"))}-${gCondition}</g:item_group_id>`,
    ...highlights(p).map((h) => `<g:product_highlight>${esc(h)}</g:product_highlight>`),
    `<g:shipping>${SHIPPING}</g:shipping>`,
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
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Bitcoin Mining Depot — ASIC Miner Product Feed</title>
  <link>${SITE}</link>
  <description>New, used and refurbished ASIC Bitcoin, Litecoin, Kaspa and Monero miners shipped worldwide from Hong Kong.</description>
${items.join("\n")}
</channel>
</rss>
`;
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
    title: clamp(`${p.brand && !p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? `${p.brand} ` : ""}${p.name}`, 148),
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
