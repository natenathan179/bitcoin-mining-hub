import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery, categoriesQuery } from "@/lib/data";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";
import { formatPrice, SITE, seoDescription, seoPageTitle } from "@/lib/site";
import { indexVariantMeta, parseIndexSearch, type IndexSearch } from "@/lib/search-meta";

const CANONICAL = "https://bitcoinminingdepot.com/crypto-mining-for-sale";
const TITLE = seoPageTitle("Crypto Mining For Sale: Live Stock", "BMD");
const DESCRIPTION = seoDescription(
  "Crypto mining hardware for sale with live pricing: Bitcoin, Litecoin, Dogecoin, Kaspa and Monero miners, tested and shipped worldwide from Hong Kong.",
);

export const Route = createFileRoute("/crypto-mining-for-sale")({
  validateSearch: parseIndexSearch,
  loaderDeps: ({ search }: { search: IndexSearch }) => search,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(productsQuery());
    context.queryClient.ensureQueryData(categoriesQuery());
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
        <h1 className="font-display text-2xl uppercase text-charcoal">Stock unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: CryptoMiningForSalePage,
});

const FAQS = [
  {
    q: "What crypto mining hardware do you have for sale?",
    a: "Our crypto mining stock covers SHA-256 Bitcoin ASICs (Antminer S19, S21 and S23 families, Whatsminer M50 through M60S, Bitdeer SealMiner), Scrypt Litecoin and Dogecoin miners such as the Antminer L7 and L9, Kaspa kHeavyHash units, Monero RandomX servers, plus PSUs, immersion tanks and container infrastructure.",
  },
  {
    q: "How much does crypto mining equipment cost?",
    a: "Pricing on this page is pulled live from inventory, so what you see is what you pay. Refurbished previous-generation units start at the low hundreds of dollars per machine, current-generation air-cooled flagships sit in the low thousands, and hydro or immersion fleet hardware is priced per lot. Bulk buyers get pallet pricing through the wholesale desk.",
  },
  {
    q: "Is crypto mining still profitable in 2026?",
    a: "Profitability is a function of your electricity price and machine efficiency, not of hype. Below roughly $0.07/kWh, modern sub-20 J/TH hardware stays cash-positive across normal difficulty and price cycles; above $0.10/kWh you need hosting or the newest hydro units to stay ahead. We publish the numbers per model so you can run your own math before ordering.",
  },
  {
    q: "How do I pay for crypto mining hardware?",
    a: "Checkout is cryptocurrency-based. You pick the coin and network, scan the QR address we display, submit your transaction ID and delivery details, and our team confirms on-chain before the unit is released for shipping.",
  },
  {
    q: "Do you ship crypto miners worldwide?",
    a: `Yes. Every order ships from ${SITE.city} to the United States, Canada, Europe and the UK, Latin America, the Middle East, Asia, Australia and Africa, by DHL or FedEx express with tracking, and by air or sea freight for pallet and container volumes with HS codes and commercial invoices prepared.`,
  },
];

