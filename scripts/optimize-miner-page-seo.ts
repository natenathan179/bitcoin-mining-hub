/**
 * Optimises title tags, meta descriptions and keyword sets for the Antminer
 * S21 / S23 / S19 guide pages so each targets its exact keyword.
 *
 * Rewrites src/lib/blog.ts (description + keywords) and src/lib/blog-index.ts
 * (metaTitle + description + keywords) in place.
 */
import { readFileSync, writeFileSync } from "node:fs";

const BLOG = "src/lib/blog.ts";
const INDEX = "src/lib/blog-index.ts";

type Entry = Record<string, any>;

function readArray(file: string, marker: string): { head: string; arr: Entry[]; tail: string } {
  const src = readFileSync(file, "utf8");
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`marker not found in ${file}`);
  const open = src.indexOf("= [", start) + 2;
  // find matching bracket
  let depth = 0;
  let end = -1;
  let inStr = false;
  let esc = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i]!;
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) throw new Error("unbalanced array");
  return {
    head: src.slice(0, open),
    arr: (new Function(`return ${src.slice(open, end + 1)}`)() as Entry[]),
    tail: src.slice(end + 1),
  };
}

/* ------------------------------- model logic ------------------------------ */

const MODEL_RE =
  /\b(s23e?|s21e?|s19)\s*(xp\+?|pro\+?|\+|j\s*pro\+?)?\s*(hydro|hyd|immersion)?\b/i;

function normalizeModel(title: string): { family: "s23" | "s21" | "s19"; model: string } | null {
  const m = MODEL_RE.exec(title);
  if (!m) return null;
  const core = m[1]!.toLowerCase();
  const family = (core.startsWith("s23") ? "s23" : core.startsWith("s21") ? "s21" : "s19") as
    | "s23"
    | "s21"
    | "s19";
  const variant = (m[2] ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  const cooling = (m[3] ?? "").toLowerCase() === "hyd" ? "hydro" : (m[3] ?? "").toLowerCase();
  const parts = ["antminer", core, variant, cooling].filter(Boolean);
  return { family, model: parts.join(" ").replace(/\s+/g, " ").trim() };
}

const STOP = new Set([
  "and",
  "or",
  "the",
  "a",
  "an",
  "for",
  "with",
  "vs",
  "in",
  "at",
  "of",
  "to",
  "is",
  "it",
  "&",
  "every",
  "real",
]);

function trimDangling(s: string): string {
  let out = s.trim().replace(/[\s,:;\-–—/]+$/, "");
  for (;;) {
    const words = out.split(/\s+/);
    const last = words[words.length - 1]!.toLowerCase().replace(/[^a-z&+]/g, "");
    if (words.length > 3 && STOP.has(last)) {
      words.pop();
      out = words.join(" ").replace(/[\s,:;\-–—/]+$/, "");
      continue;
    }
    break;
  }
  return out;
}

function clampTitle(title: string, limit = 60): string {
  const suffixes = [" | Bitcoin Mining Depot", " | BMD Guide", " | BMD", ""];
  for (const suffix of suffixes) {
    if (title.length + suffix.length <= limit) return `${title}${suffix}`;
  }
  // Title itself is too long: drop the sub-clause after the colon first.
  const colon = title.indexOf(":");
  if (colon > 12) {
    const lead = trimDangling(title.slice(0, colon));
    if (lead.length + 6 <= limit) return `${lead} | BMD`;
    if (lead.length <= limit) return lead;
  }
  let cut = title.slice(0, limit + 1);
  cut = cut.slice(0, cut.lastIndexOf(" "));
  return trimDangling(cut);
}

function buildMetaTitle(title: string, model: string): string {
  const hasModel = title.toLowerCase().includes(model.replace(/^antminer /, ""));
  const base = hasModel ? title : `${title} (${model})`;
  const out = clampTitle(base);
  // Never lose the exact model token from the title tag.
  if (!out.toLowerCase().includes(model.split(" ")[1]!)) return clampTitle(model.replace(/\b\w/g, (c) => c.toUpperCase()) + ": " + title);
  return out;
}

const CTAS = [
  "In stock at Bitcoin Mining Depot, air-freighted worldwide from Hong Kong.",
  "Bench-tested units in stock now, shipped worldwide from Hong Kong.",
  "Compare live prices and buy verified units from Bitcoin Mining Depot.",
  "See current pricing and verified stock at Bitcoin Mining Depot.",
];

function buildDescription(raw: string, model: string, i: number): string {
  const pretty = model.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/Xp/g, "XP").replace(/Hyd\b/, "Hyd");
  let d = raw.replace(/\s+/g, " ").trim();
  if (!d.toLowerCase().includes(model.split(" ").slice(1).join(" "))) {
    d = `${pretty}: ${d}`;
  }
  if (d.length < 120) {
    d = `${d} ${CTAS[i % CTAS.length]}`.trim();
  }
  if (d.length > 155) {
    let cut = d.slice(0, 156);
    const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" — "));
    cut = stop > 100 ? cut.slice(0, stop + 1) : trimDangling(cut.slice(0, cut.lastIndexOf(" ")));
    d = cut;
  }
  if (!/[.?!]$/.test(d)) d = `${d}.`;
  return d;
}

