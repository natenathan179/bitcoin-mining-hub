import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import heroImg from "@/assets/hero-mining-facility.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bitcoin Mining Depot | Enterprise Mining Hardware Supplier" },
      {
        name: "description",
        content:
          "Bitcoin Mining Depot supplies genuine ASIC miners, hosting and repair services to more than 10,000 customers in 100+ countries. Learn about our sourcing, testing and support standards.",
      },
      { property: "og:title", content: "About Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "A decade of supplying tested, warranty-backed bitcoin mining hardware to home miners and industrial farms worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Who we are"
        title="Built By Miners, For Miners"
        subtitle="Bitcoin Mining Depot began as an operator, not a reseller. Everything we sell is hardware we have run ourselves, tested on our own benches and deployed at our own sites."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
              Our story
            </h2>
            <p>
              We started in 2015 with four second-hand miners in a rented industrial unit and an
              electricity contract that looked cheap until the first summer arrived. Everything we
              learned in the years that followed — about thermal design, about power quality, about
              which suppliers actually honour a warranty — came from running machines rather than
              reading spec sheets. When other operators started asking us to source hardware for
              them, Bitcoin Mining Depot became a business.
            </p>
            <p>
              Today we supply home miners buying a single unit, regional operators filling a
              container, and institutional clients deploying tens of megawatts. The catalogue has
              grown, but the standard has not moved: we only list hardware we would run on our own
              floor, and we publish the test data to prove what each machine actually does.
            </p>
            <h2 className="pt-4 font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
              How we work
            </h2>
            <p>
              New hardware is bought through authorised distribution so warranty registration stays
              intact and serial numbers trace back to the manufacturer. Used hardware is bought in
              whole-fleet lots wherever possible, because a fleet with a known maintenance history
              is worth far more than a pallet of mixed-grade machines with no provenance.
            </p>
            <p>
              Every unit passes through our testing bench before it is listed. We record hashrate
              over a sustained run, per-board chip counts, hashboard temperature spread and power
              supply ripple. Anything that fails is repaired or parted out — it never quietly ships
              to a customer. That process costs us margin and it is the single biggest reason our
              return rate stays under two percent.
            </p>
          </div>

          <div>
            <img
              src={heroImg}
              alt="Bitcoin Mining Depot data centre floor with racked ASIC miners"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full rounded-md object-cover"
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { v: "10+", l: "Years operating" },
                { v: "50,000+", l: "Miners delivered" },
                { v: "100+", l: "Countries served" },
                { v: "<2%", l: "Return rate" },
              ].map((s) => (
                <div key={s.l} className="rounded-md border border-border bg-card p-5 text-center">
                  <p className="font-display text-2xl font-bold text-charcoal">{s.v}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
            What we stand for
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Honest grading",
                b: "A used miner is described exactly as it tested. If a hashboard is running two chips down, that is written on the listing and reflected in the price.",
              },
              {
                t: "Support that outlasts the sale",
                b: "Firmware questions, pool configuration, RMA logistics and repairs are handled by the same team years after purchase, not handed to a third party.",
              },
              {
                t: "Advice before revenue",
                b: "If your power cost makes a cheaper machine more profitable, we will tell you — even when it means a smaller order for us.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-md border border-border bg-card p-6">
                <h3 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal">
                  {c.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-md bg-navy px-6 py-10 text-center text-charcoal-foreground">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Ready to plan your deployment?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-charcoal-foreground/75">
            Send us your power cost, available capacity and budget. We will come back with a
            hardware plan and a realistic profitability model — not a sales pitch.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-ice"
          >
            Talk to a specialist
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}