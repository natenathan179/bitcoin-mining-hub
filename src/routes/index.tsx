import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
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
  Star,
  Quote,
  RotateCcw,
  BadgeCheck,
  Tag,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  MapPin,
  ArrowRight,
  Bitcoin,
} from "lucide-react";

import heroImg from "@/assets/hero-mining-facility.jpg";
import minerBlack from "@/assets/miner-black.jpg";
import minerSilver from "@/assets/miner-silver.jpg";
import minerWhite from "@/assets/miner-white.jpg";
import articleProfit from "@/assets/article-profit.jpg";
import articleFarm from "@/assets/article-farm.jpg";
import articleRepair from "@/assets/article-repair.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bitcoin Mining Depot | ASIC Miners & Bitcoin Mining Machines" },
      {
        name: "description",
        content:
          "Buy genuine ASIC miners, Bitmain Antminer, WhatsMiner and Avalon bitcoin mining machines. Wholesale pricing, hosting, repair services and worldwide shipping.",
      },
      { property: "og:title", content: "Bitcoin Mining Depot | ASIC Miners for Every Scale" },
      {
        property: "og:description",
        content:
          "Genuine bitcoin mining hardware, accessories, hosting and ASIC repair for home miners, businesses and industrial farms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  "Home",
  "Shop",
  "Brands",
  "Wholesale",
  "Hosting",
  "Repair Services",
  "Blog",
  "About Us",
  "Contact Us",
];

const TRUST = [
  { icon: ShieldCheck, title: "Genuine Products", sub: "100% Authentic Miners" },
  { icon: Truck, title: "Worldwide Shipping", sub: "Fast & Secure Delivery" },
  { icon: Lock, title: "Secure Payments", sub: "Safe & Encrypted Checkout" },
  { icon: Package, title: "Wholesale Pricing", sub: "Best Prices for Bulk Orders" },
  { icon: Headphones, title: "24/7 Support", sub: "Expert Technical Support" },
];

const CATEGORIES = [
  { icon: Bitcoin, label: "Bitcoin Mining Machines" },
  { icon: Cpu, label: "ASIC Miners" },
  { icon: Recycle, label: "Used & Refurbished Miners" },
  { icon: Layers, label: "Mining Accessories" },
  { icon: Plug, label: "Power Supplies" },
  { icon: Snowflake, label: "Immersion Cooling" },
  { icon: Server, label: "Hosting Solutions" },
  { icon: Boxes, label: "Spare Parts" },
  { icon: Wrench, label: "Repair Services" },
  { icon: Tag, label: "Bulk & Wholesale Orders" },
];

const BRANDS = [
  { name: "BITMAIN", sub: "ANTMINER" },
  { name: "whatsminer", sub: "MICROBT" },
  { name: "canaan", sub: "AVALON" },
  { name: "ELPHAPEX", sub: "MINING DONE RIGHT" },
  { name: "iPollo", sub: "" },
  { name: "Goldshell", sub: "" },
];

const PRODUCTS = [
  {
    name: "Antminer S19 XP Hyd.",
    hash: "255 TH/s",
    watt: "5304W",
    algo: "SHA-256 Algorithm",
    price: "$9,299.00",
    img: minerBlack,
  },
  {
    name: "Whatsminer M66S++",
    hash: "298 TH/s",
    watt: "5120W",
    algo: "SHA-256 Algorithm",
    price: "$8,499.00",
    img: minerSilver,
  },
  {
    name: "Antminer S19j Pro+",
    hash: "122 TH/s",
    watt: "3355W",
    algo: "SHA-256 Algorithm",
    price: "$4,199.00",
    img: minerBlack,
    highlight: true,
  },
  {
    name: "Avalon A1266",
    hash: "100 TH/s",
    watt: "3300W",
    algo: "SHA-256 Algorithm",
    price: "$2,799.00",
    img: minerWhite,
  },
  {
    name: "Whatsminer M50S",
    hash: "126 TH/s",
    watt: "3260W",
    algo: "SHA-256 Algorithm",
    price: "$2,599.00",
    img: minerSilver,
    highlight: true,
  },
  {
    name: "Antminer T21",
    hash: "190 TH/s",
    watt: "3610W",
    algo: "SHA-256 Algorithm",
    price: "$5,399.00",
    img: minerWhite,
    highlight: true,
  },
];

