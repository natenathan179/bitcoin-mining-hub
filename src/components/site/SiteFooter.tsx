import { Link } from "@tanstack/react-router";
import { Facebook, MessageCircle, Mail, MapPin } from "lucide-react";

import { Logo } from "./Logo";
import { SITE, openWhatsApp } from "@/lib/site";
import { COLLECTIONS } from "@/lib/collections";
import { Button } from "@/components/ui/button";

// One evergreen guide per editorial category — sitewide internal links that
// funnel crawl equity into the deepest blog content. Hard-coded on purpose: the
// footer renders on every page, so it must not pull in the blog library.
const GUIDE_LINKS = [
  {
    slug: "best-bitcoin-mining-machines-in-2026-top-20-asic-miners-ranked",
    title: "Best Bitcoin Mining Machines in 2026: Top 20 ASIC Miners Ranked",
  },
  {
    slug: "best-asic-miner-for-bitcoin-complete-buyers-guide",
    title: "Best ASIC Miner for Bitcoin: Complete Buyer's Guide",
  },
  {
    slug: "antminer-s21-review-is-it-still-the-best-bitcoin-miner",
    title: "Antminer S21 Review: Is It Still the Best Bitcoin Miner?",
  },
  {
    slug: "which-bitcoin-miner-makes-the-most-money-per-day",
    title: "Which Bitcoin Miner Makes the Most Money Per Day?",
  },
  {
    slug: "best-bitcoin-mining-machines-for-apartments-and-home-offices",
    title: "Best Bitcoin Mining Machines for Apartments and Home Offices",
  },
  {
    slug: "used-asic-miner-buying-guide-inspection-pricing-and-risk",
    title: "Used ASIC Miner Buying Guide: Inspection, Pricing and Risk",
  },
] as const;


const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Shop All Miners", to: "/products" },
      { label: "Crypto Mining For Sale", to: "/crypto-mining-for-sale" },
      { label: "Used ASIC Miners", to: "/used-asic-miners" },

      { label: "Wholesale Program", to: "/wholesale" },
      { label: "Hosting Solutions", to: "/hosting" },
      { label: "Repair Center", to: "/repair-services" },
      { label: "Knowledge Center", to: "/knowledge-center" },
      { label: "Blog", to: "/blog" },
      { label: "Mining Marketplace", to: "/bitcoin-mining-marketplace" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Shipping & Delivery", to: "/shipping-returns" },
      { label: "Warranty Policy", to: "/warranty" },
      { label: "Returns & Refunds", to: "/shipping-returns" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "FAQ", to: "/faq" },
      { label: "Customer Reviews", to: "/reviews" },
      { label: "Admin Login", to: "/admin/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Warranty Policy", to: "/warranty" },
      { label: "Shipping & Returns", to: "/shipping-returns" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-navy text-charcoal-foreground">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <Logo tone="light" />
          <p className="mt-4 text-xs leading-relaxed text-charcoal-foreground/70">
            Your trusted source for bitcoin mining machines, ASIC miners, hosting and complete
            mining solutions. {SITE.tagline}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-charcoal-foreground/70">
            Headquartered in Causeway Bay, Hong Kong, and shipping worldwide — including the USA,
            Canada, Europe, Asia, Australia, the Middle East and Latin America.
          </p>
          <div className="mt-5 flex gap-4 text-charcoal-foreground/70">
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Bitcoin Mining Depot on Facebook"
              className="hover:text-ice"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => openWhatsApp()}
              aria-label="Chat with sales on WhatsApp"
              title="Chat with sales on WhatsApp"
              className="h-6 w-6 text-charcoal-foreground/70 hover:bg-transparent hover:text-ice"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </Button>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email Bitcoin Mining Depot sales"
              className="hover:text-ice"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-charcoal-foreground/70">
              {col.links.map((l) => (
                <li key={l.label + l.to}>
                  <Link to={l.to} className="hover:text-ice">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
            Shop by Category
          </h3>
          <ul className="mt-4 space-y-2 text-xs text-charcoal-foreground/70">
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-ice"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-xs text-charcoal-foreground/70">
            <li>Phone: {SITE.phone}</li>
            <li>
              Email:{" "}
              <a href={`mailto:${SITE.email}`} className="hover:text-ice">
                {SITE.email}
              </a>
            </li>
            <li>Mon – Sun: 24/7 Support (HKT / GMT+8)</li>
            <li className="font-semibold text-charcoal-foreground/90">Head Office — Hong Kong</li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-foreground/10">
        <div className="mx-auto max-w-[1280px] px-4 py-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
            Popular Mining Guides
          </h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-charcoal-foreground/70">
            {GUIDE_LINKS.map((p) => (
              <li key={p.slug}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-ice">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="font-semibold text-ice hover:underline">
                All 291 guides
              </Link>

            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-foreground/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-[11px] text-charcoal-foreground/60">
          <p>© {new Date().getFullYear()} Bitcoin Mining Depot. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-2">
            {["Bitcoin", "USDT", "Bitcoin Cash", "BNB", "Dogecoin"].map((m) => (
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
  );
}