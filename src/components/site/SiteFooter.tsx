import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Youtube, Instagram, Linkedin, MapPin } from "lucide-react";

import { Logo } from "./Logo";
import { SITE } from "@/lib/site";
import { COLLECTIONS } from "@/lib/collections";

const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Shop All Miners", to: "/products" },
      { label: "Wholesale Program", to: "/wholesale" },
      { label: "Hosting Solutions", to: "/hosting" },
      { label: "Repair Center", to: "/repair-services" },
      { label: "Knowledge Center", to: "/knowledge-center" },
      { label: "Blog", to: "/blog" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Shipping & Delivery", to: "/shipping-returns" },
      { label: "Warranty Policy", to: "/warranty" },
      { label: "Returns & Refunds", to: "/shipping-returns" },
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
      { label: "Warranty Policy", to: "/warranty" },
      { label: "Shipping & Returns", to: "/shipping-returns" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-navy text-charcoal-foreground">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo tone="light" />
          <p className="mt-4 text-xs leading-relaxed text-charcoal-foreground/70">
            Your trusted source for bitcoin mining machines, ASIC miners, hosting and complete
            mining solutions. {SITE.tagline}
          </p>
          <div className="mt-5 flex gap-4 text-charcoal-foreground/70">
            {[Facebook, Twitter, Youtube, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href={SITE.url} aria-label="Social profile" className="hover:text-ice">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
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
            <li>Mon – Sun: 24/7 Support</li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-foreground/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-[11px] text-charcoal-foreground/60">
          <p>© {new Date().getFullYear()} Bitcoin Mining Depot. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-2">
            {["VISA", "Mastercard", "AMEX", "Bank Wire", "Bitcoin", "USDT"].map((m) => (
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