const STATS = [
  { icon: Award, value: "10+", label: "Years in Business" },
  { icon: Cpu, value: "50,000+", label: "Miners Sold" },
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Globe, value: "100+", label: "Countries Shipped" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const ARTICLES = [
  {
    img: articleProfit,
    title: "Best Bitcoin Miners in 2024 for Maximum Profitability",
    date: "May 10, 2024",
    tag: "Mining Guides",
  },
  {
    img: articleFarm,
    title: "How to Start a Bitcoin Mining Farm",
    date: "May 6, 2024",
    tag: "Setup Guides",
  },
  {
    img: articleRepair,
    title: "ASIC Miner Maintenance Tips to Extend Lifespan",
    date: "May 1, 2024",
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

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bitcoin className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display leading-none tracking-wide">
        <span
          className={`block text-xl font-bold uppercase ${tone === "dark" ? "text-charcoal" : "text-charcoal-foreground"}`}
        >
          Bitcoin
        </span>
        <span className="block text-sm font-semibold uppercase text-primary">Mining Depot</span>
      </span>
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Announcement bar */}
      <div className="bg-navy text-charcoal-foreground">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px]">
          <p>The World's Trusted Source for Bitcoin Mining Machines &amp; Solutions</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1">
              USD <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              English <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Track Order</span>
            <span>Phone: +1 (888) 806-4021</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-4 py-4">
          <Logo />
          <form className="hidden flex-1 md:flex" role="search">
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input
              id="site-search"
              placeholder="Search for miners, brands, or products..."
              className="h-10 w-full rounded-l-md border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              className="flex h-10 w-12 items-center justify-center rounded-r-md bg-primary text-primary-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <div className="ml-auto flex items-center gap-6">
            <div className="hidden items-center gap-2 sm:flex">
              <User className="h-6 w-6 text-charcoal" aria-hidden="true" />
              <span className="text-xs leading-tight">
                <span className="block font-medium">Login / Register</span>
                <span className="block text-muted-foreground">My Account</span>
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-border pl-6">
              <span className="relative">
                <ShoppingCart className="h-6 w-6 text-charcoal" aria-hidden="true" />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  0
                </span>
              </span>
              <span className="hidden text-xs font-medium sm:block">Cart</span>
            </div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-4">
          <div className="flex items-center gap-3 rounded-t-md bg-primary px-5 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground">
            <Menu className="h-4 w-4" aria-hidden="true" />
            Shop by Category
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </div>
          <ul className="hidden flex-1 items-center justify-between text-[13px] font-semibold uppercase tracking-wide lg:flex">
            {NAV.map((item, i) => (
              <li key={item}>
                <a
                  href="#"
                  className={`inline-block border-b-2 py-4 transition-colors ${
                    i === 0
                      ? "border-primary text-primary"
                      : "border-transparent text-charcoal hover:text-primary"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-navy">
          <img
            src={heroImg}
            alt="Rows of enterprise bitcoin mining machines in a data center"
            width={1920}
            height={912}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative mx-auto max-w-[1280px] px-4 py-20 md:py-28">
            <h1 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-charcoal-foreground md:text-6xl">
              Enterprise Bitcoin Mining Machines
              <span className="block text-ice">For Every Scale</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal-foreground/80 md:text-base">
              Shop genuine ASIC miners, mining accessories, and complete mining solutions for home
              miners, businesses, and industrial operations worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ice"
              >
                <Package className="h-4 w-4" aria-hidden="true" /> Shop Miners
              </a>
              <a
                href="#wholesale"
                className="inline-flex items-center gap-2 rounded-md border border-charcoal-foreground/40 px-6 py-3 text-sm font-semibold text-charcoal-foreground transition-colors hover:bg-charcoal-foreground/10"
              >
                <Users className="h-4 w-4" aria-hidden="true" /> Request Wholesale Pricing
              </a>
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
          <h2 className="sr-only">Featured categories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-card px-2 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <span className="text-[11px] font-medium leading-tight text-charcoal">{label}</span>
              </a>
            ))}
          </div>
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
              <a key={b.name} href="#" className="text-center opacity-80 hover:opacity-100">
                <span className="block font-display text-lg font-bold uppercase tracking-wide text-charcoal">
                  {b.name}
                </span>
                {b.sub && (
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {b.sub}
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-[1280px] px-4 pb-12">
          <div className="relative flex items-center justify-center">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
              Best Selling Miners
            </h2>
            <a
              href="#"
              className="absolute right-0 hidden items-center gap-1 text-xs font-semibold uppercase text-primary sm:flex"
            >
              View All Products <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {PRODUCTS.map((p) => (
              <article
                key={p.name}
                className="group relative flex flex-col rounded-md border border-border bg-card p-3 transition-shadow"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span className="absolute left-3 top-3 z-10 rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                  In Stock
                </span>
                <img
                  src={p.img}
                  alt={`${p.name} ASIC bitcoin miner`}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="mx-auto h-32 w-full object-contain"
                />
                <h3 className="mt-3 text-[13px] font-semibold leading-tight text-charcoal">
                  {p.name}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  <span className={p.highlight ? "text-destructive" : undefined}>{p.hash}</span> |{" "}
                  {p.watt}
                </p>
                <p className="text-[11px] text-muted-foreground">{p.algo}</p>
                <p className="mt-2 text-base font-bold text-charcoal">{p.price}</p>
                <button className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-ice">
                  <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" /> Add to Cart
                </button>
              </article>
            ))}
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
              <div className="mt-6 flex gap-3">
                <Quote className="h-7 w-7 shrink-0 text-silver" aria-hidden="true" />
                <div>
                  <p className="text-sm leading-relaxed text-charcoal">
                    Excellent service and fast shipping! The miner was brand new and works
                    perfectly. Highly recommend Bitcoin Mining Depot.
                  </p>
                  <div className="mt-3 flex gap-0.5 text-[oklch(0.78_0.16_80)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-charcoal">Michael T.</p>
                  <p className="text-xs text-muted-foreground">Canada</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === 1 ? "bg-primary" : "bg-silver"}`}
                  />
                ))}
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
                        <a href="#">{a.title}</a>
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
                  Subscribe to get special offers, free giveaways, and the latest mining news
                  delivered to your inbox.
                </p>
                <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    className="h-11 w-full rounded-md border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                  <button className="mt-3 h-11 w-full rounded-md bg-primary text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-ice">
                    Subscribe
                  </button>
                </form>
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
      </main>

      {/* Footer */}
      <footer id="wholesale" className="bg-navy text-charcoal-foreground">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Logo tone="light" />
            <p className="mt-4 text-xs leading-relaxed text-charcoal-foreground/70">
              Your trusted source for Bitcoin mining machines, ASIC miners, and complete mining
              solutions. We power the future of Bitcoin mining.
            </p>
            <div className="mt-5 flex gap-4 text-charcoal-foreground/70">
              {[Facebook, Twitter, Youtube, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social profile" className="hover:text-ice">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Quick Links",
              links: [
                "About Us",
                "Shipping & Delivery",
                "Payment Methods",
                "Warranty Policy",
                "Return Policy",
                "FAQ",
                "Contact Us",
              ],
            },
            {
              title: "Customer Service",
              links: [
                "Track Order",
                "My Account",
                "Order History",
                "Returns & Refunds",
                "Support Center",
                "Wholesale Inquiries",
              ],
            },
            {
              title: "Categories",
              links: [
                "ASIC Miners",
                "Mining Accessories",
                "Power Supplies",
                "Cooling Solutions",
                "Spare Parts",
                "Used Miners",
                "All Products",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2 text-xs text-charcoal-foreground/70">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-ice">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-charcoal-foreground/70">
              <li>Phone: +1 (888) 806-4021</li>
              <li>Email: support@bitcoinminingdepot.com</li>
              <li>Mon – Sun: 24/7 Support</li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                3411 Silverside Rd, Wilmington, DE 19810, United States
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-charcoal-foreground/10">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-[11px] text-charcoal-foreground/60">
            <p>© 2026 Bitcoin Mining Depot. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-2">
              {["VISA", "Mastercard", "AMEX", "PayPal", "Apple Pay", "G Pay"].map((m) => (
                <span
                  key={m}
                  className="rounded-sm bg-charcoal-foreground/10 px-2 py-1 text-[10px] font-semibold"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
