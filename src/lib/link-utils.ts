// Small internal-linking helpers, deliberately dependency-free so pages can use
// them without pulling in the category or article datasets.
import type { Product } from "./data";

/* ---------------- internal linking helpers ---------------- */

const STOP = new Set(["miner", "bitcoin", "asic", "for", "sale", "the", "and", "with", "pro", "th/s"]);

/** Distinctive model tokens from a product name, e.g. "s21", "xp", "hyd". */
export function modelTokens(product: Product): string[] {
  return Array.from(
    new Set(
      `${product.name} ${product.brand}`
        .toLowerCase()
        .replace(/[^a-z0-9+ ]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1 && !STOP.has(t)),
    ),
  );
}

/** Descriptive anchor text for a product link — good for keyword-rich internal links. */
export function productAnchor(product: Product): string {
  const bits = [product.hashrate, product.efficiency].filter(Boolean).join(" · ");
  return bits ? `${product.name} (${bits})` : product.name;
}

/** Stable numeric seed from a string, used to rotate internal-link windows. */
export function linkSeed(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) % 100003;
  return h;
}

/**
 * Rotating window over a list: each page links a different slice, so link equity
 * reaches every page instead of piling on the first few entries.
 */
export function rotatingSlice<T>(items: T[], count: number, seed: number): T[] {
  if (items.length === 0 || count <= 0) return [];
  const n = Math.min(count, items.length);
  const start = ((seed % items.length) + items.length) % items.length;
  return Array.from({ length: n }, (_, k) => items[(start + k) % items.length]!);
}
