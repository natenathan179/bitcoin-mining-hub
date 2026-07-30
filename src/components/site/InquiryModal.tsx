import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitToEmail, formatPrice, SITE } from "@/lib/site";
import type { CartItem } from "@/lib/cart";

export interface InquiryProduct {
  name: string;
  slug: string;
  brand?: string;
  price?: number;
  hashrate?: string;
  power?: string;
  condition?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "product" | "checkout";
  product?: InquiryProduct;
  items?: CartItem[];
  total?: number;
  onSuccess?: () => void;
}

export function InquiryModal({
  open,
  onOpenChange,
  mode,
  product,
  items = [],
  total = 0,
  onSuccess,
}: Props) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setDone(false);
      setQty(1);
    }
  }, [open]);

  const isCheckout = mode === "checkout";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    if (!get("name") || !get("email")) {
      toast.error("Please provide your name and email.");
      return;
    }

    const productLines = isCheckout
      ? items
          .map(
            (i) =>
              `${i.name} x${i.qty} — ${formatPrice(i.price)} each — ${formatPrice(i.price * i.qty)}`,
          )
          .join("\n")
      : `${product?.name} x${qty} — ${formatPrice(product?.price ?? 0)} each`;

    const payload: Record<string, string> = {
      "Request Type": isCheckout ? "Checkout / Order Request" : "Product Inquiry",
      "Full Name": get("name"),
      Email: get("email"),
      Phone: get("phone"),
      Company: get("company"),
      Country: get("country"),
      "Shipping Address": get("address"),
      Items: productLines,
      "Estimated Total": isCheckout
        ? formatPrice(total)
        : formatPrice((product?.price ?? 0) * qty),
      Message: get("message"),
      "Submitted From": SITE.url,
    };

    if (!isCheckout && product) {
      payload["Product Page"] = `${SITE.url}/products/${product.slug}`;
      payload["Product Brand"] = product.brand ?? "";
      payload["Hashrate"] = product.hashrate ?? "";
      payload["Power Draw"] = product.power ?? "";
      payload["Condition"] = product.condition ?? "";
      payload["Quantity"] = String(qty);
    }

    try {
      setSending(true);
      await submitToEmail(
        isCheckout
          ? `New Order Request from ${get("name")}`
          : `Product Inquiry: ${product?.name ?? "General"}`,
        payload,
      );
      setDone(true);
      toast.success("Request sent. Our sales team will reply shortly.");
      onSuccess?.();
    } catch {
      toast.error("Could not send your request. Please email " + SITE.email);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-wide">
            {isCheckout ? "Complete Your Order Request" : "Request a Quote"}
          </DialogTitle>
          <DialogDescription>
            {isCheckout
              ? "Send your cart to our sales desk. We reply with a final invoice, freight cost and payment options within one business day."
              : "Tell us about your deployment and we will reply with pricing, availability and lead time."}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
            <p className="font-display text-lg uppercase text-charcoal">Request received</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Thank you. A member of our sales team will contact you shortly at the email you
              provided. For urgent requests call {SITE.phone}.
            </p>
            <Button className="mt-2" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-md border border-border bg-secondary p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {isCheckout ? "Order Summary" : "Selected Product"}
              </p>
              {isCheckout ? (
                <ul className="mt-2 space-y-1 text-sm text-charcoal">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4">
                      <span>
                        {i.name} <span className="text-muted-foreground">x{i.qty}</span>
                      </span>
                      <span className="font-semibold">{formatPrice(i.price * i.qty)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t border-border pt-2 font-semibold">
                    <span>Estimated total</span>
                    <span>{formatPrice(total)}</span>
                  </li>
                </ul>
              ) : (
                <div className="mt-2 grid gap-1 text-sm text-charcoal sm:grid-cols-2">
                  <p className="font-semibold sm:col-span-2">{product?.name}</p>
                  {product?.brand && <p>Brand: {product.brand}</p>}
                  {product?.hashrate && <p>Hashrate: {product.hashrate}</p>}
                  {product?.power && <p>Power: {product.power}</p>}
                  {product?.condition && <p>Condition: {product.condition}</p>}
                  <p className="sm:col-span-2">Unit price: {formatPrice(product?.price ?? 0)}</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="iq-name">Full name *</Label>
                <Input id="iq-name" name="name" required maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-email">Email *</Label>
                <Input id="iq-email" name="email" type="email" required maxLength={255} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-phone">Phone / WhatsApp</Label>
                <Input id="iq-phone" name="phone" maxLength={40} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-company">Company</Label>
                <Input id="iq-company" name="company" maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-country">Country</Label>
                <Input id="iq-country" name="country" maxLength={80} />
              </div>
              {!isCheckout && (
                <div className="space-y-1.5">
                  <Label htmlFor="iq-qty">Quantity</Label>
                  <Input
                    id="iq-qty"
                    name="quantity"
                    type="number"
                    min={1}
                    max={10000}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="iq-address">
                  {isCheckout ? "Shipping address *" : "Delivery location"}
                </Label>
                <Input
                  id="iq-address"
                  name="address"
                  required={isCheckout}
                  maxLength={300}
                  placeholder="Street, city, state, postal code"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="iq-message">Additional details</Label>
                <Textarea
                  id="iq-message"
                  name="message"
                  rows={4}
                  maxLength={1500}
                  placeholder="Power cost, hosting needs, preferred payment method, timeline..."
                />
              </div>
            </div>

            <Button type="submit" disabled={sending} className="w-full">
              {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCheckout ? "Submit Order Request" : "Send Inquiry"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Your details are sent directly to {SITE.email}. We never share your information.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}