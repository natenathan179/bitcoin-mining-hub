import { Link } from "@tanstack/react-router";

import type { Product } from "@/lib/data";
import type { Collection } from "@/lib/collections";
import {
  brandLinkGroups,
  postsForProduct,
  productAnchor,
  spotlightProducts,
} from "@/lib/collections";

interface Props {
  collection: Collection;
  products: Product[];
}

function priceLabel(p: Product) {
  const value = p.sale_price ?? p.price;
  return value ? `$${value.toLocaleString("en-US")}` : "Request quote";
}

export function CollectionInternalLinks({ collection, products }: Props) {
  if (products.length === 0) return null;

  const groups = brandLinkGroups(products);
  const spotlights = spotlightProducts(products);

  return (
    <>
      <section className="mt-14" aria-labelledby="collection-brand-links">
        <h2
          id="collection-brand-links"
          className="font-display text-lg font-bold uppercase tracking-wide text-charcoal"
        >
          Browse {collection.name.toLowerCase()} by brand and model
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Jump straight to the model page for full specs, tested hashrate and current pricing.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="rounded-md border border-border bg-card p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
                {group.title} {collection.name.toLowerCase().includes("hosting") ? "plans" : "miners"}
              </h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                {group.products.map((p) => (
                  <li key={p.id} className="leading-snug">
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      className="font-medium text-charcoal hover:text-primary hover:underline"
                    >
                      {productAnchor(p)}
                    </Link>
                    <span className="block text-xs text-muted-foreground">
                      {p.condition} · {priceLabel(p)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/products"
                search={{ q: group.title, category: undefined }}
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                All {group.title} stock
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="collection-spotlights">
        <h2
          id="collection-spotlights"
          className="font-display text-lg font-bold uppercase tracking-wide text-charcoal"
        >
          Model spotlights and the guides that cover them
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Each machine is paired with the research we have published on that exact model or brand.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {spotlights.map((p) => {
            const related = postsForProduct(p);
            return (
              <article key={p.id} className="rounded-md border border-border bg-card p-5">
                <h3 className="font-display text-sm font-bold leading-snug text-charcoal">
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-primary hover:underline"
                  >
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[p.hashrate, p.power, p.efficiency, p.condition].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {p.short_description}
                </p>
                {related.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-[13px]">
                    {related.map((post) => (
                      <li key={post.slug}>
                        <Link
                          to="/blog/$slug"
                          params={{ slug: post.slug }}
                          className="text-primary hover:underline"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide">
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
                  >
                    View specs &amp; price
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-md border border-border px-3 py-2 text-charcoal hover:border-primary hover:text-primary"
                  >
                    Ask about stock
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
