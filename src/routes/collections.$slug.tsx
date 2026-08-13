import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { CollectionInternalLinks } from "@/components/site/CollectionInternalLinks";
import { COLLECTIONS, findCollection, matchPosts, matchProducts } from "@/lib/collections";
import { categoriesQuery, productsQuery } from "@/lib/data";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params, context }) => {
    const collection = findCollection(params.slug);
    if (!collection) throw notFound();
    context.queryClient.ensureQueryData(productsQuery());
    context.queryClient.ensureQueryData(categoriesQuery());
    return { collection };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.collection;
    if (!c) return { meta: [{ title: "Category unavailable" }, { name: "robots", content: "noindex" }] };
    const url = `${SITE.url}/collections/${c.slug}`;
    return {
      meta: [
        { title: c.metaTitle },
        { name: "description", content: c.metaDescription },
        { property: "og:title", content: c.metaTitle },
        { property: "og:description", content: c.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());

  const slugById = Object.fromEntries(categories.map((c) => [c.id, c.slug]));
  const matched = matchProducts(collection, products, slugById);
  const posts = matchPosts(collection);
  const url = `${SITE.url}/collections/${collection.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection.h1,
      description: collection.metaDescription,
      url,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: matched.length,
        itemListElement: matched.slice(0, 25).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE.url}/products/${p.slug}`,
          name: p.name,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE.url}/products` },
        { "@type": "ListItem", position: 3, name: collection.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: collection.faqs.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero eyebrow={collection.eyebrow} title={collection.h1} subtitle={collection.intro[0]} />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          {" / "}
          <Link to="/products" className="hover:text-primary">
            Shop
          </Link>
          {" / "}
          <span className="text-charcoal">{collection.name}</span>
        </nav>

        <div className="mt-6 grid gap-3">
          {collection.intro.slice(1).map((p) => (
            <p key={p} className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>

        <section className="mt-10" aria-labelledby="collection-products">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2
                id="collection-products"
                className="font-display text-xl font-bold uppercase tracking-wide text-charcoal"
              >
                {collection.name} in stock
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {matched.length} matching product{matched.length === 1 ? "" : "s"} from our live
                inventory
              </p>
            </div>
            <Link
              to={collection.cta.to}
              className="rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            >
              {collection.cta.label}
            </Link>
          </div>

          {matched.length === 0 ? (
            <p className="py-10 text-sm text-muted-foreground">
              Nothing in this category is on the shelf right now — we source models on request.{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Contact our sales desk
              </Link>{" "}
              and we will quote availability and lead time.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {matched.slice(0, 24).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-14 grid gap-8">
          {collection.sections.map((s) => (
            <article key={s.h2}>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-charcoal">
                {s.h2}
              </h2>
              {s.paras.map((p) => (
                <p key={p} className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </section>

        <CollectionInternalLinks collection={collection} products={matched} />

        {posts.length > 0 && (
          <section className="mt-14" aria-labelledby="collection-guides">
            <h2
              id="collection-guides"
              className="font-display text-lg font-bold uppercase tracking-wide text-charcoal"
            >
              {collection.name} guides &amp; reviews
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Editorial coverage matched to this category
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="flex flex-col rounded-md border border-border bg-card p-5 transition-shadow hover:shadow-lg"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {post.category} · {post.readMinutes} min read
                  </p>
                  <h3 className="mt-2 font-display text-sm font-bold leading-snug text-charcoal">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
                  >
                    Read guide
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14" aria-labelledby="collection-faq">
          <h2
            id="collection-faq"
            className="font-display text-lg font-bold uppercase tracking-wide text-charcoal"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-5 divide-y divide-border rounded-md border border-border bg-card">
            {collection.faqs.map((f) => (
              <div key={f.q} className="p-5">
                <dt className="text-sm font-semibold text-charcoal">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14" aria-labelledby="other-categories">
          <h2
            id="other-categories"
            className="font-display text-lg font-bold uppercase tracking-wide text-charcoal"
          >
            Other categories
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {COLLECTIONS.filter((c) => c.slug !== collection.slug).map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="rounded-md border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <p className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
                  {c.name}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {c.ogDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
