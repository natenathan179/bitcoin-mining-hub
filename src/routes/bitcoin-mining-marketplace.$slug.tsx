import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { buildPage, getLocation, relatedLocations, type Family } from "@/lib/marketplace";
import { productsQuery, type Product } from "@/lib/data";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/bitcoin-mining-marketplace/$slug")({
  loader: ({ params, context }) => {
    const loc = getLocation(params.slug);
    if (!loc) throw notFound();
    context.queryClient.ensureQueryData(productsQuery());
    return { page: buildPage(loc) };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    if (!page) {
      return { meta: [{ title: "Location unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const url = `${SITE.url}/bitcoin-mining-marketplace/${page.location.slug}`;
    return {
      meta: [
        { title: page.metaTitle },
        { name: "description", content: page.metaDescription },
        { name: "keywords", content: page.keywords.join(", ") },
        { property: "og:title", content: page.h1 },
        { property: "og:description", content: page.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: MarketplaceLocationPage,
});

function matchProducts(fam: Family, products: Product[]): Product[] {
  const score = (p: Product) => {
    let s = 0;
    const hay = `${p.name} ${p.brand} ${p.short_description} ${p.algorithm}`.toLowerCase();
    fam.terms.forEach((t, i) => {
      if (hay.includes(t)) s += 6 - i;
    });
    if (fam.brands?.includes(p.brand)) s += 3;
    if (p.stock_status?.toLowerCase().includes("in stock")) s += 2;
    if (p.featured) s += 1;
    return s;
  };
  return [...products].sort((a, b) => score(b) - score(a)).slice(0, 6);
}

function MarketplaceLocationPage() {
  const { page } = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery());
  const picks = matchProducts(page.family, products);
  const related = relatedLocations(page.location, 12);
  const { location: loc, family: fam } = page;
  const url = `${SITE.url}/bitcoin-mining-marketplace/${loc.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.metaDescription,
      datePublished: page.date,
      dateModified: page.date,
      inLanguage: "en",
      keywords: page.keywords.join(", "),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      about: { "@type": "Thing", name: fam.product },
      spatialCoverage: { "@type": "Place", name: `${loc.place}, ${loc.country}` },
      url,
      image: [SITE.ogImage],
      author: { "@type": "Organization", name: SITE.name, url: SITE.url },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: SITE.logo } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bitcoin Mining Marketplace",
          item: `${SITE.url}/bitcoin-mining-marketplace`,
        },
        { "@type": "ListItem", position: 3, name: page.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-border bg-secondary/40">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-[1280px] px-4 py-3 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/bitcoin-mining-marketplace" className="hover:text-primary">
            Marketplace
          </Link>{" "}
          / <span className="text-charcoal">{loc.place}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {fam.shortLabel} · {loc.country} · {page.readMinutes} min read
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-charcoal md:text-4xl">
            {page.h1}
          </h1>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {page.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
            <Link
              to="/products"
              className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:bg-ice"
            >
              Shop in-stock miners
            </Link>
            <Link
              to="/checkout"
              className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
            >
              Payment methods
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
            >
              Get a quote for {loc.place}
            </Link>
          </div>

          {picks.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal md:text-2xl">
                {fam.product} Hardware In Stock for {loc.place}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Live inventory shipped from Hong Kong to {loc.place}. Every unit is bench-tested and
                hashrate-verified before dispatch — click through to order.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {picks.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          <nav aria-label="Table of contents" className="mt-10 rounded-md border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              On this page
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {page.sections.map((s, i) => (
                <li key={s.h2}>
                  <a href={`#section-${i + 1}`} className="text-primary hover:underline">
                    {s.h2}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-primary hover:underline">
                  Frequently asked questions
                </a>
              </li>
            </ul>
          </nav>

          {page.sections.map((s, i) => (
            <section key={s.h2} id={`section-${i + 1}`} className="mt-9 scroll-mt-32">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal md:text-2xl">
                {s.h2}
              </h2>
              <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {s.paras.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section id="faq" className="mt-12 scroll-mt-32">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal md:text-2xl">
              Frequently Asked Questions — {loc.place}
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
              {page.faqs.map((f) => (
                <div key={f.q} className="p-5">
                  <dt className="text-sm font-semibold text-charcoal">{f.q}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-12 rounded-md bg-navy px-6 py-10 text-center text-charcoal-foreground">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">
              Order your {fam.product} for {loc.place}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-foreground/75">
              Tell us your electricity rate and available amperage and we will confirm the right machine,
              the delivered price and the transit time to {loc.place} before you pay a cent.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-wide">
              <Link
                to="/products"
                className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:bg-ice"
              >
                Browse products
              </Link>
              <Link
                to="/hosting"
                className="rounded-md border border-charcoal-foreground/30 px-5 py-2.5 hover:border-primary"
              >
                Hosting plans
              </Link>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-md border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Nearby buying guides
            </h2>
            <ul className="mt-3 space-y-2 text-[13px]">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/bitcoin-mining-marketplace/$slug"
                    params={{ slug: r.slug }}
                    className="text-primary hover:underline"
                  >
                    {r.keyword}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/bitcoin-mining-marketplace"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-charcoal hover:text-primary"
            >
              All marketplace locations →
            </Link>
          </div>

          <div className="rounded-md border border-border bg-card p-5 text-[13px] text-muted-foreground">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Buy with confidence
            </h2>
            <ul className="mt-3 space-y-2">
              <li>Bench-tested, hashrate-verified hardware</li>
              <li>Tracked freight from Hong Kong to {loc.country}</li>
              <li>Crypto, CashApp, Chime and bank payment</li>
              <li>Written warranty and in-house repair support</li>
            </ul>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
            >
              {SITE.email}
            </a>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
