import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/data";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";

const TITLE = "Used & Refurbished ASIC Miners for Sale | BMD";
const DESCRIPTION =
  "Buy tested used and refurbished ASIC bitcoin miners — Antminer S19, S19j Pro and more. Filter by brand, hashrate, wattage and budget. Worldwide shipping.";

export const Route = createFileRoute("/used-refurbished-miners")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQuery());
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.net/used-refurbished-miners" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.net/used-refurbished-miners" }],
  }),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div role="alert" className="mx-auto max-w-[900px] px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-charcoal">Catalog unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-[900px] px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-charcoal">No used miners listed</h1>
      </div>
    </SiteLayout>
  ),
  component: UsedMinersPage,
});

const SORTS = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "hashrate", label: "Hashrate: High to Low" },
  { id: "newest", label: "Newest arrivals" },
  { id: "name", label: "Name A-Z" },
] as const;

function parseHashrate(value: string): number {
  const match = value.match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

const FAQS = [
  {
    q: "Are used ASIC miners worth buying in 2026?",
    a: "Yes — when your electricity is below roughly six cents per kilowatt hour. Used Antminer S19-class hardware sells for a fraction of new-unit pricing, so the capital you risk per terahash is far lower and payback periods are short even after a difficulty increase.",
  },
  {
    q: "How do you test used and refurbished miners?",
    a: "Every unit is bench-tested under full load, hashboards are verified chip-by-chip, fans and power supplies are inspected, thermal paste and pads are checked, and custom firmware such as Braiins OS+ or Vnish OS is pre-installed where listed.",
  },
  {
    q: "What warranty comes with a refurbished miner?",
    a: "Refurbished and used machines ship with a 30-day functional warranty covering hashboard and PSU failure. Bulk buyers can extend coverage or add on-site spares — email sales@bitcoinminingdepot.net for terms.",
  },
  {
    q: "What power and cooling do these miners need?",
    a: "Most air-cooled used S19-series miners need 200-240V single phase at 16-20 amps and around 20 CFM of airflow per 100 watts. Low-wattage home models such as tuned 30 TH/s units run on 110V and are quiet enough for a garage or utility room.",
  },
];

function UsedMinersPage() {
  const { data: products } = useSuspenseQuery(productsQuery());

  const used = useMemo(
    () => products.filter((p) => p.condition === "Used" || p.condition === "Refurbished"),
    [products],
  );

  const [term, setTerm] = useState("");
  const [brand, setBrand] = useState("all");
  const [condition, setCondition] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [minHashrate, setMinHashrate] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("price-asc");

  const brands = useMemo(
    () => Array.from(new Set(used.map((p) => p.brand).filter(Boolean))).sort(),
    [used],
  );

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const list = used.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (condition !== "all" && p.condition !== condition) return false;
      if (maxPrice && (p.sale_price ?? p.price) > Number(maxPrice)) return false;
      if (minHashrate && parseHashrate(p.hashrate) < Number(minHashrate)) return false;
      if (needle) {
        const haystack =
          `${p.name} ${p.brand} ${p.short_description} ${p.algorithm} ${p.hashrate} ${p.power}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      const pa = a.sale_price ?? a.price;
      const pb = b.sale_price ?? b.price;
      if (sort === "price-asc") return pa - pb;
      if (sort === "price-desc") return pb - pa;
      if (sort === "hashrate") return parseHashrate(b.hashrate) - parseHashrate(a.hashrate);
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [used, brand, condition, maxPrice, minHashrate, term, sort]);

  const cheapest = used.reduce(
    (min, p) => Math.min(min, p.sale_price ?? p.price),
    Number.POSITIVE_INFINITY,
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        eyebrow="Used & Refurbished Miners"
        title="Used & Refurbished ASIC Bitcoin Miners"
        subtitle={`Tested second-hand Antminer and MicroBT hardware${
          Number.isFinite(cheapest) ? ` from $${cheapest.toFixed(2)}` : ""
        } — the lowest cost per terahash in our catalog, each unit load-tested, firmware-flashed and covered by a 30-day functional warranty.`}
      />

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-md border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Search used stock
            </h2>
            <div className="mt-3 space-y-4 text-sm">
              <div>
                <label htmlFor="u-q" className="mb-1 block text-xs text-muted-foreground">
                  Keyword
                </label>
                <input
                  id="u-q"
                  type="search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="S19j Pro, 95TH, Vnish…"
                  aria-label="Search used and refurbished miners"
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="u-brand" className="mb-1 block text-xs text-muted-foreground">
                  Brand
                </label>
                <select
                  id="u-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                >
                  <option value="all">All brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="u-cond" className="mb-1 block text-xs text-muted-foreground">
                  Condition
                </label>
                <select
                  id="u-cond"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                >
                  <option value="all">Used & refurbished</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
              <div>
                <label htmlFor="u-hash" className="mb-1 block text-xs text-muted-foreground">
                  Min hashrate (TH/s)
                </label>
                <input
                  id="u-hash"
                  type="number"
                  min={0}
                  value={minHashrate}
                  onChange={(e) => setMinHashrate(e.target.value)}
                  placeholder="Any"
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="u-price" className="mb-1 block text-xs text-muted-foreground">
                  Max price (USD)
                </label>
                <input
                  id="u-price"
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="No limit"
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setTerm("");
                  setBrand("all");
                  setCondition("all");
                  setMaxPrice("");
                  setMinHashrate("");
                }}
                className="w-full rounded-md border border-border py-2 text-xs font-semibold uppercase text-charcoal hover:border-primary hover:text-primary"
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="rounded-md border border-primary/30 bg-secondary p-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Buying a pallet?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              We hold used S19-series stock in volume. Ask about pallet and container pricing,
              PSU bundles and hosted placement.
            </p>
            <Link
              to="/wholesale"
              className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase text-primary-foreground"
            >
              Request bulk pricing
            </Link>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-charcoal">{filtered.length}</span> used
              miner{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="u-sort" className="text-xs text-muted-foreground">
                Sort by
              </label>
              <select
                id="u-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-lg uppercase text-charcoal">No used miners match</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear the filters or tell us the model you want — used inventory turns over weekly.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Contact sales
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.slice(0, 24).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {filtered.length > 24 && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Showing 24 of {filtered.length} matching machines. Narrow the filters for a
                  specific model, or browse{" "}
                  <Link to="/products" className="font-medium text-primary hover:underline">
                    the full miner catalogue
                  </Link>
                  .
                </p>
              )}
            </>
          )}

          <div className="mt-12 rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Why buy used ASIC miners from Bitcoin Mining Depot
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Second-hand Bitcoin mining hardware is the fastest route to profitable hashrate when
              power is cheap. A used Antminer S19 or S19j Pro delivers 90 to 110 TH/s for a small
              fraction of a current-generation machine, so the amount of capital exposed to
              difficulty and price swings stays low. Because these are proven platforms, hashboards,
              control boards, fans and PSUs are widely available, and firmware such as Braiins OS+ or
              Vnish OS lets you underclock for efficiency or overclock for raw terahash.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every used and refurbished unit on this page is inspected in-house before it ships:
              load-tested at rated hashrate, thermally verified, cleaned, repasted where required and
              packed in professional foam and carton for worldwide DHL or FedEx delivery with
              tracking. Send your electricity rate and available amperage to
              sales@bitcoinminingdepot.net and our engineers will confirm which of these machines
              actually pays back on your site.
            </p>
          </div>

          <div className="mt-8 rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Used miner buying FAQ
            </h2>
            <dl className="mt-4 space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-semibold text-charcoal">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
      <SeoCopy title={PAGE_COPY.used.title} blocks={PAGE_COPY.used.blocks} />
      <SeoCopy title={PAGE_COPY.usedRefurb.title} blocks={PAGE_COPY.usedRefurb.blocks} />
    </SiteLayout>
  );
}