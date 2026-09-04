import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";

import type { Product } from "@/lib/data";
import { BUSINESS, localListingsForProduct } from "@/lib/local-seo";
import { SITE } from "@/lib/site";

/**
 * Local search block for product pages: city and state listings the model ships
 * into, country-specific delivery copy, and the Google Business Profile details
 * (address, hours, directions) that back up the LocalBusiness markup in <head>.
 */
export function ProductLocalAvailability({ product }: { product: Product }) {
  const groups = localListingsForProduct(product);
  const headline = product.name;

  return (
    <section className="border-t border-border bg-secondary" aria-labelledby="product-local-seo">
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <h2
          id="product-local-seo"
          className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal"
        >
          Buy the {headline} in your city
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The {headline} ships from our {BUSINESS.district}, {BUSINESS.region} warehouse to buyers
          across North America, Europe, the UK and Australia. Pick your city below for local pricing,
          delivery timelines, power requirements and hosting options, or contact our desk for a
          door-to-door quote to any address worldwide.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.country} className="rounded-md border border-border bg-card p-5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">
                  {product.brand} miners in {group.country}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {group.copy}
                </p>
                <ul className="mt-3 space-y-2 text-[13px]">
                  {[...group.cities, ...group.regions].map((location) => (
                    <li key={location.slug}>
                      <Link
                        to="/bitcoin-mining-marketplace/$slug"
                        params={{ slug: location.slug }}
                        className="font-medium text-charcoal hover:text-primary hover:underline"
                      >
                        {location.place}, {group.country}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside
            className="h-fit rounded-md border border-border bg-card p-5"
            aria-labelledby="product-gbp"
          >
            <h3
              id="product-gbp"
              className="font-display text-sm font-bold uppercase tracking-wide text-charcoal"
            >
              Visit or verify our store
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {SITE.name} is a registered hardware supplier with a physical showroom and testing
              bench in Causeway Bay. Every unit — including the {headline} — is bench-tested here
              before dispatch.
            </p>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-charcoal">Address</dt>
                  <dd className="text-muted-foreground">
                    {BUSINESS.street}, {BUSINESS.district}, {BUSINESS.locality}, {BUSINESS.region}
                  </dd>
                </div>
              </div>
              <div className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-charcoal">Opening hours</dt>
                  <dd className="text-muted-foreground">{BUSINESS.hours}</dd>
                </div>
              </div>
              <div className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-charcoal">Phone / WhatsApp</dt>
                  <dd>
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                      {SITE.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-charcoal">Sales desk</dt>
                  <dd>
                    <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
                      {SITE.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground hover:opacity-90"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                View us on Google Maps
              </a>
              <a
                href={BUSINESS.directionsUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-[13px] font-semibold text-charcoal hover:border-primary hover:text-primary"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get directions
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Prefer to browse by region first? See the{" "}
              <Link to="/bitcoin-mining-marketplace" className="text-primary hover:underline">
                bitcoin mining marketplace
              </Link>{" "}
              for every city and state we deliver ASIC miners into.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
