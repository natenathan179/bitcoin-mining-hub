import { createFileRoute } from "@tanstack/react-router";
import { Server, Gauge, ShieldCheck, Zap } from "lucide-react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/hosting")({
  head: () => ({
    meta: [
      { title: "Bitcoin Miner Hosting & Colocation | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Host your ASIC miners in tier-grade North American facilities with low-cost power, 24/7 monitoring, remote hands and per-machine uptime reporting.",
      },
      { property: "og:title", content: "Bitcoin Miner Hosting & Colocation" },
      {
        property: "og:description",
        content:
          "Low-cost power, 99% uptime targets and per-machine monitoring for hosted ASIC miners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HostingPage,
});

function HostingPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Hosting"
        title="Colocation For ASIC Miners"
        subtitle="Ship your hardware to a purpose-built facility with industrial power rates, real monitoring and technicians on site — instead of fighting heat, noise and breakers at home."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Zap, t: "Industrial power", b: "Contracted rates well below residential tariffs, billed transparently on metered consumption." },
            { icon: Gauge, t: "99% uptime target", b: "Redundant networking, curtailment planning and rapid fault response keep machines hashing." },
            { icon: Server, t: "Purpose-built airflow", b: "Positive-pressure filtered intake and hot-aisle containment keep hashboards inside spec." },
            { icon: ShieldCheck, t: "Physical security", b: "Fenced sites, access control, CCTV and full insurance coverage on hosted hardware." },
          ].map(({ icon: Icon, t, b }) => (
            <div key={t} className="rounded-md border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-base font-semibold uppercase tracking-wide text-charcoal">
                {t}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
              What hosting actually costs
            </h2>
            <p>
              Hosting is priced in two parts: a flat slot fee that covers rack space, monitoring and
              remote hands, and a metered power rate charged per kilowatt hour consumed. Beware of
              any host quoting a single all-in number without disclosing the underlying power rate —
              that structure hides curtailment behaviour and makes it impossible to model returns.
            </p>
            <p>
              A typical 3.5 kilowatt miner running continuously consumes roughly 2,520 kilowatt hours
              a month. At seven cents that is about $176 of power, plus the slot fee. We publish both
              numbers in your contract and invoice against metered readings, so you can reconcile
              every dollar against your own profitability model.
            </p>
            <h2 className="pt-2 font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
              Onboarding process
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Send your machine list, model types and expected arrival window.</li>
              <li>We confirm capacity, issue a hosting agreement and a power rate.</li>
              <li>Ship to the facility; we receive, inspect and photograph every unit.</li>
              <li>Machines are racked, configured to your pool and worker naming scheme.</li>
              <li>You get dashboard access with per-machine hashrate, temperature and uptime.</li>
              <li>Faults are triaged on site; hashboard repairs are handled in our lab.</li>
            </ol>
            <p>
              Minimum order for new hosting clients is five miners. Larger fleets can be placed
              across multiple sites for redundancy, and we can purchase hardware on your behalf and
              deploy it directly without it ever passing through your hands.
            </p>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal">
              Request a hosting quote
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us how many machines you have and when they are ready to ship.
            </p>
            <div className="mt-6">
              <LeadForm
                subject="Hosting Enquiry"
                formType="Hosting Request"
                cta="Request Hosting Quote"
                messageLabel="Machine models, quantity and timeline"
                extraFields={[
                  { name: "machines", label: "Number of Machines", placeholder: "e.g. 25" },
                  { name: "power", label: "Total Load (kW)", placeholder: "e.g. 87 kW" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}