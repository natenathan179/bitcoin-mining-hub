import type { ReactNode } from "react";

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy text-charcoal-foreground">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ice">{eyebrow}</p>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal-foreground/75 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}