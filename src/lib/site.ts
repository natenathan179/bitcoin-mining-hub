export const SITE = {
  name: "Bitcoin Mining Depot",
  domain: "bitcoinminingdepot.com",
  url: "https://bitcoinminingdepot.com",
  email: "sales@bitcoinminingdepot.com",
  phone: "+852 4719 3309",
  whatsapp: "85247193309",
  facebook: "https://www.facebook.com/share/1GubwjKqqk/",
  address: "Tower 1, Times Square, 34號 Matheson St, Causeway Bay, Hong Kong Island, Hong Kong",
  tagline: "Powering the Future of Bitcoin Mining.",
  ogImage: "https://bitcoinminingdepot.com/og-preview.jpg",
  logo: "https://bitcoinminingdepot.com/favicon.png",
  city: "Causeway Bay, Hong Kong",
  country: "Hong Kong",
  hqLine: "Headquartered in Causeway Bay, Hong Kong — shipping worldwide",
  shippingLine:
    "Global shipping from our Hong Kong warehouse to the USA, Canada, Europe, Asia, Australia, the Middle East, Latin America and Africa.",
};

/**
 * Canonical WhatsApp click-to-chat URL.
 * `wa.me` answers with a 302 to api.whatsapp.com, which SEO crawlers report as a
 * redirected / broken external link — so we link the final 200 destination directly.
 */
export function whatsappUrl(message?: string) {
  const base = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

/** Open WhatsApp from an explicit user action without publishing a crawlable external anchor. */
export function openWhatsApp(message?: string) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

/** Regions we ship to — used across the storefront so buyers always see delivery coverage. */
export const SHIPPING_REGIONS = [
  {
    name: "United States",
    detail: "DHL / FedEx express air freight, 3–7 business days, duties handled at customs clearance.",
  },
  {
    name: "Canada",
    detail:
      "Direct air freight from Hong Kong (HKG) into Vancouver, Toronto or Calgary with DHL Express, FedEx International Priority, UPS Worldwide Express and Kerry Logistics, then door delivery — including remote farm sites.",
  },

  {
    name: "Europe & UK",
    detail: "EU/UK delivery via Rotterdam, Frankfurt and London hubs with VAT/EORI documentation support.",
  },
  {
    name: "Worldwide",
    detail: "100+ countries across Asia, the Middle East, Africa, Latin America and Oceania — air or sea freight.",
  },
] as const;

/**
 * Absolute site URL with each path segment percent-encoded.
 *
 * Some marketplace city slugs contain accented characters (for example
 * `lévis`). Sitemaps list the encoded form, so canonical/og URLs must match it
 * exactly or audits report the sitemap entry as a different (incorrect) page.
 */
export function siteUrl(path: string) {
  return `${SITE.url}${encodeURI(path)}`;
}

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${SITE.email}`;

export async function submitToEmail(subject: string, payload: Record<string, string>) {
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...payload,
    }),
  });
  if (!res.ok) throw new Error("Submission failed. Please try again or email us directly.");
  return res.json();
}

/** Trim to `max` chars on a word boundary (no ellipsis — SEO titles read better clean). */
function trimToWord(value: string, max: number) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > max * 0.5 ? cut.slice(0, space) : cut).replace(/[\s\-–—|,:]+$/, "");
}

/**
 * Build a <title> that stays inside Google's ~60 character display limit.
 * Appends the brand suffix only when it still fits, otherwise the page name wins.
 */
export function seoTitle(base: string, suffix = SITE.name, max = 60) {
  const name = trimToWord(base, max);
  const withSuffix = `${name} | ${suffix}`;
  if (withSuffix.length <= max) return withSuffix;
  const short = `${name} | BMD`;
  if (short.length <= max) return short;
  return name;
}

/**
 * Build a <title> that always ends with `suffix`, so the meta title never reads
 * byte-identical to the page's own H1 (search tools flag that as duplication).
 */
export function seoPageTitle(base: string, suffix: string, max = 60) {
  const tail = ` | ${suffix}`;
  return `${trimToWord(base, Math.max(20, max - tail.length))}${tail}`;
}

/** Clamp a meta description to under 160 characters on a word boundary. */
export function seoDescription(value: string, max = 155) {
  return trimToWord(value, max);
}

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Request Quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}