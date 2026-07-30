import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, MessageSquare, ShieldCheck, Truck, Wrench, Check } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { InquiryModal } from "@/components/site/InquiryModal";
import { productQuery, productsQuery } from "@/lib/data";
import { formatPrice, SITE } from "@/lib/site";
import { useCart } from "@/lib/cart";
import minerBlack from "@/assets/miner-black.jpg";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    context.queryClient.ensureQueryData(productsQuery());
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | Bitcoin Mining Depot" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — ${p.hashrate || "ASIC Miner"} | Bitcoin Mining Depot`;
    const description =
      p.short_description ||
      `Buy the ${p.name} ${p.brand} bitcoin miner with warranty, tested hashrate and worldwide shipping.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p.images?.[0]?.startsWith("https://")
          ? [
              { property: "og:image", content: p.images[0] },
              { name: "twitter:image", content: p.images[0] },
            ]
          : []),
      ],
    };
  },
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-charcoal">Product unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We could not load this product. Please try again or browse our full catalog.
        </p>
        <Link to="/products" className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Back to shop
        </Link>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-charcoal">Product not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This miner may have sold out or been renamed. Browse the current catalog instead.
        </p>
        <Link to="/products" className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Back to shop
        </Link>
      </div>
    </SiteLayout>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: all } = useSuspenseQuery(productsQuery());
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [inquiry, setInquiry] = useState(false);

  if (!product) return null;

  const images = product.images?.length ? product.images : [minerBlack];
  const price = product.sale_price ?? product.price;
  const related = all.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);

  return (
    <SiteLayout>
      <nav className="border-b border-border bg-secondary" aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-[1280px] flex-wrap gap-2 px-4 py-3 text-xs text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/products" className="hover:text-primary">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-charcoal">{product.name}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-10 lg:grid-cols-2">
        <div>
          <div className="rounded-md border border-border bg-card p-6">
            <img
              src={images[active]}
              alt={`${product.name} ${product.brand} bitcoin miner`}
              width={1000}
              height={1000}
              className="mx-auto h-[320px] w-full object-contain md:h-[420px]"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-20 w-20 overflow-hidden rounded-md border p-1 ${i === active ? "border-primary" : "border-border"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-charcoal md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.short_description}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-charcoal">
              {formatPrice(price)}
            </span>
            {product.sale_price && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="rounded-sm bg-success/15 px-2 py-1 text-[11px] font-semibold text-success">
              {product.stock_status}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Hashrate", product.hashrate],
              ["Power draw", product.power],
              ["Efficiency", product.efficiency],
              ["Algorithm", product.algorithm],
              ["Condition", product.condition],
            ]
              .filter(([, v]) => v && v !== "-")
              .map(([k, v]) => (
                <div key={k} className="rounded-md border border-border bg-card px-3 py-2">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-charcoal">{v}</dd>
                </div>
              ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center rounded-md border border-border">
              <button
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="px-4 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                aria-label="Quantity"
                className="w-12 border-x border-border text-center text-sm outline-none"
              />
              <button
                onClick={() => setQty((n) => n + 1)}
                className="px-4 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                add(
                  {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price,
                    image: images[0],
                  },
                  qty,
                );
                toast.success(`${qty} × ${product.name} added to cart`);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-ice"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Add to cart
            </button>
            <button
              onClick={() => setInquiry(true)}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-primary px-6 text-sm font-semibold uppercase tracking-wide text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" /> Request quote
            </button>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Warranty backed and
              bench-tested before dispatch
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" aria-hidden="true" /> Insured worldwide freight
              with pre-filled customs paperwork
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" aria-hidden="true" /> In-house repair lab for
              the life of the machine
            </li>
          </ul>

          <p className="mt-6 text-xs text-muted-foreground">
            Questions about this model? Call {SITE.phone} or email{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </div>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
              Product overview
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {product.description.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <h2 className="mt-10 font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
              What is included
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Miner unit with original manufacturer packaging",
                "Matched power supply where applicable",
                "Bench test report with measured hashrate",
                "Warranty registration and RMA instructions",
                "Pool and firmware configuration guidance",
                "Access to our technical support desk 24/7",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-md border border-border bg-card text-sm">
              {Object.entries(product.specs ?? {}).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium text-charcoal">{String(v)}</dd>
                </div>
              ))}
              {product.hashrate && product.hashrate !== "-" && (
                <div className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-muted-foreground">Hashrate</dt>
                  <dd className="font-medium text-charcoal">{product.hashrate}</dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 py-12">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
            Related hardware
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <InquiryModal
        open={inquiry}
        onOpenChange={setInquiry}
        mode="product"
        product={{
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          price,
          hashrate: product.hashrate,
          power: product.power,
          condition: product.condition,
        }}
      />
    </SiteLayout>
  );
}