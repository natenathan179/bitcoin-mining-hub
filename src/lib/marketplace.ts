// Bitcoin Mining Marketplace — the full location database.
// Only list/directory surfaces should import this module; a single location
// page loads a small shard instead (see marketplace-shards/).
import RAW from "./marketplace-locations.json";
import type { LocationType, FamilyId, MarketplaceLocation } from "./marketplace-page";

export * from "./marketplace-page";

interface RawLocation {
  s: string;
  p: string;
  c: string;
  t: LocationType;
  f: FamilyId;
  k: string;
}

export const MARKET_LOCATIONS: MarketplaceLocation[] = (RAW as RawLocation[]).map((r) => ({
  slug: r.s,
  place: r.p,
  country: r.c,
  type: r.t,
  family: r.f,
  keyword: r.k,
}));

const BY_SLUG = new Map(MARKET_LOCATIONS.map((l) => [l.slug, l]));

export function getLocation(slug: string) {
  return BY_SLUG.get(slug) ?? null;
}

export const MARKET_COUNTRIES = Array.from(
  new Set(MARKET_LOCATIONS.map((l) => l.country)),
).sort();

/** Nearby pages in the same country/family for internal linking. */
export function relatedLocations(loc: MarketplaceLocation, limit = 10) {
  const seen = new Set<string>([loc.slug]);
  const out: MarketplaceLocation[] = [];
  const push = (list: MarketplaceLocation[]) => {
    for (const l of list) {
      if (out.length >= limit || seen.has(l.slug)) continue;
      seen.add(l.slug);
      out.push(l);
    }
  };

  // Alphabetical neighbours in the same country + family (true "nearby" links).
  const same = MARKET_LOCATIONS.filter(
    (l) => l.slug !== loc.slug && l.country === loc.country && l.family === loc.family,
  );
  const i = same.findIndex((l) => l.place > loc.place);
  const centre = i === -1 ? same.length : i;
  const window = Math.max(2, Math.floor(limit * 0.6));
  push(same.slice(Math.max(0, centre - Math.floor(window / 2)), Math.max(0, centre - Math.floor(window / 2)) + window));

  // Same place, other product families.
  push(MARKET_LOCATIONS.filter((l) => l.place === loc.place && l.family !== loc.family));

  // Rotating window across the rest of the country so every city page keeps
  // collecting incoming links rather than only the alphabetical cluster.
  const countryPool = MARKET_LOCATIONS.filter((l) => l.country === loc.country);
  if (countryPool.length > 0 && out.length < limit) {
    let h = 0;
    for (let k = 0; k < loc.slug.length; k++) h = (h * 31 + loc.slug.charCodeAt(k)) % 100003;
    const start = h % countryPool.length;
    const need = limit - out.length;
    push(
      Array.from(
        { length: Math.min(need * 3, countryPool.length) },
        (_, k) => countryPool[(start + k) % countryPool.length]!,
      ),
    );
  }
  return out;
}
