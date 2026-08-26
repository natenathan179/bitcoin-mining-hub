// SEO category landing-page definitions. Each collection auto-matches products
// from the catalogue and blog posts from the editorial library.
import type { Product } from "./data";
import type { BlogPost } from "./blog";
import { BLOG_POSTS } from "./blog";

export interface CollectionSection {
  h2: string;
  paras: string[];
}

export interface Collection {
  slug: string;
  eyebrow: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  intro: string[];
  sections: CollectionSection[];
  faqs: { q: string; a: string }[];
  /** product matching */
  categorySlugs?: string[];
  conditions?: string[];
  productTerms?: string[];
  excludeTerms?: string[];
  /** blog matching */
  blogCategoryIds?: string[];
  blogTerms: string[];
  cta: { label: string; to: string };
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "asic-miners",
    eyebrow: "Category",
    name: "ASIC Miners",
    h1: "ASIC Bitcoin Miners for Sale",
    metaTitle: "ASIC Miners for Sale | Antminer, WhatsMiner & Avalon Hardware",
    metaDescription:
      "Buy new and in-stock ASIC bitcoin miners from Bitmain, MicroBT and Canaan. Compare hashrate, J/TH efficiency and price per terahash, with worldwide shipping and warranty.",
    ogDescription:
      "In-stock ASIC bitcoin miners ranked by efficiency and price per terahash, with expert guides for every model.",
    intro: [
      "An ASIC miner is a purpose-built machine that does one job — compute SHA-256 hashes for the Bitcoin network — and does it thousands of times more efficiently than any GPU or CPU. This category collects every application-specific integrated circuit miner we currently hold, from current-generation Antminer S21 and WhatsMiner M6x flagships to value-tier S19 and M30S units that still pay back quickly at low power rates.",
      "Every listing below shows real, tested hashrate and wall power so you can calculate joules per terahash and dollars per terahash before you commit capital. Our Hong Kong team benches each unit, and the guides linked further down this page explain exactly how to match a machine to your electricity price, breaker capacity and holding period.",
    ],
    sections: [
      {
        h2: "How to Compare ASIC Miners Properly",
        paras: [
          "Start with efficiency in joules per terahash, because that number decides which machines keep earning after the next difficulty increase. Divide rated wall power in watts by rated hashrate in terahash per second: an S21 at roughly 13 J/TH consumes about half the electricity of a 26 J/TH machine for the same work, and that gap compounds every hour the unit runs.",
          "Then compare delivered price per terahash, including freight, duty and any PSU you still need to buy. A cheaper machine with a worse efficiency figure can still win if your power is inexpensive and your horizon is short. Above roughly ten cents per kilowatt hour, efficiency dominates and only current-generation ASIC hardware survives a drawdown.",
        ],
      },
      {
        h2: "Air, Hydro and Immersion ASIC Variants",
        paras: [
          "Most ASIC miners ship as air-cooled units that need 200-240V single phase at roughly 16 to 20 amps each and produce 70-plus decibels of fan noise. Hydro variants move heat into a water loop, hold rated hashrate far more consistently in hot climates and run much quieter, but they require plumbing, a dry cooler and usually three-phase distribution.",
          "Immersion-ready hardware sits between the two: standard boards with fans removed, submerged in dielectric fluid. If you are unsure which format your building can support, send us your electrical service details and our engineers will confirm what your site can host before you order anything.",
        ],
      },
      {
        h2: "Warranty, Testing and Shipping",
        paras: [
          "New ASIC miners carry manufacturer warranty coverage, and every unit we ship is bench-tested for stated hashrate, chip temperature deltas and PSU stability before it leaves the facility. Test reports are available on request for bulk orders.",
          "We ship worldwide with consolidated freight for multi-unit purchases, and our repair centre handles hashboard, control board and PSU service if a machine ever falters. Wholesale buyers taking ten or more units receive tiered pricing and priority allocation on new releases.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best ASIC miner to buy right now?",
        a: "There is no single best model — it depends on your electricity rate. Below about six cents per kWh, previous-generation machines like the S19 XP or M50S often deliver the fastest payback. Above ten cents, buy current-generation hardware in the 12-18 J/TH band such as the Antminer S21 family or WhatsMiner M6x series.",
      },
      {
        q: "Can I run an ASIC miner at home?",
        a: "Yes, if you have a dedicated 240V circuit, somewhere to reject several kilowatts of heat and tolerance for fan noise around 75 dB. Many home miners use a garage or outbuilding, or choose a hosted slot instead so the noise and heat stay in a data centre.",
      },
      {
        q: "Do your ASIC miners include a power supply?",
        a: "Most units ship with the matching PSU included. Where a model is sold board-only or requires a specific hydro PSU, the product page states it explicitly and our sales desk will confirm before the order is finalised.",
      },
    ],
    conditions: ["New", "Refurbished"],
    blogCategoryIds: ["rank", "buy", "brand"],
    blogTerms: ["asic", "antminer", "whatsminer", "avalon", "hashrate", "efficiency", "best"],
    cta: { label: "Shop all ASIC miners", to: "/products" },
  },
  {
    slug: "used-refurbished-asic-miners",
    eyebrow: "Category",
    name: "Used & Refurbished Miners",
    h1: "Used & Refurbished Bitcoin Miners",
    metaTitle: "Used & Refurbished Bitcoin Miners for Sale | Tested ASIC Units",
    metaDescription:
      "Shop tested used and refurbished ASIC bitcoin miners at a fraction of new-unit cost. Every S19, M30S and Avalon unit is benched for hashrate and backed by our repair centre.",
    ogDescription:
      "Tested second-hand Antminer, WhatsMiner and Avalon units with verified hashrate and a warranty on refurbished stock.",
    intro: [
      "Used and refurbished ASIC miners are the fastest route to cheap terahash. Because second-hand hardware trades at a steep discount to new units, buyers with inexpensive electricity frequently recover their purchase price faster on a refurbished S19j Pro or M30S++ than on a current-generation flagship — you are buying hashrate, not novelty.",
      "Every unit in this category has been opened, cleaned, repasted where required and benched at our Hong Kong facility. We record hashrate, per-board chip temperatures and PSU behaviour, and we publish the real condition grade rather than a marketing label.",
    ],
    sections: [
      {
        h2: "What Refurbished Actually Means Here",
        paras: [
          "A refurbished machine has been stripped, cleaned of dust, thermally repasted, had failed fans and capacitors replaced, and then run under load until it holds stated hashrate with stable chip temperatures. A used machine is functional and tested but sold as-is with light cosmetic wear and no reconditioning beyond cleaning.",
          "We grade honestly because returns cost us more than a lost sale. If a unit hashes five percent under nameplate, the listing says so and the price reflects it.",
        ],
      },
      {
        h2: "When Used Hardware Beats New Hardware",
        paras: [
          "Under roughly six cents per kilowatt hour, older machines at 21-29 J/TH are usually the highest-return purchase available because the electricity penalty is tolerable and the capital outlay is small. Treat these units as a cash-flow play: buy at a price you would be comfortable writing off inside twelve to eighteen months.",
          "Above ten cents per kWh the math inverts. Older fleets are the first to switch off after a difficulty jump or price drawdown, so higher power rates call for current-generation efficiency instead.",
        ],
      },
      {
        h2: "Spares, Repairs and Risk Management",
        paras: [
          "Buying used means planning for maintenance. Keep at least one spare hashboard and PSU per ten machines, monitor per-chip temperatures from day one, and clean intake filters on a schedule rather than after a failure.",
          "Our repair centre services hashboards, control boards and power supplies for every model we sell, so a failed unit is a repair ticket rather than a write-off. Refurbished stock carries a limited warranty; as-is used units are covered by a functional-on-arrival guarantee.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are used bitcoin miners worth buying?",
        a: "Yes, when your power is cheap. Used ASICs deliver terahash at a fraction of new-unit cost, so payback can be considerably faster. The trade-off is worse efficiency and higher maintenance, which makes them best suited to sub-six-cent power and shorter holding periods.",
      },
      {
        q: "Do refurbished miners come with a warranty?",
        a: "Refurbished units include a limited warranty covering hashboard and PSU failure, and as-is used units ship with a functional-on-arrival guarantee. Our in-house repair centre services every model we sell.",
      },
      {
        q: "How do you test used miners before shipping?",
        a: "Each machine is cleaned, repasted where required, then run under sustained load while we log hashrate, per-board chip temperatures, fan behaviour and PSU stability. Results are recorded against the serial number and available on request.",
      },
    ],
    conditions: ["Used", "Refurbished"],
    blogTerms: ["used", "refurbished", "second", "s19", "m30s", "cheap", "budget", "maintenance", "repair", "lifespan"],
    cta: { label: "Browse used inventory", to: "/used-refurbished-miners" },
  },
  {
    slug: "immersion-cooling-miners",
    eyebrow: "Category",
    name: "Immersion & Hydro Cooling",
    h1: "Immersion Cooling & Hydro Bitcoin Miners",
    metaTitle: "Immersion Cooling & Hydro Miners | Liquid-Cooled ASIC Hardware",
    metaDescription:
      "Liquid-cooled bitcoin mining hardware: hydro Antminers, immersion-ready ASICs, dielectric tanks and dry coolers. Quieter operation, stable hashrate and higher density.",
    ogDescription:
      "Hydro and immersion bitcoin mining hardware for quieter, denser deployments that hold rated hashrate in any climate.",
    intro: [
      "Immersion and hydro cooling replace moving air with liquid, and that single change fixes most of the problems that limit air-cooled mining: noise, dust, thermal throttling and density. A hydro Antminer holds its rated hashrate through a 35 degree summer because coolant temperature, not room temperature, sets the thermal ceiling.",
      "This category collects the liquid-cooled machines and immersion-ready units we stock, along with the guides you need to size a loop, choose a dielectric fluid and reject heat safely. If you are planning a build, our engineers will review your site drawings before you order.",
    ],
    sections: [
      {
        h2: "Hydro vs Single-Phase Immersion",
        paras: [
          "Hydro miners use a sealed water block bolted to each hashboard, connected by quick-disconnects to a manifold, pump and dry cooler. Nothing is submerged, the machine ships ready to plumb, and maintenance is familiar to anyone who has worked on liquid-cooled computing.",
          "Single-phase immersion submerges whole boards in dielectric fluid inside a tank, with a heat exchanger transferring energy to a water loop outside. Immersion allows higher density and near-silent operation but demands a fluid budget, a tank, spill management and a plan for servicing wet boards.",
        ],
      },
      {
        h2: "Overclocking, Efficiency and Hashrate Stability",
        paras: [
          "Liquid cooling lets you push firmware limits safely. Many operators run hydro units ten to thirty percent above nameplate hashrate, because chip junction temperatures stay far below the throttling point when coolant enters at 30 to 40 degrees Celsius.",
          "The stability matters as much as the headroom. Air-cooled fleets typically derate a few percent in hot rooms, so budgeting revenue on roughly 95 percent of rated output is prudent. Liquid-cooled fleets hold nameplate output almost continuously, which is why large farms have accepted the extra infrastructure cost.",
        ],
      },
      {
        h2: "Infrastructure You Need Before Ordering",
        paras: [
          "Plan for the loop before the machines: pump redundancy, filtration, a dry cooler or plate exchanger sized for total kilowatts, glycol concentration for winter, leak detection and a drain plan. Most hydro deployments also require three-phase distribution and higher-amperage breakers than air units.",
          "Heat reuse is where liquid cooling repays the complexity. A 40 to 50 degree return loop can preheat domestic water, warm a greenhouse or heat a workshop, turning a cost centre into a second revenue line. Send us your site details and we will confirm what your service can support.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is immersion cooling worth it for bitcoin mining?",
        a: "For deployments above roughly 100 kW, or anywhere noise and heat are constrained, yes. Immersion and hydro cooling raise density, eliminate dust and fan failures, hold rated hashrate year-round and enable safe overclocking. Below 20 kW the infrastructure cost is usually harder to justify than simply buying a hydro-ready machine.",
      },
      {
        q: "What fluid is used for immersion mining?",
        a: "Single-phase immersion uses a dielectric fluid — typically a synthetic or highly refined mineral oil with a high flash point and low viscosity. Never use conductive coolant or automotive fluids, and confirm material compatibility with board coatings and gaskets before filling a tank.",
      },
      {
        q: "Can I convert an air-cooled miner to immersion?",
        a: "Often yes: fans are removed, the PSU is either relocated or replaced with an immersion-rated unit, and the boards are submerged. Conversion voids most manufacturer warranties, so speak to our engineers about which models tolerate it well before committing a fleet.",
      },
    ],
    productTerms: ["hydro", "immersion", "liquid", "water", "hyd"],
    blogTerms: ["immersion", "cooling", "hydro", "heat", "noise", "liquid", "overclock"],
    cta: { label: "See liquid-cooled hardware", to: "/products" },
  },
  {
    slug: "hosting-solutions",
    eyebrow: "Category",
    name: "Hosting Solutions",
    h1: "Bitcoin Miner Hosting Solutions",
    metaTitle: "Bitcoin Mining Hosting Solutions | Colocation for ASIC Miners",
    metaDescription:
      "Host your ASIC miners in a professional facility with low-cost power, 24/7 monitoring, on-site repair and transparent per-kWh pricing. Buy and host in one step.",
    ogDescription:
      "Colocation hosting for ASIC bitcoin miners: cheap power, 24/7 NOC monitoring, on-site technicians and transparent kWh billing.",
    intro: [
      "Hosting — also called colocation — puts your ASIC miners in a purpose-built facility with industrial power pricing, proper ventilation or liquid cooling, redundant networking and technicians on site. You keep ownership of the hardware and the mining rewards; the facility handles power, cooling, uptime and repairs for a per-kilowatt-hour or per-machine fee.",
      "For most buyers outside a cheap-power jurisdiction, hosting is the difference between a profitable machine and an expensive space heater. The bundles below pair hardware from our catalogue with rack space, so a single order gets you hashing without touching an electrical panel.",
    ],
    sections: [
      {
        h2: "How Hosting Pricing Works",
        paras: [
          "Most contracts bill a blended rate per kilowatt hour that covers electricity, cooling, monitoring and basic maintenance. Compare offers on that all-in figure rather than the headline energy rate, and confirm whether setup fees, deposits, uptime guarantees and pool-fee arrangements sit inside or outside it.",
          "Ask what happens during curtailment, how downtime is credited, who owns the repair cost after warranty, and how quickly you can retrieve your machines. A facility that answers those four questions clearly is usually a facility worth using.",
        ],
      },
      {
        h2: "Hosting vs Mining at Home",
        paras: [
          "Home mining wins on control and on very small deployments, especially where you can use waste heat. It loses on power price, noise, insurance and uptime — a single tripped breaker at 3am costs a full day of production if nobody is watching.",
          "Hosting wins on cost per terahash and on operational reliability: 24/7 NOC monitoring, spare parts on the shelf, technicians who can swap a hashboard the same day, and industrial power contracts no residential customer can access. The trade-off is a monthly bill and reduced physical access to your hardware.",
        ],
      },
      {
        h2: "What Our Facilities Provide",
        paras: [
          "Racked air-cooled and hydro slots, redundant fibre uplinks, per-machine monitoring dashboards with hashrate and temperature alerts, filtered intake air and on-site repair capability for hashboards, control boards and PSUs.",
          "Reporting is monthly and itemised: energy consumed, uptime achieved, incidents logged and any repairs performed. New customers can start with a single machine and scale into dedicated containers as their fleet grows.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does bitcoin miner hosting cost?",
        a: "Hosting is normally quoted as an all-in rate per kilowatt hour that bundles electricity, cooling, monitoring and basic maintenance. Contact our team with your machine count and model for a current quote, since rates move with wholesale energy pricing.",
      },
      {
        q: "Who receives the mining rewards when I host?",
        a: "You do. You point the machines at your own pool account and worker names, so rewards are paid directly to your wallet. The facility only bills for hosting services.",
      },
      {
        q: "Can I buy miners and host them in the same order?",
        a: "Yes — that is the most common route. We provision the hardware, bench-test it, rack it in the facility and hand you monitoring access, so you never take physical delivery unless you want to.",
      },
    ],
    productTerms: ["hosting", "colocation", "container", "hosted"],
    blogTerms: ["hosting", "colocation", "farm", "facility", "electricity", "power", "off-grid", "renewable"],
    cta: { label: "Explore hosting plans", to: "/hosting" },
  },
];

export function findCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

function haystack(p: Product) {
  return `${p.name} ${p.brand} ${p.short_description} ${p.description} ${p.hashrate} ${p.algorithm} ${Object.values(p.specs ?? {}).join(" ")}`.toLowerCase();
}

export function matchProducts(collection: Collection, products: Product[], categorySlugById: Record<string, string>) {
  return products.filter((p) => {
    if (collection.categorySlugs?.length) {
      const slug = p.category_id ? categorySlugById[p.category_id] : undefined;
      if (!slug || !collection.categorySlugs.includes(slug)) return false;
    }
    if (collection.conditions?.length && !collection.conditions.includes(p.condition)) return false;
    if (collection.productTerms?.length) {
      const hay = haystack(p);
      if (!collection.productTerms.some((t) => hay.includes(t))) return false;
    }
    if (collection.excludeTerms?.length) {
      const hay = haystack(p);
      if (collection.excludeTerms.some((t) => hay.includes(t))) return false;
    }
    return true;
  });
}

export function matchPosts(collection: Collection, limit = 12): BlogPost[] {
  const scored = BLOG_POSTS.map((post) => {
    const hay = `${post.title} ${post.description} ${post.keywords.join(" ")}`.toLowerCase();
    let score = collection.blogTerms.reduce((n, t) => (hay.includes(t) ? n + 2 : n), 0);
    if (collection.blogCategoryIds?.includes(post.categoryId)) score += 1;
    return { post, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title));
  return scored.slice(0, limit).map((s) => s.post);
}

/* ---------------- internal linking helpers ---------------- */

const STOP = new Set(["miner", "bitcoin", "asic", "for", "sale", "the", "and", "with", "pro", "th/s"]);

/** Distinctive model tokens from a product name, e.g. "s21", "xp", "hyd". */
export function modelTokens(product: Product): string[] {
  return Array.from(
    new Set(
      `${product.name} ${product.brand}`
        .toLowerCase()
        .replace(/[^a-z0-9+ ]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1 && !STOP.has(t)),
    ),
  );
}

/** Descriptive anchor text for a product link — good for keyword-rich internal links. */
export function productAnchor(product: Product): string {
  const bits = [product.hashrate, product.efficiency].filter(Boolean).join(" · ");
  return bits ? `${product.name} (${bits})` : product.name;
}

/** Blog posts most relevant to one specific product. */
export function postsForProduct(product: Product, limit = 3): BlogPost[] {
  const tokens = modelTokens(product);
  const brand = product.brand?.toLowerCase() ?? "";
  const used = /used|refurb/i.test(product.condition);
  const scored = BLOG_POSTS.map((post) => {
    const hay = `${post.title} ${post.description} ${post.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score += t.length > 2 ? 3 : 1;
    if (brand && hay.includes(brand)) score += 3;
    if (used && /(used|refurbish|second-hand|budget)/.test(hay)) score += 2;
    if (post.categoryId === "profit" || post.categoryId === "buy") score += 1;
    return { post, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title));
  return scored.slice(0, limit).map((s) => s.post);
}

export interface LinkGroup {
  title: string;
  products: Product[];
}

/** Group a collection's matched products by brand for a link hub. */
export function brandLinkGroups(products: Product[], maxGroups = 6, perGroup = 8): LinkGroup[] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const brand = p.brand?.trim() || "Other brands";
    const list = map.get(brand) ?? [];
    list.push(p);
    map.set(brand, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, maxGroups)
    .map(([title, list]) => ({
      title,
      products: [...list]
        .sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
        .slice(0, perGroup),
    }));
}

/** Highest-value products in the collection, used for spotlight link cards. */
export function spotlightProducts(products: Product[], limit = 6): Product[] {
  return [...products]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.sale_price ?? b.price) - (a.sale_price ?? a.price);
    })
    .slice(0, limit);
}
