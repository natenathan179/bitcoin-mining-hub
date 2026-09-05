/**
 * Titles and descriptions for query-string variants of an index page.
 *
 * Crawlers regularly discover parameterised versions of listing pages
 * (`?page=2`, `?category=…`, `?sort=price`). Serving those the page-one title
 * verbatim shows up in SEO audits as duplicate title tags, so each variant gets
 * its own title/description and is kept out of the index while still pointing at
 * the clean URL as the preferred version.
 */
export interface IndexSearch {
  page?: number;
  q?: string;
  category?: string;
  sort?: string;
  country?: string;
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

export function parseIndexSearch(search: Record<string, unknown>): IndexSearch {
  const page = Number(search.page);
  return {
    page: Number.isFinite(page) && page > 1 ? Math.floor(page) : undefined,
    q: str(search.q),
    category: str(search.category),
    sort: str(search.sort),
    country: str(search.country),
  };
}

const titleCase = (v: string) =>
  v
    .replace(/[-_+]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

/** Human-readable label for the active parameters, or "" when there are none. */
export function indexSearchLabel(search: IndexSearch | undefined): string {
  if (!search) return "";
  const parts: string[] = [];
  if (search.category) parts.push(titleCase(search.category));
  if (search.q) parts.push(`"${search.q}"`);
  if (search.country) parts.push(titleCase(search.country));
  if (search.sort) parts.push(`sorted by ${titleCase(search.sort)}`);
  if (search.page) parts.push(`page ${search.page}`);
  return parts.join(" · ");
}

/** Returns unique meta for a filtered/paginated variant, or null for the clean URL. */
export function indexVariantMeta(
  base: { title: string; description: string },
  search: IndexSearch | undefined,
): { title: string; description: string; robots: string } | null {
  const label = indexSearchLabel(search);
  if (!label) return null;
  const shortBase = base.title.split("|")[0]?.trim() ?? base.title;
  return {
    title: `${shortBase} — ${label}`.slice(0, 120),
    description: `${label} of ${shortBase.toLowerCase()}. ${base.description}`.slice(0, 300),
    robots: "noindex, follow",
  };
}
