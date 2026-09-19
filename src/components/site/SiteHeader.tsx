import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone, Facebook } from "lucide-react";

import { Logo } from "./Logo";
import { ObfuscatedEmail } from "./ObfuscatedEmail";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Used Miners", to: "/used-refurbished-miners" },
  { label: "Wholesale", to: "/wholesale" },
  { label: "Hosting", to: "/hosting" },
  { label: "Repair Services", to: "/repair-services" },
  { label: "Knowledge Center", to: "/knowledge-center" },
  { label: "Blog", to: "/blog" },
  { label: "Marketplace", to: "/bitcoin-mining-marketplace" },
  { label: "Reviews", to: "/reviews" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q: q || undefined, category: undefined } });
  };

  return (
    <>
      <div className="bg-navy text-charcoal-foreground">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px]">
          <p>
            Hong Kong HQ &middot; Worldwide shipping to the USA, Canada, Europe &amp; 100+ countries
          </p>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1 sm:flex">
              USD <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </span>
            <ObfuscatedEmail className="hidden hover:text-ice sm:inline" />
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" aria-hidden="true" /> {SITE.phone}
            </span>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Bitcoin Mining Depot on Facebook"
              className="hover:text-ice"
              title="Facebook"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 md:gap-6 md:py-4">
          <button
            type="button"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Logo />
          <form className="hidden flex-1 md:flex" role="search" onSubmit={search}>
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
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
          <div className="ml-auto flex items-center gap-4 md:gap-6">
            <Link to="/admin/login" className="hidden items-center gap-2 sm:flex">
              <User className="h-6 w-6 text-charcoal" aria-hidden="true" />
              <span className="text-xs leading-tight">
                <span className="block font-medium">Admin Login</span>
                <span className="block text-muted-foreground">Staff Access</span>
              </span>
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="flex items-center gap-2 border-border pl-4 sm:border-l sm:pl-6"
            >
              <span className="relative">
                <ShoppingCart className="h-6 w-6 text-charcoal" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                >
                  {count}
                </span>
              </span>
              <span aria-hidden="true" className="hidden text-xs font-medium sm:block">
                Cart
              </span>
            </Link>
          </div>
        </div>

        <nav className="border-t border-border bg-background">
          <div className="mx-auto max-w-[1280px] px-4">
            <ul className="hidden items-center justify-between text-[13px] font-semibold uppercase tracking-wide lg:flex">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "border-primary text-primary" }}
                    inactiveProps={{ className: "border-transparent text-charcoal hover:text-primary" }}
                    className="inline-block border-b-2 py-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {open && (
            <div className="border-t border-border lg:hidden">
              <form className="flex px-4 py-3" role="search" onSubmit={search}>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search miners..."
                  aria-label="Search products"
                  className="h-10 w-full rounded-l-md border border-border px-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-10 w-12 items-center justify-center rounded-r-md bg-primary text-primary-foreground"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <ul className="pb-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}