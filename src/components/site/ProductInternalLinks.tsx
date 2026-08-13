import { Link } from "@tanstack/react-router";

import type { Product } from "@/lib/data";
import { COLLECTIONS, postsForProduct, productAnchor } from "@/lib/collections";

/**
 * Keyword-rich internal linking module for product pages: pushes authority to
 * category hubs, sibling model pages and the guides that cover this exact model.
 */
export function ProductInternalLinks({
  product,
  products,
}: {
  product: Product;
  products: Product[];
}) {
  const guides = postsForProduct(product, 6);
  const used = /used|refurb/i.test(product.condition ?? "");

  const sameBrand = products
    .filter((p) => p.id !== product.id && p.brand === product.brand)
    .slice(0, 8);
  const alternatives = products
    .filter((p) => p.id !== product.id && p.brand !== product.brand)
    .slice(0, 8);

  const hubs = COLLECTIONS.filter((c) =>
    used ? true : c.slug !== "used-refurbished-asic-miners",
  ).slice(0, 4);

  return (
    <section className="border-t border-border bg-card" aria-labelledby="product-internal-links">
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <h2
          id="product-internal-links"
          className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal"
        >
          Keep researching the {product.name}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Compare this machine against other {product.brand} models, browse the category hubs it
          belongs to, and read the operator guides that cover its hashrate, efficiency and payback
          math.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-secondary p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
              More {product.brand} miners
            </h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              {sameBrand.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium text-charcoal hover:text-primary hover:underline"
                  >
                    {productAnchor(p)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products"
                  className="font-semibold text-primary hover:underline"
                >
                  Shop all bitcoin mining machines
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-secondary p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
              Alternatives to consider
            </h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              {alternatives.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="font-medium text-charcoal hover:text-primary hover:underline"
                  >
                    {productAnchor(p)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border bg-secondary p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
              Guides &amp; category hubs
            </h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              {guides.map((post) => (
                <li key={post.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="font-medium text-charcoal hover:text-primary hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
              {hubs.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
