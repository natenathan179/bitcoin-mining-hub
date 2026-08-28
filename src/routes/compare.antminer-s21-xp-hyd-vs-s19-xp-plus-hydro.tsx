import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { productQuery, type Product } from "@/lib/data";

const SLUG_A = "antminer-s21-xp-hyd";
const SLUG_B = "bitmain-antminer-s19-xp-plus-hydro";

const TITLE =
  "Antminer S21 XP Hyd vs S19 XP+ Hydro: Hashrate, Efficiency & Profitability Compared";
const DESCRIPTION =
  "Side-by-side comparison of the Bitmain Antminer S21 XP Hyd (473 TH/s, 12 J/TH) and S19 XP+ Hydro (558 TH/s, 19 J/TH) — hashrate, efficiency, power draw, price and estimated daily profit.";

export const Route = createFileRoute("/compare/antminer-s21-xp-hyd-vs-s19-xp-plus-hydro")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productQuery(SLUG_A)),
      context.queryClient.ensureQueryData(productQuery(SLUG_B)),
    ]);
  },
  head: () => ({
    meta: [
      { title: "S21 XP Hyd vs S19 XP+ Hydro — Miner Comparison | BMD" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:url",
        content:
          "https://bitcoinminingdepot.com/compare/antminer-s21-xp-hyd-vs-s19-xp-plus-hydro",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://bitcoinminingdepot.com/compare/antminer-s21-xp-hyd-vs-s19-xp-plus-hydro",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://bitcoinminingdepot.com/" },
            { "@type": "ListItem", position: 2, name: "Compare Miners", item: "https://bitcoinminingdepot.com/products" },
            {
              "@type": "ListItem",
              position: 3,
              name: "S21 XP Hyd vs S19 XP+ Hydro",
              item: "https://bitcoinminingdepot.com/compare/antminer-s21-xp-hyd-vs-s19-xp-plus-hydro",
            },
          ],
        }),
      },
    ],
  }),
  component: ComparePage,
});