function buildKeywords(model: string, existing: string[], title: string): string[] {
  const bare = model.replace(/^antminer /, "");
  const generic = existing.filter((k) => k.split(" ").length > 1 && /s19|s21|s23|antminer|bitmain|whatsminer/i.test(k));
  const out = [
    model,
    bare,
    `${model} price`,
    `${model} for sale`,
    `bitmain ${model}`,
    `used ${model}`,
    ...generic,
    "asic miner for sale",
  ];
  if (/profitab/i.test(title)) out.splice(3, 0, `${model} profitability`);
  if (/spec/i.test(title)) out.splice(3, 0, `${model} specs`);
  const seen = new Set<string>();
  return out
    .map((k) => k.toLowerCase().replace(/\s+/g, " ").trim())
    .filter((k) => k && !seen.has(k) && seen.add(k))
    .slice(0, 8);
}

/* --------------------------------- rewrite -------------------------------- */

const blog = readArray(BLOG, "export const BLOG_POSTS");
const index = readArray(INDEX, "export const BLOG_INDEX");
const bySlug = new Map(blog.arr.map((p) => [p.slug as string, p]));

let touched = 0;
index.arr.forEach((e, i) => {
  const info = normalizeModel(e.title as string);
  if (!info) return;
  const post = bySlug.get(e.slug as string);
  const metaTitle = buildMetaTitle(e.title as string, info.model);
  const description = buildDescription(e.description as string, info.model, i);
  const keywords = buildKeywords(info.model, (e.keywords as string[]) ?? [], e.title as string);
  e.metaTitle = metaTitle;
  e.description = description;
  e.keywords = keywords;
  if (post) {
    post.description = description;
    post.keywords = keywords;
  }
  touched++;
});

// Guarantee unique title tags across the whole library.
const used = new Map<string, string>();
for (const e of index.arr) {
  let t = e.metaTitle as string;
  if (used.has(t.toLowerCase()) && used.get(t.toLowerCase()) !== e.slug) {
    const tail = (e.slug as string).split("-").slice(-2).join(" ").replace(/\b\w/g, (c) => c.toUpperCase());
    t = clampTitle(`${(e.title as string)} ${tail}`);
    e.metaTitle = t;
  }
  used.set((e.metaTitle as string).toLowerCase(), e.slug as string);
}

writeFileSync(BLOG, blog.head + JSON.stringify(blog.arr, null, 2) + blog.tail);
writeFileSync(INDEX, index.head + JSON.stringify(index.arr, null, 2) + index.tail);

const long = index.arr.filter((e) => (e.metaTitle as string).length > 60).length;
const badDesc = index.arr.filter((e) => (e.description as string).length > 155).length;
console.log(`optimised ${touched} miner pages; titles>60: ${long}; descriptions>155: ${badDesc}`);