function CryptoMiningForSalePage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());

  const inStock = useMemo(
    () => products.filter((p) => p.stock_status !== "Out of Stock"),
    [products],
  );

  const featured = useMemo(() => {
    const flagged = inStock.filter((p) => p.featured);
    const pool = flagged.length >= 8 ? flagged : inStock;
    return [...pool]
      .sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
      .slice(0, 8);
  }, [inStock]);

  const bestValue = useMemo(
    () =>
      [...inStock]
        .sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
        .slice(0, 12),
    [inStock],
  );

  const prices = inStock.map((p) => p.sale_price ?? p.price);
  const cheapest = prices.length ? Math.min(...prices) : 0;
  const dearest = prices.length ? Math.max(...prices) : 0;
  const brands = [...new Set(inStock.map((p) => p.brand).filter(Boolean))].sort();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Crypto Mining For Sale",
      description: DESCRIPTION,
      url: CANONICAL,
      about: { "@type": "Thing", name: "Crypto mining hardware" },
      mainEntity: {
        "@type": "ItemList",
        name: "Crypto mining hardware in stock",
        numberOfItems: featured.length,
        itemListElement: featured.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://bitcoinminingdepot.com/products/${p.slug}`,
          name: p.name,
          item: {
            "@type": "Product",
            name: p.name,
            url: `https://bitcoinminingdepot.com/products/${p.slug}`,
            brand: { "@type": "Brand", name: p.brand || SITE.name },
            description:
              p.short_description ||
              `${p.name} — crypto mining hardware in stock at ${SITE.name}, shipped worldwide from Hong Kong.`,
            image: (p.images ?? []).filter((i) => i?.startsWith("https://")).slice(0, 1),
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
    ...(prices.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Crypto mining hardware for sale",
            url: CANONICAL,
            numberOfItems: inStock.length,
            itemListElement: [
              {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: cheapest,
                highPrice: dearest,
                offerCount: inStock.length,
                availability: "https://schema.org/InStock",
                itemOffered: {
                  "@type": "Product",
                  name: "Crypto mining hardware",
                  description:
                    "New and used ASIC crypto mining hardware in stock, shipped worldwide from Hong Kong.",
                  image: [SITE.ogImage],
                  url: CANONICAL,
                },
              },
            ],
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bitcoinminingdepot.com/" },
        { "@type": "ListItem", position: 2, name: "Crypto Mining For Sale", item: CANONICAL },
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
        eyebrow="Crypto Mining For Sale"
        title="Crypto Mining Hardware For Sale"
        subtitle={`${inStock.length} miners in live stock${
          cheapest ? ` from ${formatPrice(cheapest)} to ${formatPrice(dearest)}` : ""
        } — Bitcoin, Litecoin, Dogecoin, Kaspa and Monero machines, bench-tested in Hong Kong and shipped worldwide with crypto checkout.`}
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Units in stock", v: `${inStock.length}` },
            { k: "Price range", v: cheapest ? `${formatPrice(cheapest)} – ${formatPrice(dearest)}` : "—" },
            { k: "Brands stocked", v: `${brands.length}` },
            { k: "Warranty", v: "30-day functional" },
          ].map((s) => (
            <div key={s.k} className="rounded-md border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.k}</p>
              <p className="mt-1 text-lg font-bold text-charcoal">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Featured products — links straight into live product pages */}
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
                Featured crypto miners for sale
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hand-picked from current stock — click any unit for full specs, photos and crypto checkout.
              </p>
            </div>
            <Link
              to="/products"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Shop all live stock
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg uppercase text-charcoal">Restocking in progress</p>
              <Link
                to="/contact"
                className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Ask about incoming units
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {categories.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Shop crypto mining by category
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.slug }}
                  className="rounded-md border border-border bg-card p-4 transition hover:border-primary"
                >
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
                    {c.name}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="px-4 pt-4 text-left font-display text-base font-semibold uppercase tracking-wide text-charcoal">
              Lowest cost crypto mining hardware in stock
            </caption>
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3">Model</th>
                <th scope="col" className="px-4 py-3">Algorithm</th>
                <th scope="col" className="px-4 py-3">Hashrate</th>
                <th scope="col" className="px-4 py-3">Power</th>
                <th scope="col" className="px-4 py-3">Condition</th>
                <th scope="col" className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {bestValue.map((p) => (
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
                  <td className="px-4 py-3 text-muted-foreground">{p.algorithm || "—"}</td>
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
        </section>

        <section className="mt-10 rounded-md border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Crypto mining for sale: buyer FAQ
          </h2>
          <dl className="mt-4 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-sm font-semibold text-charcoal">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link to="/products" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            All miners in stock
          </Link>
          <Link to="/used-asic-miners" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Used ASIC miners
          </Link>
          <Link to="/wholesale" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Wholesale &amp; pallet pricing
          </Link>
          <Link to="/hosting" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Hosting
          </Link>
          <Link to="/blog" className="rounded-md border border-border px-4 py-2 hover:border-primary hover:text-primary">
            Mining guides
          </Link>
        </nav>
      </div>

      <SeoCopy title={PAGE_COPY.cryptoForSale.title} blocks={PAGE_COPY.cryptoForSale.blocks} />
    </SiteLayout>
  );
}