function num(value: string | null | undefined) {
  const match = String(value ?? "").replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function money(v: number) {
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

function economics(p: Product, kwh: number, hashprice: number) {
  const th = num(p.hashrate);
  const watts = num(p.power);
  const cost = p.sale_price ?? p.price;
  const revenue = th * hashprice;
  const powerCost = (watts / 1000) * 24 * kwh;
  const profit = revenue - powerCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const breakeven = profit > 0 ? cost / profit : Infinity;
  return { th, watts, cost, revenue, powerCost, profit, margin, breakeven };
}

function ComparePage() {
  const a = useSuspenseQuery(productQuery(SLUG_A)).data;
  const b = useSuspenseQuery(productQuery(SLUG_B)).data;
  const [kwh, setKwh] = useState(0.06);
  const [hashprice, setHashprice] = useState(0.045);

  if (!a || !b) {
    return (
      <SiteLayout>
        <PageHero title="Comparison unavailable" subtitle="These miners are not currently listed." />
      </SiteLayout>
    );
  }

  const ea = economics(a, kwh, hashprice);
  const eb = economics(b, kwh, hashprice);
  const pair: [Product, Product] = [a, b];
  const econ = [ea, eb];

  const rows: { label: string; values: [string, string]; better?: 0 | 1 }[] = [
    { label: "Hashrate", values: [a.hashrate, b.hashrate], better: ea.th >= eb.th ? 0 : 1 },
    {
      label: "Efficiency (lower is better)",
      values: [a.efficiency, b.efficiency],
      better: num(a.efficiency) <= num(b.efficiency) ? 0 : 1,
    },
    {
      label: "Power draw",
      values: [a.power, b.power],
      better: ea.watts <= eb.watts ? 0 : 1,
    },
    { label: "Cooling", values: [a.specs?.Cooling ?? "Hydro", b.specs?.Cooling ?? "Hydro"] },
    { label: "Algorithm / coins", values: [a.algorithm, b.algorithm] },
    {
      label: "Water inlet temp",
      values: [
        a.specs?.["Water inlet temperature"] ?? "—",
        b.specs?.["Water inlet temperature"] ?? "—",
      ],
    },
    {
      label: "Form factor",
      values: [a.specs?.["Miner dimensions"] ?? "Standard chassis", b.specs?.["Form factor"] ?? "—"],
    },
    { label: "Noise level", values: [a.specs?.["Noise level"] ?? "—", b.specs?.["Noise level"] ?? "—"] },
    { label: "Warranty", values: [a.specs?.Warranty ?? "—", b.specs?.Warranty ?? "—"] },
    {
      label: "Price",
      values: [money(ea.cost), money(eb.cost)],
      better: ea.cost <= eb.cost ? 0 : 1,
    },
  ];

  const profitRows: { label: string; values: [string, string]; better?: 0 | 1 }[] = [
    {
      label: "Estimated daily revenue",
      values: [money(ea.revenue), money(eb.revenue)],
      better: ea.revenue >= eb.revenue ? 0 : 1,
    },
    {
      label: "Daily electricity cost",
      values: [money(ea.powerCost), money(eb.powerCost)],
      better: ea.powerCost <= eb.powerCost ? 0 : 1,
    },
    {
      label: "Estimated daily profit",
      values: [money(ea.profit), money(eb.profit)],
      better: ea.profit >= eb.profit ? 0 : 1,
    },
    {
      label: "Estimated monthly profit",
      values: [money(ea.profit * 30), money(eb.profit * 30)],
      better: ea.profit >= eb.profit ? 0 : 1,
    },
    {
      label: "Profit margin",
      values: [`${ea.margin.toFixed(1)}%`, `${eb.margin.toFixed(1)}%`],
      better: ea.margin >= eb.margin ? 0 : 1,
    },
    {
      label: "Hardware payback period",
      values: [
        Number.isFinite(ea.breakeven) ? `${Math.round(ea.breakeven)} days` : "Not profitable",
        Number.isFinite(eb.breakeven) ? `${Math.round(eb.breakeven)} days` : "Not profitable",
      ],
      better: ea.breakeven <= eb.breakeven ? 0 : 1,
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Miner Comparison"
        title="Antminer S21 XP Hyd vs S19 XP+ Hydro"
        subtitle="Compare hashrate, energy efficiency, power draw, price and estimated Bitcoin mining profitability of Bitmain's two flagship hydro-cooled ASIC miners — then adjust the electricity rate and hashprice to model your own site economics."
      />

      <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {pair.map((p, i) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-5">
              <img
                src={p.images?.[0]}
                alt={`${p.name} hydro-cooled ASIC Bitcoin miner`}
                title={p.name}
                loading="lazy"
                className="mx-auto h-44 w-full object-contain"
              />
              <h2 className="mt-4 font-display text-lg font-bold uppercase">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.hashrate} · {p.efficiency} · {p.power}
              </p>
              <p className="mt-2 text-xl font-bold text-primary">{money(econ[i].cost)}</p>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="mt-4 inline-block rounded bg-primary px-4 py-2 text-sm font-semibold uppercase text-primary-foreground"
              >
                View {p.brand || "product"} details
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-lg border border-border bg-muted/40 p-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Electricity rate ($/kWh)
            <input
              type="number"
              step="0.01"
              min="0"
              value={kwh}
              onChange={(e) => setKwh(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium">
            Hashprice ($ per TH/s per day)
            <input
              type="number"
              step="0.005"
              min="0"
              value={hashprice}
              onChange={(e) => setHashprice(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold uppercase">Specification comparison</h2>
        <ComparisonTable products={pair} rows={rows} />

        <h2 className="mt-12 font-display text-2xl font-bold uppercase">
          Estimated profitability comparison
        </h2>
        <ComparisonTable products={pair} rows={profitRows} />
        <p className="mt-3 text-xs text-muted-foreground">
          Estimates assume 24/7 uptime at {money(kwh)}/kWh and a hashprice of ${hashprice}/TH/day.
          Bitcoin mining revenue moves with network difficulty, transaction fees and the BTC price —
          treat these figures as a planning model, not a guarantee.
        </p>

        <div className="mt-12 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl font-bold uppercase text-foreground">
            Which hydro miner should you buy?
          </h2>
          <p>
            The <strong>Antminer S21 XP Hyd</strong> is the efficiency play. At 12 J/TH it converts
            roughly {(num(b.efficiency) / num(a.efficiency)).toFixed(2)}× more of every kilowatt-hour
            into hashrate than the S19 XP+ Hydro, which keeps it profitable far deeper into future
            difficulty increases and at higher power tariffs. If your electricity is above about
            $0.06/kWh, or your site is power-constrained rather than space-constrained, the S21 XP Hyd
            is the correct choice.
          </p>
          <p>
            The <strong>Antminer S19 XP+ Hydro</strong> wins on raw hashrate per chassis — 558 TH/s in
            a 3U rack unit — and on upfront cost per terahash. For operators with very cheap or
            curtailed power, heat-recovery offtake, or an existing hydro rack retrofit, it delivers
            more terahash for less capital, at the cost of nearly double the power draw.
          </p>
          <p>
            Both units are hydro-cooled and require a closed water loop with a dry cooler, filtration
            and industrial three-phase service. Need help sizing a deployment or pricing a container?{" "}
            <Link to="/contact" className="font-semibold text-primary underline">
              Talk to our team
            </Link>{" "}
            or review our{" "}
            <Link to="/hosting" className="font-semibold text-primary underline">
              hosting options
            </Link>
            .
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function ComparisonTable({
  products,
  rows,
}: {
  products: [Product, Product];
  rows: { label: string; values: [string, string]; better?: 0 | 1 }[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="bg-navy text-charcoal-foreground">
            <th scope="col" className="px-4 py-3 text-left font-semibold">
              Specification
            </th>
            {products.map((p) => (
              <th key={p.id} scope="col" className="px-4 py-3 text-left font-semibold">
                {p.specs?.Model ?? p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border odd:bg-muted/30">
              <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className={
                    row.better === i
                      ? "px-4 py-3 font-semibold text-primary"
                      : "px-4 py-3 text-muted-foreground"
                  }
                >
                  {value}
                  {row.better === i && <span className="sr-only"> (better)</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}