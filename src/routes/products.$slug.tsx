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

import type { Product } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function buildFaqs(p: Product) {
  const price = p.sale_price ?? p.price;
  const priceLabel = price ? `$${Number(price).toLocaleString("en-US")}` : "the listed price";
  const algo = p.algorithm && p.algorithm !== "-" ? p.algorithm : "SHA-256";
  const isHydro = /hydro|water|immersion/i.test(`${p.name} ${p.slug} ${p.short_description ?? ""}`);
  const faqs = [
    {
      q: `Is the ${p.name} profitable in ${new Date().getFullYear()}?`,
      a: `Profitability for the ${p.name} depends on three variables: your electricity rate, the ${algo} network difficulty, and the coin price. As a rule of thumb, a machine rated ${p.hashrate && p.hashrate !== "-" ? p.hashrate : "at this hashrate"}${p.power && p.power !== "-" ? ` drawing ${p.power}` : ""} stays profitable at power costs under roughly $0.08/kWh, and is comfortable under $0.05/kWh in hosted or industrial facilities. Send us your kWh rate and we will run a live daily-revenue and break-even model for your exact setup before you buy.`,
    },
    {
      q: `What is the ROI or payback period on the ${p.name}?`,
      a: `At ${priceLabel} hardware cost, typical payback for this class of miner runs about 12–24 months at $0.06–0.07/kWh, and can shorten to 8–14 months at industrial rates near $0.04/kWh. ROI improves when difficulty flattens or the coin price rises, and lengthens after each difficulty increase, so we recommend modelling a conservative case. Our team provides a free written ROI projection with every quote.`,
    },
    {
      q: `How much power does the ${p.name} use and what electrical setup do I need?`,
      a:
        p.power && p.power !== "-"
          ? `The ${p.name} draws approximately ${p.power}${p.efficiency && p.efficiency !== "-" ? ` at an efficiency of ${p.efficiency}` : ""}. It requires a dedicated 200–240V circuit with a suitable breaker and a C13/C19 or equivalent PDU connection — a standard 110V residential outlet is not sufficient. Plan for continuous load, not peak, and leave 20% breaker headroom.`
          : `The ${p.name} requires a dedicated 200–240V circuit rather than a standard residential outlet, plus a PDU rated for continuous load with 20% breaker headroom. Contact our team for the exact amperage and connector requirements of your configuration.`,
    },
    {
      q: `How do I set up the ${p.name}?`,
      a: `Setup takes under 30 minutes: rack or shelf the unit with clear intake and exhaust airflow, connect the 200–240V PSU feed, plug in Ethernet (Wi-Fi is not supported), then find the miner's IP with the manufacturer's IP reporter or your router's DHCP list. Log in to the web dashboard, enter your mining pool URL, worker name and password, save, and confirm the hashrate stabilises at the rated figure within 15–20 minutes. We ship a printed quick-start guide and offer free remote setup support.`,
    },
    {
      q: `What hosting, cooling and noise should I plan for with the ${p.name}?`,
      a: `Air-cooled units of this class run around 70–80 dB — too loud for a home office or apartment, so most buyers use a garage, dedicated shed, or a professional hosting facility. Keep intake air below 35°C and maintain negative-pressure exhaust so hot air is never recirculated. Bitcoin Mining Depot offers hosting from $0.06–0.08/kWh with 24/7 monitoring if you would rather not run the hardware yourself.`,
    },
    {
      q: `Which coins and pools can the ${p.name} mine?`,
      a: `The ${p.name} is an ${algo} ASIC, so it mines coins on that algorithm only — it cannot be reprogrammed for other algorithms. It works with all major pools (F2Pool, ViaBTC, Antpool, Foundry USA, Luxor and others) using standard stratum configuration, and supports up to three pool endpoints for automatic failover.`,
    },
    {
      q: `How much does the ${p.name} cost and do you offer bulk pricing?`,
      a: `This unit is listed at ${priceLabel}. Orders of 5+ units qualify for wholesale tiers, and 50+ unit deployments receive container-level pricing with dedicated logistics. We accept bank wire, USDT and BTC; escrow is available on large orders. Request a quote and we will confirm live stock and landed cost to your location.`,
    },
    {
      q: `Is the ${p.name} new or used?`,
      a: `This ${p.name} is supplied in ${p.condition || "tested"} condition. Every unit is bench tested before dispatch and ships with a measured hashrate report.`,
    },
    {
      q: `What warranty comes with the ${p.name}?`,
      a: "New miners carry the manufacturer warranty, normally 12 months. Refurbished and used units carry a 6 month Bitcoin Mining Depot warranty handled by our in-house repair lab.",
    },
    {
      q: `How is the ${p.name} shipped?`,
      a: "In-stock units dispatch within one to three business days on insured, tracked freight with pre-filled customs paperwork. We ship to more than 100 countries.",
    },
    {
      q: `Can I return the ${p.name} if it does not perform as rated?`,
      a: `Yes. Every unit is hashrate-verified before dispatch, and if a miner arrives dead-on-arrival or hashes materially below spec, report it within 7 days of delivery for a replacement or repair at our cost. Our in-house lab also handles out-of-warranty hashboard, PSU and control-board repairs.`,
    },
  ];

  if (isHydro) {
    faqs.push(
      {
        q: `What water cooling loop does the ${p.name} require?`,
        a: `The ${p.name} is a hydro-cooled ASIC and cannot run on air. It must be plumbed into a closed water loop with a dry cooler or cooling tower, a circulation pump, filtration and a coolant reservoir. Plan for roughly 55–65°C outlet temperature, an inlet target of 30–45°C, and a flow rate around 6–8 litres per minute per unit. Bitcoin Mining Depot supplies matched hydro containers, manifolds and quick-connect fittings with every order.`,
      },
      {
        q: `What coolant and water quality does the ${p.name} need?`,
        a: `Use deionised or distilled water with a corrosion-inhibiting glycol mix (typically 10–20%) — never untreated tap water, which scales the cold plates and voids warranty. Check pH quarterly, keep particulate filtration at 50 microns or finer, and flush the loop annually. We include a coolant specification sheet and can pre-commission your loop before shipping.`,
      },
      {
        q: `How much heat can I recover from the ${p.name}?`,
        a: `Almost all of the ${p.power && p.power !== "-" ? p.power : "rated input power"} leaves the machine as hot water, so a single unit can feed district heating, greenhouses, drying rooms or industrial process water. Heat recovery commonly cuts effective mining cost by $0.01–0.02/kWh, materially shortening the payback period versus an air-cooled deployment.`,
      },
      {
        q: `Is the ${p.name} quieter than an air-cooled miner?`,
        a: `Yes. Hydro units run around 45–50 dB versus 70–80 dB for air-cooled ASICs because there are no high-RPM fans in the miner itself — the only noise comes from the pump and external dry cooler. That makes hydro viable on sites with residential noise limits where air-cooled machines are not.`,
      },
      {
        q: `What three-phase power and site infrastructure does the ${p.name} need?`,
        a: `Hydro machines of this class run on industrial three-phase service (typically 380–480V) with a correctly sized breaker per unit and a hydro-rated PDU — single-phase residential service is not sufficient. Budget the electrical build, the cooling loop and pump load together. Send us your one-line diagram and site plan and we will confirm feasibility before you order.`,
      },
      {
        q: `Does hydro cooling improve profitability and lifespan for the ${p.name}?`,
        a: `On both counts. Stable liquid-cooled chip temperatures let the unit hold rated hashrate without thermal throttling, so real-world output tracks spec far more closely than air-cooled hardware in warm climates. Lower thermal cycling and zero dust ingress also extend hashboard life, improving realised ROI across a three to four year deployment.`,
      },
    );
  }

  return faqs;
}

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
    const url = `/products/${p.slug}`;
    const image = p.images?.filter((i) => i?.startsWith("https://")) ?? [];
    const price = p.sale_price ?? p.price;
    const inStock = /out|sold/i.test(p.stock_status ?? "")
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
    const productFaqs = buildFaqs(p);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image[0]
          ? [
              { property: "og:image", content: image[0] },
              { name: "twitter:image", content: image[0] },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            sku: p.slug,
            mpn: p.slug,
            description,
            ...(image.length ? { image } : {}),
            brand: { "@type": "Brand", name: p.brand },
            category: p.algorithm ? `ASIC Miner / ${p.algorithm}` : "ASIC Miner",
            itemCondition: /new/i.test(p.condition ?? "")
              ? "https://schema.org/NewCondition"
              : "https://schema.org/RefurbishedCondition",
            additionalProperty: [
              ["Hashrate", p.hashrate],
              ["Power draw", p.power],
              ["Efficiency", p.efficiency],
              ["Algorithm", p.algorithm],
              ...Object.entries(p.specs ?? {}),
            ]
              .filter(([, v]) => v && v !== "-")
              .map(([name, value]) => ({
                "@type": "PropertyValue",
                name,
                value: String(value),
              })),
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "USD",
              price: price ? String(price) : "0",
              availability: inStock,
              itemCondition: /new/i.test(p.condition ?? "")
                ? "https://schema.org/NewCondition"
                : "https://schema.org/RefurbishedCondition",
              seller: { "@type": "Organization", name: "Bitcoin Mining Depot" },
              priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
                .toISOString()
                .slice(0, 10),
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: {
                  "@type": "DefinedRegion",
                  addressCountry: ["US", "CA", "GB", "AE", "AU"],
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 1,
                    maxValue: 3,
                    unitCode: "DAY",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 2,
                    maxValue: 12,
                    unitCode: "DAY",
                  },
                },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "US",
                returnPolicyCategory:
                  "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 30,
                returnMethod: "https://schema.org/ReturnByMail",
                returnFees: "https://schema.org/ReturnShippingFees",
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "/products" },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: productFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
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
              alt={`${product.name} ${product.hashrate && product.hashrate !== "-" ? `${product.hashrate} ` : ""}${product.algorithm || "SHA-256"} ASIC miner${product.power && product.power !== "-" ? ` at ${product.power}` : ""} — ${product.brand} ${product.condition || "new"} unit for sale at Bitcoin Mining Depot`}
              title={`${product.brand} ${product.name} ASIC miner`}
              width={1000}
              height={1000}
              fetchPriority="high"
              className="mx-auto h-[320px] w-full object-contain md:h-[420px]"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1} of the ${product.name}`}
                  className={`h-20 w-20 overflow-hidden rounded-md border p-1 ${i === active ? "border-primary" : "border-border"}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${product.brand} ASIC miner — product photo ${i + 1}`}
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
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

      <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-[860px] px-4 py-12">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
              {product.name} — frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-4 w-full">
              {buildFaqs(product).map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-charcoal">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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