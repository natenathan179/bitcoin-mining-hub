import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Bitcoin Mining Blog: ASIC Guides, Reviews & Profitability" },
      {
        name: "description",
        content:
          "99 operator-written guides on the best bitcoin mining machines, ASIC buying advice, Antminer and WhatsMiner reviews, profitability math and home mining setup.",
      },
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
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const posts = useMemo(() => {
    const term = q.trim().toLowerCase();
    return BLOG_POSTS.filter((p) => {
      if (cat !== "all" && p.categoryId !== cat) return false;
      if (term && !`${p.title} ${p.description} ${p.keywords.join(" ")}`.toLowerCase().includes(term))
        return false;
      return true;
    });
  }, [cat, q]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Bitcoin Mining Depot Blog",
    url: `${SITE.url}/blog`,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    blogPost: BLOG_POSTS.slice(0, 30).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.date,
      description: p.description,
    })),
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Blog"
        title="Bitcoin Mining Guides & ASIC Reviews"
        subtitle="99 in-depth articles on choosing, buying, running and profiting from bitcoin mining hardware — every guide linked to the machines we hold in stock."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${cat === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-charcoal hover:border-primary"}`}
            >
              All ({BLOG_POSTS.length})
            </button>
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
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
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 99 mining guides..."
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary md:w-72"
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {posts.length} article{posts.length === 1 ? "" : "s"}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-md border border-border bg-card p-5 transition-shadow hover:shadow-lg"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                {p.category} · {p.readMinutes} min read
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

        {posts.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No articles match that search. Try a broader term such as “Antminer”, “ROI” or “cooling”.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}