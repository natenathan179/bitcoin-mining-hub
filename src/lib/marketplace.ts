// Bitcoin Mining Marketplace — location-targeted transactional landing pages.
// Location data is generated from the SEO keyword database; page copy is
// composed here so 1,000+ pages stay fast to build and ship.
import RAW from "./marketplace-locations.json";
import { SITE } from "./site";

export type LocationType = "city" | "state";
export type FamilyId = "asic" | "z15" | "s23";

interface RawLocation {
  s: string;
  p: string;
  c: string;
  t: LocationType;
  f: FamilyId;
  k: string;
}

export interface MarketplaceLocation {
  slug: string;
  place: string;
  country: string;
  type: LocationType;
  family: FamilyId;
  keyword: string;
}

export const MARKET_LOCATIONS: MarketplaceLocation[] = (RAW as RawLocation[]).map((r) => ({
  slug: r.s,
  place: r.p,
  country: r.c,
  type: r.t,
  family: r.f,
  keyword: r.k,
}));

const BY_SLUG = new Map(MARKET_LOCATIONS.map((l) => [l.slug, l]));

export function getLocation(slug: string) {
  return BY_SLUG.get(slug) ?? null;
}

export const MARKET_COUNTRIES = Array.from(
  new Set(MARKET_LOCATIONS.map((l) => l.country)),
).sort();

export interface Family {
  id: FamilyId;
  label: string;
  product: string;
  shortLabel: string;
  algorithm: string;
  spec: string;
  terms: string[];
  brands?: string[];
  useCase: string;
}

export const FAMILIES: Record<FamilyId, Family> = {
  asic: {
    id: "asic",
    label: "ASIC Miners",
    product: "ASIC miner",
    shortLabel: "ASIC Mining Machines",
    algorithm: "SHA-256 (Bitcoin)",
    spec: "100 TH/s to 500 TH/s at 12–29 J/TH, air, hydro and immersion cooled",
    terms: ["antminer", "whatsminer", "avalon", "asic"],
    useCase: "any SHA-256 bitcoin mining deployment, from a single home unit to a container build",
  },
  z15: {
    id: "z15",
    label: "Antminer Z15 Pro",
    product: "Antminer Z15 Pro",
    shortLabel: "Antminer Z15 Pro",
    algorithm: "Equihash (Zcash / ZEC)",
    spec: "840 ksol/s at roughly 2,560 W, air cooled, 3-fan chassis",
    terms: ["z15", "equihash", "zcash"],
    brands: ["Bitmain"],
    useCase: "Equihash mining of Zcash and other ZEC-family coins alongside a bitcoin fleet",
  },
  s23: {
    id: "s23",
    label: "Bitmain Antminer S23",
    product: "Bitmain Antminer S23",
    shortLabel: "Bitmain Antminer S23",
    algorithm: "SHA-256 (Bitcoin)",
    spec: "next-generation efficiency in the 9–13 J/TH class, air and hydro variants",
    terms: ["s23", "s21", "hydro", "antminer"],
    brands: ["Bitmain"],
    useCase: "long-horizon bitcoin mining where joules per terahash decides survival through difficulty growth",
  },
};

export const MARKET_FAMILY_LIST = [FAMILIES.asic, FAMILIES.s23, FAMILIES.z15];

