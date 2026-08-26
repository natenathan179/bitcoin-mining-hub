import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Truck,
  Lock,
  Package,
  Headphones,
  Cpu,
  Recycle,
  Plug,
  Snowflake,
  Server,
  Wrench,
  Boxes,
  Layers,
  Award,
  Globe,
  Users,
  Clock,
  Mail,
  Quote,
  RotateCcw,
  BadgeCheck,
  Tag,
  ArrowRight,
  Bitcoin,
} from "lucide-react";

import heroImg from "@/assets/hero-mining-facility.webp";
import hero640 from "@/assets/hero-mining-facility-640.webp";
import hero1024 from "@/assets/hero-mining-facility-1024.webp";
import hero1440 from "@/assets/hero-mining-facility-1440.webp";
import heroMiner from "@/assets/hero-miner-3d.webp";
import articleProfit from "@/assets/article-profit.jpg";
import articleFarm from "@/assets/article-farm.jpg";
import articleRepair from "@/assets/article-repair.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Stars } from "@/components/site/Stars";
import { categoriesQuery, homeProductsQuery, topReviewsQuery } from "@/lib/data";
import { submitToEmail, SITE, SHIPPING_REGIONS } from "@/lib/site";

const HERO_SRCSET = `${hero640} 640w, ${hero1024} 1024w, ${hero1440} 1440w, ${heroImg} 1920w`;

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(homeProductsQuery());
    context.queryClient.ensureQueryData(categoriesQuery());
    context.queryClient.ensureQueryData(topReviewsQuery());
  },
  head: () => ({
    meta: [
      { title: "Bitcoin Mining Depot | ASIC Miners & Bitcoin Mining Machines" },
      {
        name: "description",
        content:
          "Hong Kong-based supplier of genuine ASIC miners — Bitmain Antminer, WhatsMiner and Avalon. Wholesale pricing, hosting and fast worldwide delivery to the USA, Canada, Europe and 100+ countries.",
      },
      { property: "og:title", content: "Bitcoin Mining Depot | ASIC Miners for Every Scale" },
      {
        property: "og:description",
        content:
          "Genuine bitcoin mining hardware, hosting and ASIC repair, shipped from Hong Kong to the USA, Canada, Europe and worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      {
        rel: "preload",
        as: "image",
        href: hero1440,
        imageSrcSet: HERO_SRCSET,
        imageSizes: "100vw",
        fetchPriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE.url}/#business`,
          name: SITE.name,
          url: SITE.url,
          telephone: SITE.phone,
          email: SITE.email,
          description:
            "Supplier of genuine ASIC bitcoin miners with wholesale pricing, hosting, repair services and worldwide shipping.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Tower 1, Times Square, 34號 Matheson St",
            addressLocality: "Causeway Bay",
            addressRegion: "Hong Kong Island",
            addressCountry: "HK",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "09:00",
              closes: "18:00",
            },
          ],
          areaServed: [
            { "@type": "Country", name: "United States" },
            { "@type": "Country", name: "Canada" },
            { "@type": "Place", name: "Europe" },
            { "@type": "Place", name: "Worldwide" },
          ],
          priceRange: "$$$",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.url}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Index,
});

const TRUST = [
  { icon: ShieldCheck, title: "Genuine Products", sub: "100% Authentic Miners" },
  { icon: Truck, title: "Worldwide Shipping", sub: "USA, Canada, Europe & 100+ countries" },
  { icon: Lock, title: "Secure Payments", sub: "Bank Wire, Card & Crypto" },
  { icon: Package, title: "Wholesale Pricing", sub: "Best Prices for Bulk Orders" },
  { icon: Headphones, title: "24/7 Support", sub: "Expert Technical Support" },
];

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  bitcoin: Bitcoin,
  cpu: Cpu,
  recycle: Recycle,
  layers: Layers,
  plug: Plug,
  snowflake: Snowflake,
  server: Server,
  boxes: Boxes,
  wrench: Wrench,
  tag: Tag,
};

const BRANDS = [
  { name: "BITMAIN", sub: "ANTMINER" },
  { name: "whatsminer", sub: "MICROBT" },
  { name: "canaan", sub: "AVALON" },
  { name: "ELPHAPEX", sub: "MINING DONE RIGHT" },
  { name: "iPollo", sub: "" },
  { name: "Goldshell", sub: "" },
];

