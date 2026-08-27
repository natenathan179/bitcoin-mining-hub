import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty Policy | Bitcoin Mining Depot ASIC Miners" },
      {
        name: "description",
        content:
          "Warranty terms for new, refurbished and used ASIC miners: coverage periods, what voids cover, the RMA process and repair turnaround times.",
      },
      { property: "og:title", content: "ASIC Miner Warranty Policy" },
      {
        property: "og:description",
        content: "Coverage periods, exclusions and the RMA process for miners bought from us.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bitcoinminingdepot.com/warranty" },
    ],
    links: [{ rel: "canonical", href: "https://bitcoinminingdepot.com/warranty" }],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Policies"
      title="Warranty Policy"
      subtitle="What is covered, for how long, and exactly how to claim if a machine fails."
      sections={[
        {
          heading: "Coverage periods",
          paras: ["Coverage begins on the delivery date recorded by the carrier."],
          list: [
            "New miners: 12 months manufacturer warranty, registered in your name",
            "Refurbished miners: 6 months Bitcoin Mining Depot warranty",
            "Used miners: 6 months Bitcoin Mining Depot warranty unless sold as-is and clearly labelled",
            "Power supplies and accessories: 12 months",
            "Spare parts and repair work: 90 days on the specific component or fault",
          ],
        },
        {
          heading: "What is covered",
          paras: [
            "Warranty covers hardware failure under normal operating conditions: dead or degraded hashboards, control board failure, power supply failure and fan failure that is not caused by external damage.",
            "Where a machine cannot be economically repaired we replace it with an equivalent unit or issue a pro-rata credit against the remaining warranty term.",
          ],
        },
        {
          heading: "What is not covered",
          paras: ["The following void or fall outside warranty cover:"],
          list: [
            "Physical damage, liquid ingress outside a designed immersion or hydro system, or lightning and surge damage",
            "Operation outside manufacturer temperature, humidity and voltage specifications",
            "Third-party or overclocking firmware that raises voltage beyond factory limits",
            "Removed, altered or unreadable serial numbers and warranty seals",
            "Damage from dust accumulation where basic maintenance has clearly not been performed",
            "Consumables such as fans and thermal paste after the first 12 months",
          ],
        },
        {
          heading: "How to claim",
          paras: [
            "Email our support desk with your invoice number, the machine serial number, a description of the fault and any error output from the miner interface. We respond with diagnostic steps, because a meaningful share of reported faults are configuration or power issues that can be solved without shipping anything.",
            "If hardware service is required we issue an RMA number and shipping instructions. In many cases you only need to send the faulty hashboard rather than the whole machine, which greatly reduces freight cost and turnaround time.",
            "Typical repair turnaround is three to five working days from receipt, subject to parts availability. Every repaired unit is tested at full load and returned with a test report.",
          ],
        },
      ]}
    />
  ),
});