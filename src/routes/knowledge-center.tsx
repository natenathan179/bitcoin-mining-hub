import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import articleProfit from "@/assets/article-profit.jpg";
import articleFarm from "@/assets/article-farm.jpg";
import articleRepair from "@/assets/article-repair.jpg";

export const Route = createFileRoute("/knowledge-center")({
  head: () => ({
    meta: [
      { title: "Bitcoin Mining Knowledge Center | Guides & Profitability" },
      {
        name: "description",
        content:
          "In-depth bitcoin mining guides: choosing profitable ASIC miners, building a mining farm, electrical planning, immersion cooling and ASIC maintenance best practice.",
      },
      { property: "og:title", content: "Bitcoin Mining Knowledge Center" },
      {
        property: "og:description",
        content:
          "Practical guides on miner selection, farm construction, cooling and maintenance from working operators.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KnowledgePage,
});

const ARTICLES = [
  {
    id: "most-profitable-bitcoin-miners",
    img: articleProfit,
    tag: "Mining Guides",
    date: "May 10, 2026",
    title: "The Most Profitable Bitcoin Miners This Year",
    paras: [
      "Profitability is not a property of a machine — it is a property of a machine at your electricity price. The same miner that prints money at four cents per kilowatt hour is a slow loss at fourteen. Before comparing hardware, work out your true blended power cost including demand charges, transmission fees and any curtailment credits. That single number determines which half of the market is even worth considering.",
      "Below about six cents, capital efficiency wins. Older hardware such as the S19j Pro+ or M50S can be bought for a fraction of new-unit cost, and even at 26 to 27 joules per terahash the electricity is cheap enough that the payback period on the purchase price is short. The risk is a sharp difficulty increase or price fall, which pushes older machines under water first — so buy at a price you would be comfortable writing off in twelve months.",
      "Above ten cents, efficiency is the only thing that matters. Current-generation hardware in the 12 to 18 joules per terahash band — the S21 series, the M60 series and their hydro variants — will keep hashing profitably through conditions that switch off everything older. The trade-off is capital cost, so these machines suit operators with a multi-year horizon and stable power contracts.",
      "Whatever you buy, model your break-even honestly. Take your machine's watts, multiply by 24 and by your all-in power rate to get daily electricity cost, then compare with expected daily revenue at current difficulty. If the margin is thin today it will be thinner after the next difficulty adjustment.",
    ],
  },
  {
    id: "how-to-start-a-mining-farm",
    img: articleFarm,
    tag: "Setup Guides",
    date: "May 6, 2026",
    title: "How to Start a Bitcoin Mining Farm: Full Playbook",
    paras: [
      "Every successful mining site starts with power, not hardware. Secure your electrical service first: know your available amperage, voltage and phase configuration, and get a written rate from the utility including all riders and demand charges. Buying machines before confirming power is the most common and most expensive mistake new operators make.",
      "Plan roughly 3.5 kilowatts per air-cooled miner and add 15 to 20 percent headroom for inrush, ventilation and lighting. A 200 amp three-phase 208 volt service supports about 20 machines at full load. Distribution matters as much as capacity — use properly rated PDUs, avoid daisy-chaining, and have a licensed electrician sign off the design before energising anything.",
      "Airflow design is the second pillar. Miners need a clear intake path of filtered outside air and an exhaust path that never recirculates. Separate hot and cold aisles physically, use positive pressure so dust is pushed out rather than drawn in, and size your intake fans for the total CFM of your machine count with margin for filter loading.",
      "Finally, plan operations before day one: monitoring and alerting, spare hashboards and PSUs on the shelf, a repair workflow, and a clear pool and firmware standard across the fleet. Sites fail on operations far more often than on hardware, and downtime is the only cost that never appears in a spreadsheet before it happens.",
    ],
  },
  {
    id: "asic-maintenance-guide",
    img: articleRepair,
    tag: "Maintenance",
    date: "May 1, 2026",
    title: "ASIC Miner Maintenance Tips to Extend Lifespan",
    paras: [
      "Dust is the primary killer of mining hardware. It insulates heatsinks, blocks airflow and drives junction temperatures up, which accelerates chip degradation and solder fatigue. Compressed air cleaning every quarter, and a full ultrasonic hashboard clean annually, will add years to a machine's usable life in most environments.",
      "Watch temperature spread, not just peak temperature. A healthy hashboard shows a tight range across its sensors; a growing spread usually signals a failing chip or degraded thermal interface long before the board drops offline. Log the values weekly so you are comparing trends rather than reacting to a single reading.",
      "Fans are consumables. Replace them proactively at around two years rather than waiting for a failure, because a stalled fan can cook a hashboard in minutes. Keep spares of the exact model on hand — mixed fan curves cause uneven cooling and confusing alerts.",
      "Finally, keep firmware current but conservative. Manufacturer firmware updates often improve stability and thermal management, while aggressive third-party overclock profiles raise voltage and shorten hardware life. If you do overclock, do it on immersion or hydro machines where thermals are controlled, and monitor the results closely for the first month.",
    ],
  },
];

function KnowledgePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Knowledge center"
        title="Bitcoin Mining Guides"
        subtitle="Practical, operator-written guidance on selecting hardware, building sites, controlling heat and keeping machines alive. No hype and no affiliate spin."
      />

      <div className="mx-auto max-w-[900px] px-4 py-12">
        <nav aria-label="Article list" className="mb-12 rounded-md border border-border bg-card p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
            In this guide
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {ARTICLES.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`} className="text-primary hover:underline">
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {ARTICLES.map((a) => (
          <article key={a.id} id={a.id} className="mb-16 scroll-mt-32">
            <img
              src={a.img}
              alt={a.title}
              loading="lazy"
              width={1200}
              height={800}
              className="h-56 w-full rounded-md object-cover md:h-72"
            />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {a.tag} · {a.date}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-charcoal md:text-3xl">
              {a.title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {a.paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        ))}

        <div className="rounded-md bg-navy px-6 py-10 text-center text-charcoal-foreground">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">
            Need hardware advice for your site?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-foreground/75">
            Send us your power cost and capacity and we will model which machines make sense.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-ice"
          >
            Ask an engineer
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}