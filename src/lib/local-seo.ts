// Local search layer for product pages.
//
// Each product page publishes (a) a deterministic set of city and state
// marketplace listings it can be delivered into, (b) locally written delivery
// copy per country, and (c) Google Business Profile / LocalBusiness data for the
// Hong Kong showroom that fulfils the order. Selection is deterministic per
// product slug so the SSR output is stable for crawlers and so every
// marketplace location keeps receiving inbound links.
import type { Product } from "./data";
import { linkSeed, rotatingSlice } from "./collections";
import { MARKET_LOCATIONS, type FamilyId, type MarketplaceLocation } from "./marketplace";
import { SITE } from "./site";

/** Countries we surface on product pages, in demand order. */
const PRIORITY_COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Netherlands",
  "Australia",
  "Austria",
  "Belgium",
];

/** Locally specific delivery sentence per country — no generic boilerplate. */
const COUNTRY_COPY: Record<string, string> = {
  "United States":
    "Express air freight from Hong Kong into Los Angeles, Chicago or Memphis, then courier to your city, typically 3–7 business days with duty itemised before payment.",
  Canada:
    "Cleared through Vancouver or Toronto and delivered to your address or hosting facility, usually 4–8 business days with GST/HST calculated up front.",
  "United Kingdom":
    "Air freight into Heathrow or East Midlands with UK VAT and EORI paperwork prepared, then next-day domestic delivery.",
  Germany:
    "Frankfurt clearance with EU import VAT and EORI documentation prepared in advance, then road delivery across Germany.",
  Netherlands:
    "Schiphol air freight or Rotterdam consolidation, with EU VAT paperwork ready so clearance is never the bottleneck.",
  Australia:
    "Air freight into Sydney, Melbourne or Perth with GST and quarantine documents handled by our freight desk.",
  Austria:
    "EU clearance via Frankfurt or Vienna with import VAT paperwork prepared, then road delivery to your site.",
  Belgium:
    "Brussels or Liège air freight with EU VAT and EORI documents supplied, then same-week road delivery.",
};

export function countryCopy(country: string) {
  return (
    COUNTRY_COPY[country] ??
    `Air freight from our Hong Kong warehouse into ${country} with full commercial invoice and customs documentation, typically 4–9 business days door to door.`
  );
}

function familyFor(product: Product): FamilyId {
  const text = `${product.name} ${product.algorithm}`.toLowerCase();
  if (/equihash|zcash|z15|zec/.test(text)) return "z15";
  if (/s23|s21|hyd/.test(text)) return "s23";
  return "asic";
}

export interface LocalCountryGroup {
  country: string;
  copy: string;
  cities: MarketplaceLocation[];
  regions: MarketplaceLocation[];
}

/**
 * Deterministic city/region listings for a product, grouped by country.
 * The rotating window is keyed on the product slug so different products expose
 * different locations and the whole marketplace set stays internally linked.
 */
export function localListingsForProduct(product: Product, perCountry = 6): LocalCountryGroup[] {
  const family = familyFor(product);
  const seed = linkSeed(product.slug);

  return PRIORITY_COUNTRIES.map((country, index) => {
    const pool = MARKET_LOCATIONS.filter((l) => l.country === country);
    const preferred = pool.filter((l) => l.family === family);
    const base = preferred.length >= perCountry ? preferred : pool;
    const regionPool = pool.filter((l) => l.type === "state");
    // Some countries in the location database are indexed by state/province only —
    // fall back to those so every country block lists a usable set of places.
    const cityPool = base.filter((l) => l.type === "city");
    const primary = cityPool.length ? cityPool : base;
    return {
      country,
      copy: countryCopy(country),
      cities: rotatingSlice(primary, perCountry, seed + index * 17),
      regions: cityPool.length ? rotatingSlice(regionPool, 2, seed * 3 + index * 11) : [],
    };
  }).filter((group) => group.cities.length > 0 || group.regions.length > 0);
}

/** Flat list of "City, Country" strings for schema `areaServed` and meta copy. */
export function servedAreaNames(groups: LocalCountryGroup[], limit = 40) {
  const names: string[] = [];
  for (const group of groups) {
    for (const location of [...group.cities, ...group.regions]) {
      names.push(`${location.place}, ${group.country}`);
      if (names.length >= limit) return names;
    }
  }
  return names;
}

/** Google Business Profile / storefront facts used in copy and LocalBusiness JSON-LD. */
export const BUSINESS = {
  name: SITE.name,
  street: "Tower 1, Times Square, 34 Matheson Street",
  district: "Causeway Bay",
  locality: "Hong Kong Island",
  region: "Hong Kong",
  postalCode: "999077",
  countryCode: "HK",
  latitude: 22.2783,
  longitude: 114.1827,
  hours: "Monday to Saturday, 09:00–19:00 HKT (UTC+8)",
  priceRange: "$$$",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Times%20Square%2C%2034%20Matheson%20St%2C%20Causeway%20Bay%2C%20Hong%20Kong",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Times%20Square%2C%2034%20Matheson%20St%2C%20Causeway%20Bay%2C%20Hong%20Kong",
} as const;

/** LocalBusiness (Store) JSON-LD for a product page, scoped to the served areas. */
export function localBusinessSchema(product: Product, areaNames: string[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE.url}/#store`,
    name: BUSINESS.name,
    url: SITE.url,
    image: SITE.ogImage,
    logo: SITE.logo,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: "Bitcoin, USDT, Ethereum, Litecoin",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${BUSINESS.street}, ${BUSINESS.district}`,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    hasMap: BUSINESS.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [SITE.facebook],
    areaServed: areaNames.map((name) => ({ "@type": "Place", name })),
    makesOffer: {
      "@type": "Offer",
      url: pageUrl,
      itemOffered: {
        "@type": "Product",
        name: product.name,
        url: pageUrl,
        image: (product.images ?? []).filter((i) => i?.startsWith("https://")).slice(0, 1),
        brand: { "@type": "Brand", name: product.brand },
        description:
          product.short_description ||
          `${product.name} in stock at ${SITE.name}, shipped worldwide from Hong Kong.`,
        // Every Product node needs its own offers for Google's Product snippets.
        offers: {
          "@type": "Offer",
          url: pageUrl,
          priceCurrency: "USD",
          price: product.sale_price ?? product.price,
          availability: "https://schema.org/InStock",
          itemCondition: /new/i.test(product.condition ?? "")
            ? "https://schema.org/NewCondition"
            : "https://schema.org/RefurbishedCondition",
          seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
        },
      },
      priceCurrency: "USD",
      price: product.sale_price ?? product.price,
      availability: "https://schema.org/InStock",
      itemCondition: /new/i.test(product.condition ?? "")
        ? "https://schema.org/NewCondition"
        : "https://schema.org/RefurbishedCondition",
      availableAtOrFrom: { "@type": "Place", name: `${BUSINESS.district}, ${BUSINESS.region}` },
    },


  };
}
