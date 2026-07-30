import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { InquiryModal } from "@/components/site/InquiryModal";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Review your selected bitcoin mining hardware and submit an order request. Our sales desk replies with a final invoice, freight cost and payment options.",
      },
      { property: "og:title", content: "Your Cart | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content: "Review selected miners and submit an order request to our sales desk.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/cart" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Checkout"
        title="Your Cart"
        subtitle="Submit your cart as an order request. We confirm stock, calculate freight to your address and send a final invoice with payment options including bank wire, card and crypto."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-silver" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl uppercase text-charcoal">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our in-stock miners and add hardware to build your order.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Shop miners
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-4"
                >
                  <img
                    src={i.image}
                    alt={i.name}
                    className="h-20 w-20 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-[160px] flex-1">
                    <Link
                      to="/products/$slug"
                      params={{ slug: i.slug }}
                      className="font-semibold text-charcoal hover:text-primary"
                    >
                      {i.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatPrice(i.price)} each</p>
                  </div>
                  <div className="flex h-10 items-center rounded-md border border-border">
                    <button
                      onClick={() => setQty(i.id, i.qty - 1)}
                      className="px-3"
                      aria-label={`Decrease quantity of ${i.name}`}
                    >
                      −
                    </button>
                    <span className="w-10 border-x border-border text-center text-sm">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.id, i.qty + 1)}
                      className="px-3"
                      aria-label={`Increase quantity of ${i.name}`}
                    >
                      +
                    </button>
                  </div>
                  <p className="w-24 text-right font-semibold text-charcoal">
                    {formatPrice(i.price * i.qty)}
                  </p>
                  <button
                    onClick={() => remove(i.id)}
                    aria-label={`Remove ${i.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={clear}
                  className="text-xs font-semibold uppercase text-muted-foreground hover:text-destructive"
                >
                  Clear cart
                </button>
              </li>
            </ul>

            <aside className="h-fit rounded-md border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
                Order summary
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold text-charcoal">{formatPrice(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Freight</dt>
                  <dd className="text-charcoal">Quoted per destination</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <dt className="font-semibold text-charcoal">Estimated total</dt>
                  <dd className="font-bold text-charcoal">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                onClick={() => setCheckout(true)}
                className="mt-5 w-full rounded-md bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-ice"
              >
                Proceed to checkout
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Checkout submits an order request to our sales desk. No payment is taken online —
                you receive a formal invoice with verified stock and freight before paying.
              </p>
            </aside>
          </div>
        )}
      </div>

      <InquiryModal
        open={checkout}
        onOpenChange={setCheckout}
        mode="checkout"
        items={items}
        total={total}
        onSuccess={clear}
      />
    </SiteLayout>
  );
}