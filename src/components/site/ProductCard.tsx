import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import type { Product } from "@/lib/data";
import minerBlack from "@/assets/miner-black.jpg";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const price = product.sale_price ?? product.price;
  const image = product.images?.[0] || minerBlack;

  return (
    <article
      className="group relative flex flex-col rounded-md border border-border bg-card p-3 transition-shadow hover:shadow-lg"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="absolute left-3 top-3 z-10 rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
        {product.stock_status}
      </span>
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
        <img
          src={image}
          alt={`${product.name} ${product.brand} ASIC bitcoin miner`}
          loading="lazy"
          width={800}
          height={800}
          className="mx-auto h-36 w-full object-contain transition-transform group-hover:scale-[1.03]"
        />
        <h3 className="mt-3 text-[13px] font-semibold leading-tight text-charcoal">
          {product.name}
        </h3>
      </Link>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {product.hashrate && <span className="text-destructive">{product.hashrate}</span>}
        {product.hashrate && product.power ? " | " : ""}
        {product.power}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {product.algorithm} · {product.condition}
      </p>
      <p className="mt-2 text-base font-bold text-charcoal">
        {formatPrice(price)}
        {product.sale_price && (
          <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <button
          onClick={() => {
            add({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price,
              image,
            });
            toast.success(`${product.name} added to cart`);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-ice"
        >
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" /> Add to Cart
        </button>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="rounded-md border border-border py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal hover:border-primary hover:text-primary"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}