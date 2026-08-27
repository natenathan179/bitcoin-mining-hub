import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";
import { SITE } from "@/lib/site";
import articleRepair from "@/assets/article-repair.jpg";

export const Route = createFileRoute("/repair-services")({
  head: () => ({
    meta: [
      { title: "ASIC Miner Repair Services | Hashboard & PSU Repair" },
      {
        name: "description",
        content:
          "Professional ASIC miner repair: hashboard chip-level diagnosis, control board replacement, PSU repair and fan service for Antminer, Whatsminer and Avalon units.",
      },
      { property: "og:title", content: "ASIC Miner Repair Services" },
      {
        property: "og:description",
        content:
          "Chip-level hashboard repair, PSU service and full diagnostics for Antminer, Whatsminer and Avalon miners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.com/repair-services" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.com/repair-services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "ASIC Miner Repair Services",
          serviceType: "ASIC Miner Repair",
          description:
            "Chip-level hashboard diagnosis and repair, control board replacement, PSU repair and fan service for Antminer, Whatsminer and Avalon ASIC miners.",
          url: "/repair-services",
          areaServed: "Worldwide",
          provider: {
            "@type": "LocalBusiness",
            name: SITE.name,
            url: SITE.url,
            telephone: SITE.phone,
            email: SITE.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Tower 1, Times Square, 34號 Matheson St",
              addressLocality: "Causeway Bay",
              addressRegion: "Hong Kong Island",
              addressCountry: "HK",
            },
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Repair services",
            itemListElement: [
              "Hashboard chip-level repair",
              "Control board replacement",
              "Power supply repair",
              "Fan and cooling service",
              "Full diagnostic and bench test",
            ].map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name },
            })),
          },
        }),
      },
    ],
  }),
  component: RepairPage,
});

const SERVICES = [
  { t: "Hashboard repair", p: "From $65 per board", b: "Chip-level diagnosis and rework, voltage domain testing, missing-chip replacement and full-load verification." },
  { t: "Control board service", p: "From $45", b: "Firmware recovery, EEPROM reflash, network port repair and replacement where the board is beyond economical repair." },
  { t: "Power supply repair", p: "From $55", b: "Capacitor and MOSFET replacement, output ripple testing and full load bench verification before return." },
  { t: "Deep clean & service", p: "From $25", b: "Ultrasonic hashboard cleaning, thermal paste replacement, fan replacement and airflow restoration." },
];

function RepairPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Repair centre"
        title="ASIC Repair & Maintenance"
        subtitle="A dead miner is usually a $60 repair, not a $3,000 replacement. Our lab performs chip-level hashboard work on Antminer, Whatsminer, Avalon and Innosilicon hardware."
      />

      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.t} className="rounded-md border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal">
                {s.t}
              </h2>
              <p className="mt-1 text-sm font-semibold text-primary">{s.p}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <img
              src={articleRepair}
              alt="Technician performing chip-level repair on an ASIC miner hashboard"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full rounded-md object-cover"
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
                How the repair process works
              </h2>
              <p>
                Send us the miner or just the faulty board — shipping a single hashboard is far
                cheaper than freighting a whole machine. On arrival every item is logged,
                photographed and put through a diagnostic run to reproduce the fault and identify
                which voltage domain or chip is failing.
              </p>
              <p>
                You receive a written quote before any work starts. Once approved, repairs are
                typically completed within three to five working days depending on parts
                availability. Every repaired board is tested at full load for a minimum of four
                hours and returned with a test report showing measured hashrate and chip counts.
              </p>
              <p>
                All repair work carries a 90 day warranty on the specific fault repaired. If the
                same fault recurs within that window we repair it again at no charge, including
                return freight.
              </p>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-charcoal">
              Book a repair
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Describe the fault and we will send RMA instructions and a shipping address.
            </p>
            <div className="mt-6">
              <LeadForm
                subject="Repair Service Request"
                formType="Repair / RMA Request"
                cta="Request RMA"
                messageLabel="Fault description and error codes"
                extraFields={[
                  { name: "model", label: "Miner Model", placeholder: "e.g. Antminer S19j Pro" },
                  { name: "units", label: "Units Affected", placeholder: "e.g. 3" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}