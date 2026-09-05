import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/data";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";
import { formatPrice, SITE, seoDescription, seoPageTitle } from "@/lib/site";
import { indexVariantMeta, parseIndexSearch, type IndexSearch } from "@/lib/search-meta";

const CANONICAL = "https://bitcoinminingdepot.com/used-asic-miners";
const TITLE = seoPageTitle("Used ASIC Miner Deals: Tested Stock", "BMD");
const DESCRIPTION = seoDescription(
  "Buy a used ASIC miner from tested stock: real photos, measured hashrate, live pricing and a 30-day warranty on used ASIC miners shipped worldwide from Hong Kong.",
);

export const Route = createFileRoute("/used-asic-miners")({
  validateSearch: parseIndexSearch,
  loaderDeps: ({ search }: { search: IndexSearch }) => search,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(productsQuery());
    return deps;
  },
  head: ({ loaderData }) => {
    const variant = indexVariantMeta({ title: TITLE, description: DESCRIPTION }, loaderData);
    return {
      meta: [
        { title: variant?.title ?? TITLE },
        { name: "description", content: variant?.description ?? DESCRIPTION },
        ...(variant ? [{ name: "robots", content: variant.robots }] : []),
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
    };
  },
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div role="alert" className="mx-auto max-w-[900px] px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-charcoal">Used stock unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: UsedAsicMinersPage,
});

const FAQS = [
  {
    q: "What is a used ASIC miner?",
    a: "A used ASIC miner is a previously deployed application-specific mining computer — typically an Antminer or Whatsminer — that has been pulled from a farm, inspected and resold. Every used ASIC miner listed here is bench-tested at full load, so you buy on measured hashrate rather than the factory sticker.",
  },
  {
    q: "Are used ASIC miners a good buy?",
    a: "They are the lowest cost per terahash available. Because a used ASIC miner sells for a fraction of new-unit pricing, the capital you expose to difficulty and price swings is small, and at electricity below roughly six cents per kWh payback is usually measured in months.",
  },
  {
    q: "How much do used ASIC miners cost?",
    a: "Pricing on this page is live from our inventory and typically spans entry-level home units through S19-class 90-110 TH/s machines and hydro-cooled fleet hardware. Bulk and pallet pricing is lower again — request a quote through the wholesale desk.",
  },
  {
    q: "Do used ASIC miners come with a warranty?",
    a: "Yes. Every used ASIC miner ships with a 30-day functional warranty covering hashboard and power-supply failure, and our own repair lab prepared the machine, so parts and diagnostics stay in-house.",
  },
  {
    q: "Where do you ship used ASIC miners?",
    a: `We ship worldwide from ${SITE.city}: United States, Canada, Europe, Latin America, the Middle East and Asia, by DHL or FedEx with tracking, plus air and sea freight for pallet and container orders.`,
  },
];

const SORTS = [
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "hashrate", label: "Hashrate: High to Low" },
] as const;

function parseHashrate(value?: string | null): number {
  const match = (value ?? "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function UsedAsicMinersPage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("price-asc");

  const used = useMemo(
    () => products.filter((p) => p.condition === "Used" || p.condition === "Refurbished"),
    [products],
  );

  const sorted = useMemo(() => {
    return [...used].sort((a, b) => {
      const pa = a.sale_price ?? a.price;
      const pb = b.sale_price ?? b.price;
      if (sort === "price-asc") return pa - pb;
      if (sort === "price-desc") return pb - pa;
      return parseHashrate(b.hashrate) - parseHashrate(a.hashrate);
    });
  }, [used, sort]);

  const prices = used.map((p) => p.sale_price ?? p.price);
  const cheapest = prices.length ? Math.min(...prices) : 0;
  const dearest = prices.length ? Math.max(...prices) : 0;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Used ASIC Miners for Sale",
      description: DESCRIPTION,
      url: CANONICAL,
      about: { "@type": "Thing", name: "Used ASIC miner" },
      mainEntity: {
        "@type": "ItemList",
        name: "Used ASIC miners in stock",
        numberOfItems: sorted.length,
        itemListElement: sorted.slice(0, 40).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://bitcoinminingdepot.com/products/${p.slug}`,
          name: p.name,
          item: {
            "@type": "Product",
            name: p.name,
            url: `https://bitcoinminingdepot.com/products/${p.slug}`,
            brand: { "@type": "Brand", name: p.brand || SITE.name },
            image: (p.images ?? []).filter((i) => i?.startsWith("https://")).slice(0, 1),
            itemCondition: "https://schema.org/UsedCondition",
            offers: {
              "@type": "Offer",
              price: p.sale_price ?? p.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `https://bitcoinminingdepot.com/products/${p.slug}`,
              seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
            },
          },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Used ASIC miners for sale",
      url: CANONICAL,
      numberOfItems: sorted.length,
      ...(prices.length
        ? {
            itemListElement: [
              {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: cheapest,
                highPrice: dearest,
                offerCount: sorted.length,
                availability: "https://schema.org/InStock",
                itemOffered: { "@type": "Product", name: "Used ASIC miner", image: [SITE.ogImage], url: CANONICAL },
              },
            ],
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bitcoinminingdepot.com/" },
        { "@type": "ListItem", position: 2, name: "Used ASIC Miners", item: CANONICAL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHero
        eyebrow="Used ASIC Miners"
        title="Used ASIC Miners for Sale"
        subtitle={`${sorted.length} used ASIC miners in stock${
          cheapest ? ` from ${formatPrice(cheapest)} to ${formatPrice(dearest)}` : ""
        } — real photos, measured hashrate, 30-day functional warranty and worldwide shipping from Hong Kong.`}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { k: "In stock now", v: `${sorted.length} units` },
            { k: "Price range", v: cheapest ? `${formatPrice(cheapest)} – ${formatPrice(dearest)}` : "—" },
            { k: "Warranty", v: "30-day functional" },
          ].map((s) => (
            <div key={s.k} className="rounded-md border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.k}</p>
              <p className="mt-1 text-lg font-bold text-charcoal">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Used ASIC miner listings
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="ua-sort" className="text-xs text-muted-foreground">
              Sort by
            </label>
            <select
              id="ua-sort"
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

        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-lg uppercase text-charcoal">No used ASIC miners listed</p>
            <Link
              to="/contact"
              className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Ask for incoming stock
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="px-4 pt-4 text-left font-display text-base font-semibold uppercase tracking-wide text-charcoal">
              Used ASIC miner price and hashrate list
            </caption>
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3">Model</th>
                <th scope="col" className="px-4 py-3">Hashrate</th>
                <th scope="col" className="px-4 py-3">Power</th>
                <th scope="col" className="px-4 py-3">Condition</th>
                <th scope="col" className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 30).map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      className="font-medium text-charcoal hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.hashrate || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.power || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.condition}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal">
                    {formatPrice(p.sale_price ?? p.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-md border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Used ASIC miner FAQ
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

        <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link to="/used-refurbished-miners" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Filter used &amp; refurbished stock
          </Link>
          <Link to="/products" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            All miners
          </Link>
          <Link to="/wholesale" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Bulk &amp; pallet pricing
          </Link>
          <Link to="/repair-services" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Repair lab
          </Link>
        </nav>
      </div>

      <SeoCopy title={PAGE_COPY.used.title} blocks={PAGE_COPY.used.blocks} />
    </SiteLayout>
  );
}
