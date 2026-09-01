import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { paymentMethodsQuery, type PaymentMethod } from "@/lib/data";
import { uploadProductImage } from "@/lib/storage";
import { formatPrice, submitToEmail, SITE } from "@/lib/site";
import { SeoCopy } from "@/components/site/SeoCopy";
import { PAGE_COPY } from "@/lib/page-copy";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Crypto Checkout | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Pay for your mining hardware with Bitcoin, USDT, Ethereum and more. Scan the wallet QR code, submit your transaction ID and delivery details, and we ship once confirmed.",
      },
      { property: "og:title", content: "Crypto Checkout | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content: "Select a cryptocurrency, scan the QR code, submit your transaction ID and delivery details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/checkout` }],
  }),
  component: CheckoutPage,
});

const STEPS = ["Review order", "Choose payment method", "Payment details & delivery"] as const;

const isCrypto = (m: PaymentMethod | null) => !m || m.kind === "crypto";
const isBank = (m: PaymentMethod | null) => m?.kind === "bank";
const isRequest = (m: PaymentMethod | null) => m?.kind === "cashapp" || m?.kind === "chime";

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { data: methods = [], isLoading } = useQuery(paymentMethodsQuery());
  const active = useMemo(() => methods.filter((m) => m.active), [methods]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Wallet address copied");
    } catch {
      toast.error("Could not copy — please select and copy manually");
    }
  }

  async function handleProofUpload(file: File) {
    try {
      setUploading(true);
      setProofUrl(await uploadProductImage(file));
      toast.success("Payment screenshot uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    if (isCrypto(selected) && !get("txid")) {
      toast.error("Please paste the transaction ID (hash) of your payment.");
      return;
    }

    const requestType = isCrypto(selected)
      ? "Crypto Order — Payment Submitted"
      : isBank(selected)
        ? "Bank Transfer Order — Account Details Requested"
        : `${selected?.name} Order — Awaiting Payment Request`;

    const payload: Record<string, string> = {
      "Request Type": requestType,
      "Payment Method": `${selected?.name} (${selected?.symbol})`,
      "Payment Network": selected?.network || "—",
      ...(isCrypto(selected)
        ? {
            "Receiving Address": selected?.address || "—",
            "Transaction ID": get("txid"),
            "Amount Sent": get("amount"),
            "Sending Wallet (optional)": get("wallet"),
          }
        : {}),
      ...(isRequest(selected)
        ? {
            "Customer Payment Handle": get("handle"),
            "Payment Screenshot": proofUrl || "Not uploaded yet — customer will send after paying",
          }
        : {}),
      ...(isBank(selected)
        ? { "Bank / Transfer Preference": get("banknote") || "Not specified" }
        : {}),
      Items: items
        .map(
          (i) =>
            `${i.name} x${i.qty} — ${formatPrice(i.price)} each — ${formatPrice(i.price * i.qty)}`,
        )
        .join("\n"),
      "Order Total (USD)": formatPrice(total),
      "Full Name": get("name"),
      Email: get("email"),
      Phone: get("phone"),
      Company: get("company"),
      "Tax / VAT ID": get("taxid"),
      "Address Line 1": get("address1"),
      "Address Line 2": get("address2"),
      City: get("city"),
      "State / Province": get("state"),
      "Postal Code": get("postal"),
      Country: get("country"),
      "Delivery Contact Person": get("contact"),
      "Preferred Delivery Method": get("delivery"),
      "Facility / Delivery Notes": get("notes"),
      "Submitted From": SITE.url,
    };

    try {
      setSending(true);
      await submitToEmail(`${selected?.name ?? "Order"} checkout from ${get("name")}`, payload);
      setDone(true);
      clear();
      toast.success(
        isCrypto(selected)
          ? "Payment details received. We are verifying your transaction."
          : "Order received. Our finance desk will contact you shortly.",
      );
    } catch {
      toast.error(`Could not submit. Please email ${SITE.email} with your transaction ID.`);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
          <h1 className="mt-5 font-display text-2xl font-bold uppercase text-charcoal">
            {isCrypto(selected)
              ? "Payment submitted — order pending confirmation"
              : "Order received — our finance desk will contact you"}
          </h1>
          {isCrypto(selected) ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you. Our finance team is verifying your transaction on-chain. Once the required
              network confirmations are reached you will receive an order confirmation and invoice by
              email, followed by freight documents and a tracking number when your hardware ships.
              For urgent questions call {SITE.phone} or email {SITE.email} and quote your
              transaction ID.
            </p>
          ) : isBank(selected) ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you. Our finance team is reviewing your order and will reply by email with the
              full bank account details — account name, account number, routing or SWIFT code and
              your unique payment reference. Complete the transfer from your bank, send us the
              transfer receipt, and we crate and ship once the funds clear. Questions? Call{" "}
              {SITE.phone} or email {SITE.email}.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you. Our finance team is reviewing your order and will send you a{" "}
              {selected?.name} payment request with the exact amount and the verified handle to pay.
              Confirm the request, complete the payment, then reply with a screenshot of the
              completed payment so we can release your order. Never pay a handle you receive from
              anyone other than {SITE.email} or {SITE.phone}.
            </p>
          )}
          <Button className="mt-6" onClick={() => navigate({ to: "/products" })}>
            Continue shopping
          </Button>
        </div>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-silver" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl uppercase text-charcoal">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add mining hardware to your cart to start the crypto checkout process.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Shop miners
          </Link>
        </div>
        <SeoCopy title={PAGE_COPY.checkout.title} blocks={PAGE_COPY.checkout.blocks} />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Secure crypto checkout"
        title="Choose How You Want To Pay"
        subtitle="Pay on-chain with cryptocurrency. Choose your coin, send the exact amount to the address and QR code shown, then submit your transaction ID — crypto payments are instant and fully self-service."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-10">
        {/* How it works */}
        <section className="rounded-md border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            How payment works — step by step
          </h2>
          <ol className="mt-4 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Wallet,
                title: "1. Select your cryptocurrency",
                body: "Choose the coin you want to pay with — each option shows its receiving address, network and a scannable QR code.",
              },
              {
                icon: ShieldCheck,
                title: "2. Send the payment",
                body: "Send the exact USD equivalent to the address shown, double-checking the network first. Network fees are paid by the sender.",
              },
              {
                icon: Truck,
                title: "3. Send your proof of payment",
                body: "Paste the transaction ID (TXID / hash) and we verify it on-chain. Once verified we invoice, crate and ship your miners.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-md bg-secondary p-4">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-2 text-sm font-semibold text-charcoal">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Important: cryptocurrency transfers are irreversible. Send only the coin shown, on the
            network shown, to the address shown on this page. Network fees are paid by the sender —
            make sure the amount that arrives matches your order total. Freight cost, duties and any
            balance differences are settled on the final invoice before dispatch.
          </p>
        </section>

        {/* Step indicator */}
        <ol className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`rounded-md px-3 py-2 ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-secondary text-charcoal"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {label}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            {step === 0 && (
              <section className="rounded-md border border-border bg-card p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                  Review your order
                </h2>
                <ul className="mt-4 divide-y divide-border">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center gap-4 py-3">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-16 w-16 shrink-0 object-contain"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-charcoal">{i.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(i.price)} × {i.qty}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-charcoal">
                        {formatPrice(i.price * i.qty)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  <Button onClick={() => setStep(1)}>Continue to payment</Button>
                  <Link
                    to="/cart"
                    className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-charcoal"
                  >
                    Edit cart
                  </Link>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="rounded-md border border-border bg-card p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                  Choose how you want to pay
                </h2>
                {isLoading ? (
                  <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading payment options…
                  </p>
                ) : active.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No payment methods are published yet. Please email {SITE.email} or call{" "}
                    {SITE.phone} and our sales desk will send you payment instructions directly.
                  </p>
                ) : (
                  <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {active.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelected(m);
                            setProofUrl("");
                          }}
                          className={`rounded-md border p-4 text-left ${
                            selected?.id === m.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="text-sm font-semibold text-charcoal">
                            {m.name} <span className="text-muted-foreground">({m.symbol})</span>
                          </p>
                          {m.network && (
                            <p className="text-xs text-muted-foreground">Network: {m.network}</p>
                          )}
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {m.kind === "crypto"
                              ? "On-chain payment · pay now, submit your TXID"
                              : m.kind === "bank"
                                ? "Reviewed by finance · we send account details"
                                : "Reviewed by finance · we send a payment request"}
                          </p>
                        </button>
                      ))}
                    </div>

                    {selected && isCrypto(selected) && (
                      <div className="mt-6 grid gap-6 rounded-md bg-secondary p-5 sm:grid-cols-[200px_1fr]">
                        {selected.qr_image_url ? (
                          <img
                            src={selected.qr_image_url}
                            alt={`${selected.name} (${selected.symbol}) ${selected.network} payment wallet QR code for Bitcoin Mining Depot`}
                            className="h-48 w-48 rounded-md border border-border bg-background object-contain p-2"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-48 w-48 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            QR code coming soon
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Send {selected.symbol} to this address
                          </p>
                          <p className="mt-1 break-all rounded-md border border-border bg-background p-3 font-mono text-xs text-charcoal">
                            {selected.address || "Contact sales for the wallet address"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            {selected.address && (
                              <button
                                type="button"
                                onClick={() => copy(selected.address)}
                                className="inline-flex items-center gap-2 rounded-md bg-charcoal px-3 py-2 text-xs font-semibold text-white"
                              >
                                <Copy className="h-3.5 w-3.5" /> Copy address
                              </button>
                            )}
                            <span className="inline-flex items-center rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
                              Amount due: {formatPrice(total)} in {selected.symbol}
                            </span>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {selected.instructions ||
                              `Scan the QR code with your wallet app or paste the address above. Send only ${selected.symbol}${selected.network ? ` on the ${selected.network} network` : ""}. Your order is released after ${selected.confirmations} network confirmation(s).`}
                          </p>
                        </div>
                      </div>
                    )}

                    {selected && !isCrypto(selected) && (
                      <div className="mt-6 rounded-md bg-secondary p-5">
                        <h3 className="text-sm font-semibold text-charcoal">
                          Paying with {selected.name} — here is exactly what happens
                        </h3>
                        <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                          <li>
                            <strong>Step 1:</strong> Continue and fill in your contact and delivery
                            details, plus{" "}
                            {isBank(selected)
                              ? "a short message telling us how you want to transfer (ACH, domestic wire or international SWIFT)."
                              : `the ${selected.name} handle you will pay from.`}
                          </li>
                          <li>
                            <strong>Step 2:</strong> Our finance desk reviews your order and replies
                            with{" "}
                            {isBank(selected)
                              ? "the full bank account details — account name, account number, routing/SWIFT code and a unique payment reference."
                              : `a ${selected.name} payment request showing the exact amount and our verified handle.`}
                          </li>
                          <li>
                            <strong>Step 3:</strong>{" "}
                            {isBank(selected)
                              ? "Complete the transfer from your bank and send us the transfer receipt."
                              : "Confirm the request, complete the payment, then send us a screenshot of the completed payment (you can upload it on the next step or reply to our email)."}
                          </li>
                          <li>
                            <strong>Step 4:</strong> We verify the funds, issue your invoice, then
                            crate and ship your hardware with tracking.
                          </li>
                        </ol>
                        {selected.handle && (
                          <p className="mt-3 text-xs text-charcoal">
                            Verified handle: <strong>{selected.handle}</strong>
                          </p>
                        )}
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          {selected.instructions}
                        </p>
                        {selected.review_note && (
                          <p className="mt-2 rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed text-muted-foreground">
                            {selected.review_note}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selected) return toast.error("Select a payment method to continue.");
                      setStep(2);
                    }}
                  >
                    {isCrypto(selected) ? "I have sent the payment" : "Continue"}
                  </Button>
                </div>
              </section>
            )}

            {step === 2 && selected && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isCrypto(selected) ? (
                <section className="rounded-md border border-border bg-card p-6">
                  <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                    Payment proof
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Open your wallet or exchange withdrawal history, copy the transaction ID (also
                    called TXID or transaction hash) of the payment you just sent, and paste it
                    below. This lets us match your payment on the blockchain instantly.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="co-txid">Transaction ID / hash *</Label>
                      <Input
                        id="co-txid"
                        name="txid"
                        required
                        maxLength={200}
                        placeholder="e.g. 4f8b1c9d3a…"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-amount">Amount sent</Label>
                      <Input
                        id="co-amount"
                        name="amount"
                        maxLength={60}
                        placeholder={`e.g. 0.0412 ${selected.symbol}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-wallet">Sending wallet address (optional)</Label>
                      <Input id="co-wallet" name="wallet" maxLength={200} />
                    </div>
                    <p className="text-xs text-muted-foreground sm:col-span-2">
                      Paying with: <strong>{selected.name} ({selected.symbol})</strong>
                      {selected.network ? ` · ${selected.network} network` : ""}
                    </p>
                  </div>
                </section>
                ) : (
                  <section className="rounded-md border border-border bg-card p-6">
                    <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                      {isBank(selected) ? "Bank transfer request" : `${selected.name} payment request`}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {isBank(selected)
                        ? "Tell us how you would like to transfer the funds. Our finance team reviews your order and replies with the full bank account details and a unique payment reference — we never publish account numbers on the website."
                        : `Enter the ${selected.name} handle you will pay from. Our finance team reviews your order and sends you a payment request with the exact amount and our verified handle. After you pay, upload a screenshot of the completed payment below (or reply to our email with it) so we can release your order.`}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {isBank(selected) ? (
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="co-banknote">Your message to our finance team *</Label>
                          <Textarea
                            id="co-banknote"
                            name="banknote"
                            rows={4}
                            required
                            maxLength={1200}
                            placeholder="e.g. I would like to pay by domestic wire from a US business account, and I need an invoice addressed to my company."
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <Label htmlFor="co-handle">
                              Your {selected.name} handle / tag *
                            </Label>
                            <Input
                              id="co-handle"
                              name="handle"
                              required
                              maxLength={100}
                              placeholder={selected.kind === "cashapp" ? "$yourcashtag" : "your Chime handle"}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Payment screenshot (upload after you pay)</Label>
                            {proofUrl ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={proofUrl}
                                  alt="Uploaded payment screenshot preview"
                                  className="h-20 w-20 rounded-md border border-border object-contain p-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => setProofUrl("")}
                                  className="text-xs text-destructive"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground">
                                {uploading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4" aria-hidden="true" /> Upload screenshot
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  aria-label="Upload payment screenshot"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleProofUpload(f);
                                  }}
                                />
                              </label>
                            )}
                            <p className="text-[11px] text-muted-foreground">
                              Optional now — you can also send it by email once you have paid.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                )}

                <section className="rounded-md border border-border bg-card p-6">
                  <h2 className="font-display text-lg uppercase tracking-wide text-charcoal">
                    Delivery information
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Provide complete details — freight carriers require an exact address and a
                    reachable contact person for industrial equipment deliveries.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="co-name">Full name *</Label>
                      <Input id="co-name" name="name" required maxLength={100} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-email">Email *</Label>
                      <Input id="co-email" name="email" type="email" required maxLength={255} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-phone">Phone / WhatsApp *</Label>
                      <Input id="co-phone" name="phone" required maxLength={40} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-company">Company (optional)</Label>
                      <Input id="co-company" name="company" maxLength={120} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-taxid">Tax / VAT / EIN (optional)</Label>
                      <Input id="co-taxid" name="taxid" maxLength={60} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-contact">On-site contact person (optional)</Label>
                      <Input id="co-contact" name="contact" maxLength={120} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="co-address1">Address line 1 *</Label>
                      <Input
                        id="co-address1"
                        name="address1"
                        required
                        maxLength={200}
                        placeholder="Street address, warehouse or facility name"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="co-address2">Address line 2 (optional)</Label>
                      <Input
                        id="co-address2"
                        name="address2"
                        maxLength={200}
                        placeholder="Suite, unit, dock number"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-city">City *</Label>
                      <Input id="co-city" name="city" required maxLength={100} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-state">State / Province *</Label>
                      <Input id="co-state" name="state" required maxLength={100} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-postal">Postal / ZIP code *</Label>
                      <Input id="co-postal" name="postal" required maxLength={30} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="co-country">Country *</Label>
                      <Input id="co-country" name="country" required maxLength={80} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="co-delivery">Preferred delivery method</Label>
                      <select
                        id="co-delivery"
                        name="delivery"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option>Air freight (fastest)</option>
                        <option>Sea freight (lowest cost, bulk)</option>
                        <option>Courier (DHL / FedEx / UPS)</option>
                        <option>Domestic LTL trucking</option>
                        <option>Pickup / forwarder collection</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="co-notes">Delivery notes</Label>
                      <Textarea
                        id="co-notes"
                        name="notes"
                        rows={4}
                        maxLength={1500}
                        placeholder="Loading dock availability, forklift access, receiving hours, customs broker details, preferred delivery date."
                      />
                    </div>
                  </div>
                </section>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back to payment
                  </Button>
                  <Button type="submit" disabled={sending}>
                    {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCrypto(selected)
                      ? "Submit payment & delivery details"
                      : isBank(selected)
                        ? "Request bank account details"
                        : "Submit order & request payment"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <aside className="h-fit space-y-4 rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Order summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Items ({items.length})</dt>
                <dd className="font-semibold text-charcoal">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Freight</dt>
                <dd className="text-charcoal">Quoted per destination</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-semibold text-charcoal">Amount to pay now</dt>
                <dd className="font-bold text-charcoal">{formatPrice(total)}</dd>
              </div>
            </dl>
            {selected && isCrypto(selected) && (
              <p className="rounded-md bg-secondary p-3 text-xs text-muted-foreground">
                Paying in <strong>{selected.symbol}</strong>
                {selected.network ? ` on ${selected.network}` : ""} · released after{" "}
                {selected.confirmations} confirmation(s).
              </p>
            )}
            {selected && !isCrypto(selected) && (
              <p className="rounded-md bg-secondary p-3 text-xs text-muted-foreground">
                Paying with <strong>{selected.name}</strong> ·{" "}
                {isBank(selected)
                  ? "account details sent after review"
                  : "payment request sent after review"}
                .
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Need help mid-payment? Email {SITE.email} or call {SITE.phone}. Never send funds to an
              address received by email or chat — only use the address published on this checkout
              page.
            </p>
          </aside>
        </div>
      </div>
      <SeoCopy title={PAGE_COPY.checkout.title} blocks={PAGE_COPY.checkout.blocks} />
    </SiteLayout>
  );
}
