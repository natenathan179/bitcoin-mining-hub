import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { BLOG_CATEGORIES, BLOG_INDEX as BLOG_POSTS } from "@/lib/blog-index";
import { SITE } from "@/lib/site";
import { indexVariantMeta, parseIndexSearch, type IndexSearch } from "@/lib/search-meta";

const BASE = {
  title: "Bitcoin Mining Blog: ASIC Guides, Reviews & Profitability",
  description:
    "299 operator-written guides on the best bitcoin mining machines, used ASIC miner buying advice, Antminer and WhatsMiner reviews, profitability math and setup.",
};

export const Route = createFileRoute("/blog/")({
  validateSearch: parseIndexSearch,
  loaderDeps: ({ search }: { search: IndexSearch }) => search,
  loader: ({ deps }) => deps,
  head: ({ loaderData }) => {
    const variant = indexVariantMeta(BASE, loaderData);
    return {
    meta: [
      { title: variant?.title ?? BASE.title },
      {
        name: "description",
        content: variant?.description ?? BASE.description,
      },
      ...(variant ? [{ name: "robots", content: variant.robots }] : []),
      { property: "og:title", content: "Bitcoin Mining Blog | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "Rankings, buyer's guides, brand reviews, ROI math and setup tutorials for ASIC bitcoin miners — written by people who run them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: `${SITE.url}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/blog` }],
    };
  },
  component: BlogIndex,
});

function BlogIndex() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(24);

  const usedPosts = useMemo(() => BLOG_POSTS.filter((p) => p.categoryId === "used").slice(0, 6), []);

  const posts = useMemo(() => {
    const term = q.trim().toLowerCase();
    return BLOG_POSTS.filter((p) => {
      if (cat !== "all" && p.categoryId !== cat) return false;
      if (term && !`${p.title} ${p.description} ${p.keywords.join(" ")}`.toLowerCase().includes(term))
        return false;
      return true;
    }).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  }, [cat, q]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Bitcoin Mining Depot Blog",
    url: `${SITE.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: SITE.logo },
    },
    blogPost: BLOG_POSTS.slice(0, 30).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE.url}/blog/${p.slug}`,
        url: `${SITE.url}/blog/${p.slug}`,
        name: p.title,
      },
      datePublished: p.date,
      dateModified: p.date,
      description: p.description,
      inLanguage: "en",
      image: [SITE.ogImage],
      author: { "@type": "Organization", name: SITE.name, url: SITE.url },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: { "@type": "ImageObject", url: SITE.logo },
      },
    })),
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Blog"
        title="Bitcoin Mining Guides & ASIC Reviews"
        subtitle="299 in-depth articles on choosing, buying, running and profiting from bitcoin mining hardware — every guide linked to the machines we hold in stock."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setCat("all"); setVisible(24); }}
              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${cat === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-charcoal hover:border-primary"}`}
            >
              All ({BLOG_POSTS.length})
            </button>
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCat(c.id); setVisible(24); }}
                className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-charcoal hover:border-primary"}`}
              >
                {c.label} ({BLOG_POSTS.filter((p) => p.categoryId === c.id).length})
              </button>
            ))}
          </div>
          <div>
            <label className="sr-only" htmlFor="blog-search">
              Search articles
            </label>
            <input
              id="blog-search"
              value={q}
              onChange={(e) => { setQ(e.target.value); setVisible(24); }}
              placeholder="Search 299 mining guides..."
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary md:w-72"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {Math.min(visible, posts.length)} of {posts.length} article
          {posts.length === 1 ? "" : "s"}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, visible).map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-md border border-border bg-card p-5 transition-shadow hover:shadow-lg"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {p.category} · {p.readMinutes} min read
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {new Date(p.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <h2 className="mt-2 font-display text-base font-bold leading-snug text-charcoal">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                Read guide
              </Link>
            </article>
          ))}
        </div>

        {visible < posts.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisible((v) => v + 24)}
              className="rounded-md border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal hover:border-primary hover:text-primary"
            >
              Load more guides
            </button>
          </div>
        )}

        {/* Lightweight crawlable index of every guide — keeps all posts one hop from /blog
            without rendering hundreds of full cards on mobile. */}
        <section className="mt-12 rounded-md border border-border bg-card p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
            All {BLOG_POSTS.length} mining guides
          </h2>
          <ul className="mt-3 grid gap-1.5 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((p) => (
              <li key={`idx-${p.slug}`}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="text-muted-foreground hover:text-primary"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>



        <section className="mt-14 rounded-md border border-primary/30 bg-secondary p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-charcoal">
            Used ASIC Miners: buying, pricing and profitability guides
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Everything we know about buying used ASIC miners — how to inspect and load-test second-hand
            hardware, what used ASIC miner prices should be per terahash, and whether a used rig pays back
            at your electricity rate. Each guide links straight to tested stock you can order today.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usedPosts.map((p) => (
              <article key={p.slug} className="rounded-md border border-border bg-card p-4">
                <h3 className="font-display text-sm font-bold leading-snug text-charcoal">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.description}</p>
              </article>
            ))}
          </div>
          <Link
            to="/used-asic-miners"
            className="mt-5 inline-block rounded-md bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
          >
            Shop used ASIC miners in stock
          </Link>
        </section>
        {posts.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No articles match that search. Try a broader term such as “Antminer”, “ROI” or “cooling”.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}