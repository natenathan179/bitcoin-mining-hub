import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Bitcoin Mining Depot | Sales & Support 24/7" },
      {
        name: "description",
        content:
          "Contact the Bitcoin Mining Depot sales and technical support team for pricing, stock availability, hosting, repairs and wholesale bitcoin miner orders.",
      },
      { property: "og:title", content: "Contact Bitcoin Mining Depot" },
      {
        property: "og:description",
        content: "Talk to our mining hardware specialists about pricing, stock, hosting or repairs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Our Mining Specialists"
        subtitle="Whether you are buying your first miner or planning a twenty megawatt build, you get a named specialist who understands hardware, power and logistics — not a ticket queue."
      />

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
            Send us a message
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tell us what you are trying to build. The more detail you can share about your power
            cost, available amperage, timeline and budget, the more useful our first reply will be.
            Most enquiries are answered within a few hours, and always within one business day.
          </p>
          <div className="mt-8">
            <LeadForm
              subject="Website Contact Enquiry"
              formType="General Contact"
              cta="Send Message"
              messageLabel="Your message"
            />
          </div>
        </div>

        <aside className="space-y-4">
          {[
            { icon: Phone, title: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/[^+\d]/g, "")}` },
            { icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: MapPin, title: "Address", value: SITE.address },
            { icon: Clock, title: "Hours", value: "Sales & technical support, 24 hours a day, 7 days a week" },
          ].map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="rounded-md border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
                  {title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {href ? (
                  <a href={href} className="hover:text-primary">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
          <div className="rounded-md border border-primary/30 bg-secondary p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Departments
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Sales & wholesale quotes</li>
              <li>Hosting & colocation placement</li>
              <li>Repair centre & RMA</li>
              <li>Logistics, customs & freight claims</li>
            </ul>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}