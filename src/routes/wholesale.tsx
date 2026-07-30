import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Bitcoin Miners | Bulk ASIC Pricing & Allocation" },
      {
        name: "description",
        content:
          "Wholesale bitcoin miner pricing for bulk buyers: tiered discounts from 10 units, container freight, escrow-friendly terms and priority allocation on new releases.",
      },
      { property: "og:title", content: "Wholesale Bitcoin Miner Pricing" },
      {
        property: "og:description",
        content: "Bulk ASIC pricing, container logistics and priority allocation for large buyers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/wholesale" },
    ],
    links: [{ rel: "canonical", href: "/wholesale" }],
  }),
  component: WholesalePage,
});

const TIERS = [
  { qty: "10 – 49 units", disc: "Tier 1", note: "Standard wholesale pricing, consolidated pallet freight, 30 day allocation hold." },
  { qty: "50 – 199 units", disc: "Tier 2", note: "Improved unit pricing, dedicated account manager, staged delivery schedule." },
  { qty: "200 – 999 units", disc: "Tier 3", note: "Container freight pricing, pre-shipment inspection, extended payment terms available." },
  { qty: "1,000+ units", disc: "Enterprise", note: "Direct factory allocation, custom firmware, on-site commissioning support." },
];

function WholesalePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Wholesale program"
        title="Bulk ASIC Miner Pricing"
        subtitle="Tiered pricing, container logistics and priority allocation for operators, resellers and funds deploying capital at scale."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div key={t.qty} className="rounded-md border border-border bg-card p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {t.disc}
              </p>
              <h2 className="mt-2 font-display text-lg font-bold uppercase text-charcoal">
                {t.qty}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
              How wholesale buying works
            </h2>
            <p>
              Wholesale orders are quoted, not listed. Prices for large lots move with manufacturer
              allocation, secondary market supply and freight capacity, sometimes several times in a
              week. When you send a requirement we lock a price for a defined window — normally 48
              to 72 hours — so you can complete internal approvals without the number shifting under
              you.
            </p>
            <p>
              For new hardware we buy against confirmed manufacturer allocation, so lead times are
              real dates rather than optimistic estimates. For used fleets we buy in whole-site lots
              and can arrange pre-shipment inspection, either by your representative or by an
              independent third party, before funds move.
            </p>
            <p>
              Payment is normally bank wire, with escrow available on first orders above a threshold.
              We also accept BTC and USDT. Freight is quoted door to door with correct HS codes and
              full insurance; we handle export documentation and can work with your customs broker
              on the destination side.
            </p>
            <h3 className="pt-2 font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Included with every wholesale order
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "Written test report per unit or per lot",
                "Serial number manifest before dispatch",
                "Pre-shipment inspection window",
                "Insured door-to-door freight quote",
                "Warranty and RMA process in writing",
                "Optional hosting placement at partner sites",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal">
              Request wholesale pricing
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send your requirement and we will reply with a firm quote, lead time and freight
              estimate.
            </p>
            <div className="mt-6">
              <LeadForm
                subject="Wholesale Pricing Request"
                formType="Wholesale Enquiry"
                cta="Request Quote"
                messageLabel="Models, quantities, destination and timeline"
                extraFields={[
                  { name: "quantity", label: "Estimated Quantity", placeholder: "e.g. 250 units" },
                  { name: "budget", label: "Budget Range", placeholder: "e.g. $500k" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}