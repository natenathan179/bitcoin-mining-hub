import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/data";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";
import { seoDescription, seoTitle } from "@/lib/site";

interface ProductSearch {
  q?: string;
  category?: string;
  page?: number;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    category:
      typeof search.category === "string" && search.category ? search.category : undefined,
    page:
      Number.isFinite(Number(search.page)) && Number(search.page) > 1
        ? Math.floor(Number(search.page))
        : undefined,
  }),
  // Filtered views (?category=…, ?q=…) get their own title and description so
  // crawlers never see several URLs sharing the shop page's title, and they all
  // point back at /products as the preferred version.
  loaderDeps: ({ search }: { search: ProductSearch }) => ({
    q: search.q,
    category: search.category,
    page: search.page,
  }),
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(productsQuery());
    context.queryClient.ensureQueryData(categoriesQuery());
    return { q: deps.q, category: deps.category, page: deps.page };
  },
  head: ({ loaderData }) => {
    const titleCase = (v: string) =>
      v.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
    const base = loaderData?.category
      ? titleCase(loaderData.category)
      : loaderData?.q
        ? titleCase(loaderData.q)
        : "";
    // Paginated views count as filtered views: they must not reuse page one's title.
    const filter = loaderData?.page
      ? `${base ? `${base} ` : ""}Page ${loaderData.page}`.trim()
      : base;
    const pageSuffix = loaderData?.page ? ` — Page ${loaderData.page}` : "";
    const title = base
      ? seoTitle(
          `${/miner/i.test(base) ? `${base} In Stock` : `${base} Miners In Stock`}${pageSuffix}`,
          "Bitcoin Mining Depot",
        )
      : `Shop ASIC Bitcoin Miners${pageSuffix} | Bitcoin Mining Depot`;
    const description = filter
      ? seoDescription(
          `${base ? `In-stock ${base} mining hardware` : "In-stock ASIC mining hardware"}${pageSuffix ? `, page ${loaderData?.page}` : ""} with tested hashrate, written warranty and worldwide shipping from our Hong Kong warehouse.`,
        )
      : "Browse in-stock ASIC bitcoin miners, power supplies, immersion cooling and spare parts. Filter by brand, condition, hashrate and price with wholesale pricing available.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content:
            "In-stock Bitmain, MicroBT and Canaan mining hardware with tested hashrate, warranty and worldwide shipping.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: "https://bitcoinminingdepot.net/products" },
        ...(filter ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [{ rel: "canonical", href: "https://bitcoinminingdepot.net/products" }],
    };
  },

  component: ProductsPage,
});

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A-Z" },
] as const;