/** Regional delivery lane copy so each page reads locally instead of generically. */
const LANES: Record<string, { lane: string; duty: string; hub: string }> = {
  "United States": {
    lane: "DHL and FedEx express air freight out of Hong Kong International Airport, typically 3–7 business days door to door",
    duty: "US import duty and any Section 301 tariff exposure is itemised on your invoice before you pay, and we file the commercial paperwork for you",
    hub: "Los Angeles, Chicago and Memphis clearance gateways",
  },
  Canada: {
    lane: "express air freight into Vancouver or Toronto, then domestic courier to your address, usually 4–8 business days",
    duty: "GST/HST and any applicable duty is calculated up front, with CBSA paperwork prepared by our freight desk",
    hub: "Vancouver and Toronto clearance gateways",
  },
  "United Kingdom": {
    lane: "air freight into Heathrow or East Midlands, then next-day domestic delivery, usually 4–8 business days",
    duty: "UK VAT and EORI documentation is handled with your customs broker, and we supply the full commercial invoice pack",
    hub: "Heathrow and East Midlands clearance gateways",
  },
  Germany: {
    lane: "air freight into Frankfurt with onward EU road delivery, usually 4–9 business days",
    duty: "EU import VAT and EORI paperwork is prepared in advance so clearance is not the bottleneck",
    hub: "Frankfurt and Rotterdam clearance gateways",
  },
  Netherlands: {
    lane: "air freight into Amsterdam Schiphol or road from our Rotterdam consolidation partner, usually 4–9 business days",
    duty: "EU import VAT and EORI paperwork is prepared in advance so clearance is not the bottleneck",
    hub: "Schiphol and Rotterdam clearance gateways",
  },
  Belgium: {
    lane: "air freight into Brussels or Liège with onward road delivery, usually 4–9 business days",
    duty: "EU import VAT and EORI paperwork is prepared in advance so clearance is not the bottleneck",
    hub: "Liège and Rotterdam clearance gateways",
  },
  Austria: {
    lane: "air freight into Vienna or road from our Frankfurt hub, usually 5–10 business days",
    duty: "EU import VAT and EORI paperwork is prepared in advance so clearance is not the bottleneck",
    hub: "Vienna and Frankfurt clearance gateways",
  },
  Luxembourg: {
    lane: "air freight into Luxembourg Findel — one of Europe's busiest cargo airports — with same-country onward delivery, usually 4–9 business days",
    duty: "EU import VAT and EORI paperwork is prepared in advance so clearance is not the bottleneck",
    hub: "Findel and Frankfurt clearance gateways",
  },
  Australia: {
    lane: "air freight into Sydney, Melbourne, Brisbane or Perth with domestic courier onward, usually 5–10 business days",
    duty: "Australian GST and import declarations are itemised before payment and lodged by our freight forwarder",
    hub: "Sydney and Melbourne clearance gateways",
  },
  Russia: {
    lane: "air or rail freight via our Central Asia and Far East forwarding partners, usually 7–18 days depending on route",
    duty: "your broker receives a complete commercial invoice and HS classification pack for customs declaration",
    hub: "Moscow and Novosibirsk clearance gateways",
  },
  Ukraine: {
    lane: "air freight into Poland followed by bonded road transit, usually 8–18 days depending on the current corridor",
    duty: "your broker receives a complete commercial invoice and HS classification pack for customs declaration",
    hub: "Warsaw transit and onward road delivery",
  },
};

const DEFAULT_LANE = {
  lane: "express air freight from Hong Kong with door-to-door courier delivery, usually 5–12 business days",
  duty: "local import duty and VAT are itemised on the invoice before payment, with full customs paperwork supplied",
  hub: "regional clearance gateway nearest to you",
};

