import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import {
  MARKET_COUNTRIES,
  MARKET_FAMILY_LIST,
  MARKET_LOCATIONS,
  type FamilyId,
} from "@/lib/marketplace";
import { SITE } from "@/lib/site";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";

export const Route = createFileRoute("/bitcoin-mining-marketplace/")({
  head: () => ({
    meta: [
      { title: "Bitcoin Mining Marketplace | Buy ASIC Miners Near You" },
      {
        name: "description",
        content:
          "Buy ASIC miners, the Bitmain Antminer S23 and Antminer Z15 Pro in 1,000+ cities and states across the USA, Canada, UK, Europe and Australia — shipped worldwide from Hong Kong.",
      },
      { property: "og:title", content: "Bitcoin Mining Marketplace | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "Location-by-location buying guides with live pricing, shipping lanes, duty guidance and in-stock ASIC mining hardware for your city or state.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE.url}/bitcoin-mining-marketplace` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/bitcoin-mining-marketplace` }],
  }),
  component: MarketplaceIndex,
});

function MarketplaceIndex() {
  const [country, setCountry] = useState<string>("all");
  const [family, setFamily] = useState<FamilyId | "all">("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return MARKET_LOCATIONS.filter((l) => {
      if (country !== "all" && l.country !== country) return false;
      if (family !== "all" && l.family !== family) return false;
      if (term && !`${l.place} ${l.country} ${l.keyword}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [country, family, q]);

  // Keep the interactive grid small: the full crawlable directory further down the page
  // already ships every location link, so a large slice here only slows mobile rendering.
  const shown = rows.slice(0, 60);

  // Every location grouped by country — rendered unfiltered so all links ship in the HTML.
  const directory = useMemo(() => {
    const groups = new Map<string, typeof MARKET_LOCATIONS>();
    for (const l of MARKET_LOCATIONS) {
      const list = groups.get(l.country) ?? [];
      list.push(l);
      groups.set(l.country, list);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bitcoin Mining Marketplace",
    url: `${SITE.url}/bitcoin-mining-marketplace`,
    description:
      "Location-targeted buying pages for ASIC miners, the Bitmain Antminer S23 and the Antminer Z15 Pro across the USA, Canada, UK, Europe and Australia.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: SITE.logo },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: MARKET_LOCATIONS.length,
      itemListElement: MARKET_LOCATIONS.slice(0, 50).map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.keyword,
        url: `${SITE.url}/bitcoin-mining-marketplace/${l.slug}`,
      })),
    },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Marketplace"
        title="Bitcoin Mining Marketplace"
        subtitle={`${MARKET_LOCATIONS.length} location buying guides for ASIC miners, the Bitmain Antminer S23 and the Antminer Z15 Pro — with local pricing, shipping lanes, duty guidance and in-stock hardware you can order today.`}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {MARKET_FAMILY_LIST.map((f) => (
            <div key={f.id} className="rounded-md border border-border bg-card p-5">
              <h2 className="font-display text-base font-bold uppercase tracking-tight text-charcoal">
                {f.label}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {f.spec}. Runs {f.algorithm}.
              </p>
              <button
                type="button"
                onClick={() => setFamily(f.id)}
                className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                Show {f.label} locations
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFamily("all")}
              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${family === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-charcoal hover:border-primary"}`}
            >
              All hardware
            </button>
            {MARKET_FAMILY_LIST.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFamily(f.id)}
                className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${family === f.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-charcoal hover:border-primary"}`}
              >
                {f.shortLabel}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="sr-only" htmlFor="market-country">
                Filter by country
              </label>
              <select
                id="market-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="all">All countries</option>
                {MARKET_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="sr-only" htmlFor="market-search">
                Search locations
              </label>
              <input
                id="market-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search your city or state..."
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary md:w-72"
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {rows.length} location{rows.length === 1 ? "" : "s"} match
          {shown.length < rows.length
            ? ` — showing the first ${shown.length}. Search or filter by country, or use the full directory below.`
            : "."}
        </p>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l) => (
            <li key={l.slug}>
              <Link
                to="/bitcoin-mining-marketplace/$slug"
                params={{ slug: l.slug }}
                className="block rounded-md border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary"
              >
                <span className="font-semibold text-charcoal">{l.keyword}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-wide text-muted-foreground">
                  {l.country} · {l.type === "city" ? "City page" : "State page"}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No location matches that search. Try a nearby city, or{" "}
            <Link to="/contact" className="text-primary hover:underline">
              ask us to quote your area
            </Link>
            .
          </p>
        )}

        <div className="mt-12 rounded-md bg-navy px-6 py-10 text-center text-charcoal-foreground">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">
            Ready to order? Shop live inventory
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-foreground/75">
            Every location page links straight to hardware we hold in stock in Hong Kong, shipped
            worldwide with tracked freight and written warranty terms.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <Link
              to="/products"
              className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:bg-ice"
            >
              Shop all miners
            </Link>
            <Link
              to="/used-refurbished-miners"
              className="rounded-md border border-charcoal-foreground/30 px-5 py-2.5 hover:border-primary"
            >
              Used &amp; refurbished
            </Link>
            <Link
              to="/wholesale"
              className="rounded-md border border-charcoal-foreground/30 px-5 py-2.5 hover:border-primary"
            >
              Wholesale pricing
            </Link>
          </div>
        </div>

        {/* Full crawlable directory: every location page is linked in the server-rendered
            HTML (the filtered grid above only shows a slice), so search engines can reach
            every location page without running the filter UI. */}

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal">
            Full location directory
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every city and state buying guide we publish, grouped by country.
          </p>
          <div className="mt-8 space-y-8">
            {directory.map(([countryName, items]) => (
              <div key={countryName}>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
                  {countryName}{" "}
                  <span className="text-muted-foreground">({items.length})</span>
                </h3>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px]">
                  {items.map((l) => (
                    <li key={l.slug}>
                      <Link
                        to="/bitcoin-mining-marketplace/$slug"
                        params={{ slug: l.slug }}
                        className="text-muted-foreground hover:text-primary hover:underline"
                      >
                        {l.keyword}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SeoCopy title={PAGE_COPY.marketplaceIndex.title} blocks={PAGE_COPY.marketplaceIndex.blocks} />

    </SiteLayout>
  );
}