function ProductsPage() {
  const { q, category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());

  const [brand, setBrand] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("newest");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [visible, setVisible] = useState(24);

  // Reset pagination whenever the result set changes so users always see page one.
  useEffect(() => {
    setVisible(24);
  }, [brand, condition, maxPrice, q, category, sort]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products],
  );
  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = useMemo(() => {
    const term = q?.toLowerCase();
    let list = products.filter((p) => {
      if (activeCategory && p.category_id !== activeCategory.id) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (condition !== "all" && p.condition !== condition) return false;
      if (maxPrice && (p.sale_price ?? p.price) > Number(maxPrice)) return false;
      if (term) {
        const haystack =
          `${p.name} ${p.brand} ${p.short_description} ${p.algorithm} ${p.hashrate}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      const pa = a.sale_price ?? a.price;
      const pb = b.sale_price ?? b.price;
      if (sort === "price-asc") return pa - pb;
      if (sort === "price-desc") return pb - pa;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [products, activeCategory, brand, condition, maxPrice, q, sort]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Shop ASIC Bitcoin Miners",
      url: "https://bitcoinminingdepot.net/products",
      description:
        "In-stock ASIC bitcoin miners, power supplies, immersion cooling and spare parts with worldwide shipping.",
      isPartOf: {
        "@type": "WebSite",
        name: "Bitcoin Mining Depot",
        url: "https://bitcoinminingdepot.net",
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: filtered.length,
        itemListElement: filtered.slice(0, 25).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `https://bitcoinminingdepot.net/products/${p.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bitcoinminingdepot.net/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop",
          item: "https://bitcoinminingdepot.net/products",
        },
      ],
    },
  ];

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Shop"
        title={activeCategory ? activeCategory.name : "Bitcoin Mining Hardware"}
        subtitle={
          activeCategory
            ? activeCategory.description
            : "Every miner listed below is physically in our inventory or in a confirmed inbound shipment. Filter by brand, condition and budget, then request a quote or add to your cart for a formal order."
        }
      />

      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-md border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Categories
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>
                <Link
                  to="/products"
                  search={{ q, category: undefined }}
                  className={!category ? "font-semibold text-primary" : "text-muted-foreground"}
                >
                  All products ({products.length})
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/products"
                    search={{ q, category: c.slug }}
                    className={
                      category === c.slug
                        ? "font-semibold text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Filters
            </h2>
            <div className="mt-3 space-y-4 text-sm">
              <div>
                <label htmlFor="f-brand" className="mb-1 block text-xs text-muted-foreground">
                  Brand
                </label>
                <select
                  id="f-brand"
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
                <label htmlFor="f-cond" className="mb-1 block text-xs text-muted-foreground">
                  Condition
                </label>
                <select
                  id="f-cond"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                >
                  <option value="all">Any condition</option>
                  <option value="New">New</option>
                  <option value="Refurbished">Refurbished</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              <div>
                <label htmlFor="f-price" className="mb-1 block text-xs text-muted-foreground">
                  Max price (USD)
                </label>
                <input
                  id="f-price"
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
                  setBrand("all");
                  setCondition("all");
                  setMaxPrice("");
                  navigate({ search: { q: undefined, category: undefined } });
                }}
                className="w-full rounded-md border border-border py-2 text-xs font-semibold uppercase text-charcoal hover:border-primary hover:text-primary"
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="rounded-md border border-primary/30 bg-secondary p-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Buying 10+ units?
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Wholesale customers receive tiered pricing, consolidated freight and priority
              allocation on new releases.
            </p>
            <Link
              to="/wholesale"
              className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase text-primary-foreground"
            >
              Wholesale program
            </Link>
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-charcoal">{filtered.length}</span>{" "}
              product{filtered.length === 1 ? "" : "s"}
              {q ? ` for “${q}”` : ""}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs text-muted-foreground">
                Sort by
              </label>
              <select
                id="sort"
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
              <p className="font-display text-lg uppercase text-charcoal">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing the filters, or contact our sales desk — we source models on request.
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
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisible((v) => v + 24)}
                    className="rounded-md border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal hover:border-primary hover:text-primary"
                  >
                    Load more miners ({filtered.length - visible} left)
                  </button>
                </div>
              )}
              {/* Lightweight crawlable list so every model stays one hop from /products
                  even though the grid renders in pages. */}
              <div className="mt-10 rounded-md border border-border bg-card p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
                  All {products.length} models in stock
                </h2>
                <ul className="mt-3 grid gap-1.5 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <li key={`idx-${p.id}`}>
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="mt-12 rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              How to choose the right bitcoin miner
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The right machine is the one that matches your electricity price, your available
              power infrastructure and your holding period. Below roughly six cents per kilowatt
              hour, older and cheaper hardware such as the S19 series often produces the best return
              on capital because you are buying terahash at a fraction of new-unit cost. Above ten
              cents, efficiency dominates: only current-generation machines in the 12 to 18 joules
              per terahash band stay profitable through a difficulty increase or a price drawdown.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Also check your electrical envelope before ordering. Most air-cooled miners need
              200-240V single phase at roughly 16 to 20 amps per machine, and hydro or immersion
              units require plumbing, heat rejection and often three-phase distribution. If you are
              unsure, send us your site details and our engineers will confirm what your service can
              support before you spend anything.
            </p>
          </div>
        </section>
      </div>
      <SeoCopy title={PAGE_COPY.productsIndex.title} blocks={PAGE_COPY.productsIndex.blocks} />
    </SiteLayout>
  );
}