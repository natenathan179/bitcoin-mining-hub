import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { ObfuscatedEmail } from "@/components/site/ObfuscatedEmail";
import { getBlogPageFn } from "@/lib/blog.functions";
import { retryRead } from "@/lib/retry";
import type { BlogPost } from "@/lib/blog-types";
import { productsQuery, type Product } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * Keeps the title tag distinguishable from the article H1. A title identical to
 * the heading is reported as duplicate H1/title content by SEO audits.
 */
function distinctTitle(metaTitle: string, h1: string): string {
  if (metaTitle.trim().toLowerCase() !== h1.trim().toLowerCase()) return metaTitle;
  for (const suffix of [" | Bitcoin Mining Depot", " | BMD Guide", " | BMD"]) {
    if (metaTitle.length + suffix.length <= 65) return `${metaTitle}${suffix}`;
  }
  const colon = metaTitle.indexOf(":");
  const lead = colon > 12 ? metaTitle.slice(0, colon) : metaTitle.slice(0, 52).trimEnd();
  return `${lead} | BMD Guide`;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    // Metadata comes from the lightweight index; the article body is fetched on
    // the server so the 2 MB library never ships to the browser.
    context.queryClient.ensureQueryData(productsQuery());
    const data = import.meta.env.SSR
      ? await (await import("@/lib/ssr-pages.server")).loadBlogPage(params.slug)
      : await retryRead(() => getBlogPageFn({ data: { slug: params.slug } }));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const entry = loaderData?.entry;
    if (!entry) return {};
    const url = `${SITE.url}/blog/${entry.slug}`;
    // metaTitle must never read exactly like the on-page H1, or audits flag the
    // page for duplicate content in H1 and title.
    const metaTitle = distinctTitle(entry.metaTitle, loaderData?.post.title ?? "");
    return {
      meta: [
        { title: metaTitle },
        { name: "description", content: entry.description },
        { name: "keywords", content: entry.keywords.join(", ") },
        { property: "og:title", content: metaTitle },
        { property: "og:description", content: entry.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: entry.date },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: SITE.ogImage },
        { name: "twitter:image", content: SITE.ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPostPage,
});


function matchProducts(post: BlogPost, products: Product[]): Product[] {
  const { brands, condition, terms, maxPrice } = post.match;
  const score = (p: Product) => {
    let s = 0;
    const hay = `${p.name} ${p.short_description} ${p.description} ${p.condition}`.toLowerCase();
    if (brands?.includes(p.brand)) s += 5;
    if (condition && p.condition?.toLowerCase().includes(condition.toLowerCase())) s += 4;
    terms?.forEach((t) => {
      if (hay.includes(t.toLowerCase())) s += 3;
    });
    const price = p.sale_price ?? p.price;
    if (maxPrice && price && price <= maxPrice) s += 5;
    if (maxPrice && price && price > maxPrice) s -= 10;
    post.keywords.forEach((k) => {
      if (k.length > 4 && hay.includes(k)) s += 1;
    });
    if (p.featured) s += 1;
    return s;
  };
  return [...products].sort((a, b) => score(b) - score(a)).slice(0, 6);
}

function BlogPostPage() {
  const { post, related, cluster } = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery());
  const picks = matchProducts(post, products);
  const url = `${SITE.url}/blog/${post.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: "en",
      keywords: post.keywords.join(", "),
      articleSection: post.category,
      mainEntityOfPage: { "@type": "WebPage", "@id": url, url, name: post.title },
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
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
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
        <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-4 py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/blog" className="hover:text-primary">
            Blog
          </Link>{" "}
          / <span className="text-charcoal">{post.category}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {post.category} · {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })} · {post.readMinutes} min read
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-charcoal md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {post.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <nav aria-label="Table of contents" className="mt-8 rounded-md border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              In this article
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {post.sections.map((s, i) => (
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

          {post.sections.map((s, i) => (
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
              Frequently Asked Questions
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
              {post.faqs.map((f) => (
                <div key={f.q} className="p-5">
                  <dt className="text-sm font-semibold text-charcoal">{f.q}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {picks.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal md:text-2xl">
                Recommended Miners From Our Inventory
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Hardware in stock that matches this guide. Every unit is bench-tested and hashrate-verified before it ships.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {picks.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
                <Link
                  to="/products"
                  className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:bg-ice"
                >
                  Shop all miners
                </Link>
                <Link
                  to="/used-refurbished-miners"
                  className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
                >
                  Used &amp; refurbished
                </Link>
                <Link
                  to="/hosting"
                  className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
                >
                  Hosting plans
                </Link>
              </div>
            </section>
          )}

          {cluster && (
            <section className="mt-12 rounded-md border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal md:text-2xl">
                More {cluster.label} Guides
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Everything we publish on the {cluster.label} family — pricing, specs, efficiency,
                firmware and deployment — plus live {cluster.label} stock you can buy today.
              </p>
              <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
                {cluster.posts.map((r) => (
                  <li key={r.slug}>
                    <Link to="/blog/$slug" params={{ slug: r.slug }} className="text-primary hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
                <Link
                  to="/products"
                  search={{ q: cluster.query, category: undefined, page: undefined }}
                  className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:bg-ice"
                >
                  Shop {cluster.label} in stock
                </Link>
                <Link
                  to="/used-asic-miners"
                  className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
                >
                  Used {cluster.label} listings
                </Link>
                <Link
                  to="/collections/$slug"
                  params={{ slug: "asic-miners" }}
                  className="rounded-md border border-border px-5 py-2.5 text-charcoal hover:border-primary"
                >
                  All ASIC miners
                </Link>
              </div>
            </section>
          )}


          <div className="mt-12 rounded-md bg-navy px-6 py-10 text-center text-charcoal-foreground">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">
              Want the numbers run for your site?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-foreground/75">
              Send us your electricity rate, available amperage and budget. We will model the machines that
              actually pay back at your power cost — no obligation.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-ice"
            >
              Talk to an engineer
            </Link>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-md border border-border bg-card p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Related guides
            </h2>
            <ul className="mt-3 space-y-2 text-[13px]">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="text-primary hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/blog"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-charcoal hover:text-primary"
            >
              Browse all guides →
            </Link>
          </div>

          <div className="rounded-md border border-border bg-card p-5 text-[13px] text-muted-foreground">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Buy with confidence
            </h2>
            <ul className="mt-3 space-y-2">
              <li>Bench-tested, hashrate-verified hardware</li>
              <li>Written warranty terms in plain language</li>
              <li>Crypto payment, verified on-chain</li>
              <li>Shipping from Hong Kong worldwide</li>
            </ul>
            <ObfuscatedEmail className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-primary hover:underline" />
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}