const STATS = [
  { icon: Award, value: "10+", label: "Years in Business" },
  { icon: Cpu, value: "50,000+", label: "Miners Sold" },
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Globe, value: "100+", label: "Countries Shipped From Hong Kong" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const ARTICLES = [
  {
    img: articleProfit,
    slug: "most-profitable-bitcoin-miners",
    title: "The Most Profitable Bitcoin Miners This Year",
    date: "May 10, 2026",
    tag: "Mining Guides",
  },
  {
    img: articleFarm,
    slug: "how-to-start-a-mining-farm",
    title: "How to Start a Bitcoin Mining Farm: Full Playbook",
    date: "May 6, 2026",
    tag: "Setup Guides",
  },
  {
    img: articleRepair,
    slug: "asic-maintenance-guide",
    title: "ASIC Miner Maintenance Tips to Extend Lifespan",
    date: "May 1, 2026",
    tag: "Maintenance",
  },
];

const GUARANTEES = [
  { icon: Lock, title: "Secure", sub: "Checkout" },
  { icon: RotateCcw, title: "30 Days", sub: "Easy Returns" },
  { icon: BadgeCheck, title: "1 Year", sub: "Warranty" },
  { icon: Headphones, title: "Expert", sub: "Support" },
  { icon: Tag, title: "Price Match", sub: "Guarantee" },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    try {
      setSending(true);
      await submitToEmail("Newsletter Subscription", { Email: email, Source: "Homepage" });
      toast.success("You're subscribed. Welcome aboard.");
      setEmail("");
    } catch {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="mt-5" onSubmit={subscribe}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        maxLength={255}
        className="h-11 w-full rounded-md border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      <button
        disabled={sending}
        className="mt-3 h-11 w-full rounded-md bg-primary text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-ice disabled:opacity-60"
      >
        {sending ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} aria-hidden="true" />;
}

function CategoryGrid() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
      {categories.map((c) => {
        const Icon = CATEGORY_ICONS[c.icon] ?? Cpu;
        return (
          <Link
            key={c.id}
            to="/products"
            search={{ category: c.slug, q: undefined }}
            className="flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-card px-2 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="text-[11px] font-medium leading-tight text-charcoal">{c.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

function ProductShowcase() {
  const { data: products } = useSuspenseQuery(homeProductsQuery());
  const featured = products.filter((p) => p.featured);
  const showcase = (featured.length ? featured : products).slice(0, 6);

  if (showcase.length === 0) {
    return (
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Products are being restocked. Contact our sales desk for current availability.
      </p>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {showcase.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ReviewsList() {
  const { data: topReviews } = useSuspenseQuery(topReviewsQuery());
  return (
    <ul className="mt-6 space-y-6">
      {topReviews.map((r) => (
        <li key={r.id} className="flex gap-3">
          <Quote className="h-6 w-6 shrink-0 text-silver" aria-hidden="true" />
          <div>
            <p className="text-sm leading-relaxed text-charcoal">{r.body}</p>
            <div className="mt-2">
              <Stars rating={r.rating} />
            </div>
            <p className="mt-2 text-sm font-semibold text-charcoal">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.location}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden bg-navy md:min-h-[520px] lg:min-h-[600px]">
        <img
          src={hero1440}
          srcSet={HERO_SRCSET}
          alt="Rows of enterprise bitcoin mining machines in a data center"
          width={1920}
          height={912}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%] opacity-90"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
          <div>
          <h1 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-charcoal-foreground md:text-6xl">
            Enterprise Bitcoin Mining Machines
            <span className="block text-ice">For Every Scale</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal-foreground/80 md:text-base">
            Based in Causeway Bay, Hong Kong, we ship genuine ASIC miners, accessories and complete
            mining solutions worldwide — with fast, tracked delivery to the USA, Canada, Europe and
            100+ other countries. Every machine is bench-tested, warranty-backed and shipped from
            stock.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ice"
            >
              <Package className="h-4 w-4" aria-hidden="true" /> Shop Miners
            </Link>
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-2 rounded-md border border-charcoal-foreground/40 px-6 py-3 text-sm font-semibold text-charcoal-foreground transition-colors hover:bg-charcoal-foreground/10"
            >
              <Users className="h-4 w-4" aria-hidden="true" /> Request Wholesale Pricing
            </Link>
          </div>
          </div>

          {/* Animated miner visual */}
          <div className="relative hidden aspect-square w-full max-w-[520px] justify-self-center lg:flex lg:items-center lg:justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                backgroundSize: "22px 22px",
                color: "color-mix(in oklch, var(--color-charcoal-foreground) 25%, transparent)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2rem] bg-primary/85"
            />
            <img
              src={heroMiner}
              alt="Antminer ASIC bitcoin miner with red LED lighting"
            width={800}
            height={800}
              decoding="async"
              loading="lazy"
              className="animate-hero-float relative h-auto w-[86%] drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-charcoal text-charcoal-foreground">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 px-2">
              <Icon className="h-6 w-6 shrink-0 text-ice" aria-hidden="true" />
              <div className="text-[11px] leading-tight">
                <p className="font-semibold uppercase tracking-wide">{title}</p>
                <p className="text-charcoal-foreground/70">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <h2 className="mb-6 text-center font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
          Shop by Category
        </h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[110px]" />
              ))}
            </div>
          }
        >
          <CategoryGrid />
        </Suspense>
      </section>

      {/* Brands */}
      <section className="mx-auto max-w-[1280px] px-4 pb-10">
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-border" />
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
            Featured Brands
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              to="/products"
              search={{ q: b.sub || b.name, category: undefined }}
              className="text-center opacity-80 hover:opacity-100"
            >
              <span className="block font-display text-lg font-bold uppercase tracking-wide text-charcoal">
                {b.name}
              </span>
              {b.sub && (
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {b.sub}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-[1280px] px-4 pb-12">
        <div className="relative flex items-center justify-center">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
            Best Selling Miners
          </h2>
          <Link
            to="/products"
            className="absolute right-0 hidden items-center gap-1 text-xs font-semibold uppercase text-primary sm:flex"
          >
            View All Products <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          }
        >
          <ProductShowcase />
        </Suspense>
      </section>

      {/* Why us */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal md:text-3xl">
              Why buyers choose Bitcoin Mining Depot
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Mining hardware is a capital purchase, not an impulse buy. A single container of
              miners represents hundreds of thousands of dollars in equipment and years of expected
              revenue, so the vendor you buy from matters as much as the machine you choose. We
              built Bitcoin Mining Depot around the three things professional operators consistently
              tell us they cannot get elsewhere: verifiable hardware provenance, honest test data,
              and after-sales support that answers on the first call.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every new miner we sell is sourced through authorised distribution channels and ships
              with manufacturer warranty registration intact. Every used or refurbished miner is
              stripped, cleaned, re-pasted and burn-in tested for at least 48 hours before it is
              graded, and we publish hashboard chip counts and measured hashrate before you pay. If
              a machine fails, our in-house repair lab handles diagnosis, hashboard replacement and
              return shipping.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Authorised sourcing",
                body: "Direct relationships with Bitmain, MicroBT and Canaan distribution keep counterfeit and grey-market units out of our supply chain.",
              },
              {
                title: "Published test data",
                body: "Hashrate curves, chip counts, PSU ripple and thermal spread are recorded for every unit and shared before purchase.",
              },
              {
                title: "Global logistics",
                body: "We ship to more than 100 countries with correct HS codes, pre-filled customs paperwork and insured freight.",
              },
              {
                title: "Deployment support",
                body: "Electrical planning, container layout, immersion conversion and pool configuration guidance included at no cost.",
              },
            ].map((f) => (
              <li key={f.title} className="rounded-md border border-border bg-card p-5">
                <h3 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Global shipping & location */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-[1280px] px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <MapPin className="h-4 w-4" aria-hidden="true" /> Hong Kong Head Office
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
                Based in Hong Kong. Selling &amp; Delivering Worldwide.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Bitcoin Mining Depot operates from {SITE.address}. Our Hong Kong location sits beside
                the world's largest ASIC manufacturing and logistics corridor, so we secure genuine
                Bitmain, MicroBT and Canaan hardware at source and dispatch it directly to miners in
                the United States, Canada, Europe, Asia, the Middle East, Latin America, Africa and
                Oceania.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every international order ships with a tracking number, commercial invoice and full
                customs paperwork. Our team supports you in English 24/7 across all time zones —
                call or WhatsApp {SITE.phone}, or email {SITE.email}.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/shipping-returns"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ice"
                >
                  <Truck className="h-4 w-4" aria-hidden="true" /> Shipping &amp; Delivery Details
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-primary"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" /> Ask About Your Country
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SHIPPING_REGIONS.map((r) => (
                <div
                  key={r.name}
                  className="rounded-md border border-border bg-card p-5"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
                      {r.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--gradient-stats)" }} className="text-charcoal-foreground">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center justify-center gap-3">
              <Icon className="h-8 w-8 text-ice" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl font-bold leading-none">{value}</p>
                <p className="text-[10px] uppercase tracking-wide text-charcoal-foreground/70">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews / Articles / Newsletter */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 lg:grid-cols-3 lg:divide-x lg:divide-border">
          <div className="lg:pr-8">
            <h2 className="text-center font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Customer Reviews
            </h2>
            <Suspense
              fallback={
                <div className="mt-6 space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              }
            >
              <ReviewsList />
            </Suspense>
            <div className="mt-6 text-center">
              <Link to="/reviews" className="text-xs font-semibold uppercase text-primary">
                Read all reviews
              </Link>
            </div>
          </div>

          <div className="lg:px-8">
            <h2 className="text-center font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Latest Articles
            </h2>
            <ul className="mt-6 space-y-5">
              {ARTICLES.map((a) => (
                <li key={a.title} className="flex gap-4">
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    width={640}
                    height={512}
                    className="h-16 w-24 shrink-0 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-charcoal">
                      <Link to="/knowledge-center" hash={a.slug}>
                        {a.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {a.date} &middot; {a.tag}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-8">
            <h2 className="text-center font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Newsletter
            </h2>
            <div className="mt-6 text-center">
              <Mail className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">
                Subscribe for restock alerts, wholesale price drops and mining profitability
                analysis delivered to your inbox.
              </p>
              <Newsletter />
              <p className="mt-3 text-[11px] text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {GUARANTEES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center justify-center gap-3">
              <Icon className="h-6 w-6 text-charcoal" aria-hidden="true" />
              <div className="text-[11px] uppercase leading-tight">
                <p className="font-semibold text-charcoal">{title}</p>
                <p className="text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