export function lane(country: string) {
  return LANES[country] ?? DEFAULT_LANE;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const pick = <T,>(arr: T[], seed: number, offset = 0) => arr[(seed + offset) % arr.length];

export interface MarketSection {
  h2: string;
  paras: string[];
}

export interface MarketPage {
  location: MarketplaceLocation;
  family: Family;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  sections: MarketSection[];
  faqs: { q: string; a: string }[];
  readMinutes: number;
  date: string;
}

export function buildPage(loc: MarketplaceLocation): MarketPage {
  const fam = FAMILIES[loc.family];
  const seed = hash(loc.slug);
  const L = lane(loc.country);
  const where = loc.type === "city" ? `${loc.place}, ${loc.country}` : `${loc.place}`;
  const scope = loc.type === "city" ? "city" : "state";
  const p = fam.product;

  const openers = [
    `Buying a ${p} in ${where} comes down to three things: verified hardware, a delivery lane that actually clears customs, and a price you can hold against your electricity rate.`,
    `If you are searching for a ${p} for sale in ${where}, you are looking for stock that exists today — not a pre-order queue, and not a listing that quietly disappears after payment.`,
    `Bitcoin Mining Depot ships the ${p} to ${where} direct from our Causeway Bay, Hong Kong warehouse, with every unit bench-tested and hashrate-verified before it leaves the building.`,
  ];

  const intro = [
    pick(openers, seed),
    `We are a Hong Kong-based supplier sitting next to the factories and the secondary market, which is why buyers in ${where} get current-generation pricing instead of a reseller markup. Delivery runs on ${L.lane}, and ${L.duty}.`,
    `Every ${p} listed on this page is real inventory you can add to the cart, pay for in crypto, CashApp, Chime or bank transfer, and track to your door in ${loc.place}. Specification for this model family: ${fam.spec}, running ${fam.algorithm}.`,
  ];

  const sections: MarketSection[] = [
    {
      h2: `${p} Price and Availability in ${loc.place}`,
      paras: [
        `Pricing for the ${p} delivered to ${where} is quoted all-in: unit price, freight from Hong Kong, and a clear statement of the duty and tax you will owe on arrival. There is no separate "shipping quote later" step, because surprise freight charges are the most common reason a mining purchase falls apart after payment.`,
        `Availability moves fast. Machines are sold from live stock, so the honest way to check the current ${p} price in ${loc.place} is to open the product page and look at the listed figure — it is the price we are trading at today, not a stale published MSRP. Buyers ordering three units or more should use the wholesale desk, where per-unit pricing improves with volume and pallet freight replaces parcel freight.`,
        `We also hold tested used and refurbished hardware for buyers in ${loc.place} who want the fastest payback per dollar rather than the best efficiency figure. That trade-off is worth making when your power is cheap and your holding period is short.`,
      ],
    },
    {
      h2: `Shipping a ${p} to ${where}`,
      paras: [
        `Orders leave Hong Kong within 24–72 hours of cleared payment. From there the route into ${loc.country} runs through ${L.hub}, and we provide the tracking number, packing list, HS classification and commercial invoice the moment the shipment is booked.`,
        `Miners are double-boxed with foam-cradled hashboards and separately packed PSUs, because vibration damage in transit — not electrical failure — is what usually kills a machine before it ever hashes. For multi-unit orders to ${loc.place} we palletise and consolidate so you pay freight once instead of per carton.`,
        `${L.duty}. If you already work with a customs broker in ${loc.country}, we send documents straight to them; if you do not, our freight desk can recommend one that regularly clears mining hardware.`,
      ],
    },
    {
      h2: `Power, Hosting and Site Requirements in ${loc.place}`,
      paras: [
        `Before you order, confirm three numbers: your electricity rate per kilowatt hour, your available amperage, and your voltage. A single high-end ${p} class machine wants a dedicated 240 V circuit and real airflow — a shared residential 15 A breaker in ${loc.place} will trip long before the unit reaches rated hashrate.`,
        `Heat and noise are the second constraint. Air-cooled ASICs run at 70–80 dB, which is fine in a garage or a shed and unbearable in a shared apartment wall. Hydro and immersion machines solve both problems and hold rated efficiency far better in warm ambient conditions, at the cost of a coolant loop or a tank.`,
        `If a compliant site in ${where} is not practical, hosting is the pragmatic answer: you own the ${p}, we place it in a facility with industrial power, cooling and 24/7 monitoring, and you take the mining revenue without running an electrical project at home.`,
      ],
    },
    {
      h2: `Is Bitcoin Mining Worth It in ${loc.place}?`,
      paras: [
        `Profitability in ${where} is a function of your power price far more than your hardware choice. Run the math the same way we do: daily revenue at current network difficulty, minus (machine watts ÷ 1,000 × 24 × your kWh rate), then divide the delivered machine cost by that daily margin to get payback in days.`,
        `At low power rates, older value-tier hardware often pays back fastest. Above roughly ten cents per kilowatt hour, only efficient current-generation machines hold margin through difficulty increases, which is exactly why we push efficiency over headline hashrate for buyers with long horizons in ${loc.country}.`,
        `${p} suits ${fam.useCase}. Send us your rate and your available amperage and we will model the realistic outcome for your ${scope} before you spend anything — including the case where the answer is hosting rather than a home install.`,
      ],
    },
    {
      h2: `How to Order From ${loc.place}`,
      paras: [
        `The process is deliberately simple. Choose your machine on the product page, add it to the cart or open the inquiry form for a tailored quote, then complete checkout by selecting a payment method — Bitcoin, USDT and other major crypto, or CashApp, Chime and bank transfer for buyers who prefer fiat rails.`,
        `Crypto payers get the receiving address and QR code on screen, then paste the transaction ID and full delivery details for ${loc.place} into the order form. Fiat payers upload proof of payment for manual review. Either way you receive written confirmation, then dispatch tracking once the machine ships.`,
        `Every unit ships with written warranty terms in plain language, and our repair team supports hashboard, PSU and controller faults for the life of the machine — including units already deployed in ${loc.country}.`,
      ],
    },
    {
      h2: `Why Buyers in ${loc.country} Order From Hong Kong`,
      paras: [
        `Hong Kong is the physical centre of the ASIC trade. Factories, the secondary market, repair supply chains and the freight capacity to move heavy electronics all sit within a few hours of our facility at Tower 1, Times Square, Causeway Bay. Buying from that origin removes a layer of middlemen between you and the hardware.`,
        `It also means real testing. Machines are powered up, hashrate-verified against spec and thermally checked before they are packed — the step domestic resellers in ${loc.country} usually skip because they never open the box.`,
        `We ship to the USA, Canada, Europe, Australia and 100+ countries every week, so a delivery into ${where} is routine freight for us rather than a one-off experiment.`,
      ],
    },
  ];

  const faqs = [
    {
      q: `Can I buy a ${p} in ${where}?`,
      a: `Yes. We ship the ${p} directly to ${where} from Hong Kong with express air freight, full customs documentation and tracking. Order online and pay in crypto, CashApp, Chime or bank transfer.`,
    },
    {
      q: `How long does delivery to ${loc.place} take?`,
      a: `Dispatch is within 24–72 hours of cleared payment, and transit runs on ${L.lane}. You receive tracking as soon as the shipment is booked.`,
    },
    {
      q: `What does a ${p} cost delivered to ${loc.country}?`,
      a: `Current pricing is shown live on the product page and quoted all-in with freight. ${L.duty}. Orders of three or more units qualify for wholesale pricing.`,
    },
    {
      q: `Do you offer a warranty for buyers in ${loc.place}?`,
      a: `Every machine ships with written warranty terms and DOA protection. Our Hong Kong repair centre handles hashboard, PSU and controller faults, including for units already installed in ${loc.country}.`,
    },
    {
      q: `Can you host my ${p} instead of shipping it to ${loc.place}?`,
      a: `Yes. If industrial power, cooling or noise limits make a local install impractical, our hosting programme runs your machine in a monitored facility and you keep the mining revenue.`,
    },
    {
      q: `Which payment methods can I use from ${loc.country}?`,
      a: `Bitcoin, USDT and other major cryptocurrencies, plus CashApp, Chime and bank transfer. Crypto payments are confirmed by transaction ID; fiat payments are verified from your uploaded proof of payment.`,
    },
  ];

  const metaTitleBase = `Buy ${p} in ${loc.place}`;
  const metaTitle =
    `${metaTitleBase} | ${loc.type === "city" ? loc.country : "In Stock"}`.length > 60
      ? metaTitleBase.slice(0, 60)
      : `${metaTitleBase} | ${loc.type === "city" ? loc.country : "In Stock"}`;

  return {
    location: loc,
    family: fam,
    title: `Buy ${p} in ${where} — Price, Shipping & Stock`,
    h1: `Buy ${p} in ${where}`,
    metaTitle,
    metaDescription:
      `Buy a ${p} in ${where} from ${SITE.name}. In-stock, bench-tested hardware shipped from Hong Kong with tracked delivery, warranty and crypto, CashApp, Chime or bank payment.`.slice(
        0,
        158,
      ),
    keywords: [
      loc.keyword.toLowerCase(),
      `${p.toLowerCase()} for sale ${loc.place.toLowerCase()}`,
      `${p.toLowerCase()} price ${loc.place.toLowerCase()}`,
      `bitcoin mining machine ${loc.place.toLowerCase()}`,
      `asic miner ${loc.country.toLowerCase()}`,
      `buy bitcoin miner ${loc.place.toLowerCase()}`,
    ],
    intro,
    sections,
    faqs,
    readMinutes: 7,
    date: "2026-08-20",
  };
}

/** Nearby pages in the same country/family for internal linking. */
export function relatedLocations(loc: MarketplaceLocation, limit = 10) {
  const same = MARKET_LOCATIONS.filter(
    (l) => l.slug !== loc.slug && l.country === loc.country && l.family === loc.family,
  );
  const i = same.findIndex((l) => l.place > loc.place);
  const start = Math.max(0, (i === -1 ? same.length : i) - Math.floor(limit / 2));
  const out = same.slice(start, start + limit);
  if (out.length < limit) {
    const others = MARKET_LOCATIONS.filter(
      (l) => l.slug !== loc.slug && l.family !== loc.family && l.place === loc.place,
    );
    out.push(...others.slice(0, limit - out.length));
  }
  return out;
}
