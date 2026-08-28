import type { CopyBlock } from "@/components/site/SeoCopy";

/**
 * Long-form editorial copy for pages whose interface is form- or grid-heavy.
 * Keeps every page substantive for readers and lifts the text-to-HTML ratio
 * that SEO crawlers measure.
 */
export const PAGE_COPY: Record<string, { title: string; blocks: CopyBlock[] }> = {
  contact: {
    title: "How Our Hong Kong Sales Desk Works",
    blocks: [
      {
        heading: "Who you are talking to",
        paras: [
          "Bitcoin Mining Depot is headquartered at Tower 1, Times Square, 34號 Matheson St, Causeway Bay, Hong Kong Island, and we hold stock in a bonded Hong Kong warehouse a short drive from the airport. Enquiries are answered by the same engineers who bench-test the machines, so questions about hashboard grading, firmware, PSU compatibility or three-phase power get a technical answer rather than a sales script.",
          "Our team covers English and Cantonese and works Hong Kong business hours, Monday to Friday, with weekend cover for freight problems and payment confirmations. Most quotes are returned within one business day, and urgent WhatsApp messages are usually answered inside an hour during trading hours.",
        ],
      },
      {
        heading: "What to include in your first message",
        paras: [
          "The faster route to an accurate quote is to tell us the model and quantity you want, your delivery city and country, your electricity rate in cents per kilowatt hour, and the voltage and available amperage at the site. With those four inputs we can confirm live stock, quote door-to-door freight, flag customs paperwork such as an EORI or IOR number, and tell you honestly whether a cheaper used unit beats a new machine at your power cost.",
          "If you are buying more than ten units, mention your target budget and timeline. Volume pricing, staged shipments and hosting placement are all negotiable, and we would rather build a plan around your real constraints than send a generic price list.",
        ],
      },
      {
        heading: "Shipping, duties and after-sales",
        paras: [
          "We ship worldwide from Hong Kong: DHL and FedEx express air freight to the United States, Canada, the United Kingdom, the European Union, Australia, the Middle East, Latin America and Africa, with sea freight available for container-scale orders. Duties and import taxes are assessed by your own customs authority; we supply commercial invoices, HS codes and packing lists that clear customs without delays.",
          "After delivery you keep the same contact. Warranty claims, RMA shipping labels, firmware questions and repair quotes all run through the sales desk, so nothing gets lost between departments.",
        ],
      },
    ],
  },

  faq: {
    title: "Buying ASIC Miners From Hong Kong: What Buyers Ask Most",
    blocks: [
      {
        heading: "Sourcing and hardware condition",
        paras: [
          "Every machine we list is either new in the manufacturer's original packaging or clearly graded as used or refurbished. Used units are stripped, cleaned, re-pasted where needed, and run under full load on the bench until the hashrate is stable, with the measured hashrate and error rate recorded before packing. If a unit cannot hold its rated hashrate we sell it as a repair candidate at a repair-candidate price rather than dressing it up as fully working stock.",
          "Serial numbers stay with the unit, so factory warranty registration remains possible on new hardware and you can verify a machine's history with the manufacturer where that service exists.",
        ],
      },
      {
        heading: "Power, hosting and running costs",
        paras: [
          "Most modern air-cooled ASICs need 200–240V single-phase power at 15–20 amps per unit, plus roughly 20 CFM of airflow per 100 watts of heat. Hydro and immersion machines shift that load into a coolant loop and cut noise dramatically, but they need a dry cooler or heat exchanger sized to the total kilowatt load. If your site cannot support those numbers, hosting is usually cheaper than rebuilding an electrical room.",
          "Profitability is driven far more by your electricity rate than by headline hashrate. Below about six cents per kilowatt hour, well-priced used S19-class hardware often pays back faster than the newest flagship; above ten cents, efficiency in joules per terahash is the only number that matters.",
        ],
      },
      {
        heading: "Payment, freight and warranty",
        paras: [
          "We accept cryptocurrency, CashApp, Chime and bank transfer. Crypto orders are confirmed on-chain: you choose the coin, pay to the published address shown at checkout, then paste the transaction ID with your delivery details so our team can verify the payment before dispatch. Payment details are only ever published on this website — never act on wallet addresses received by email or social media.",
          "New hardware carries the manufacturer warranty where applicable; used and refurbished machines carry our own 30-day functional warranty on hashboards and power supplies. Freight claims are handled with the carrier on your behalf, and our repair lab can service most units instead of writing them off.",
        ],
      },
    ],
  },

  hosting: {
    title: "Understanding Hosted Bitcoin Mining",
    blocks: [
      {
        heading: "What hosting actually buys you",
        paras: [
          "Hosting places your machines in a purpose-built facility with industrial power, engineered airflow or liquid cooling, redundant networking and on-site technicians. You keep full ownership of the hardware and 100% of the mining rewards; you pay a per-kilowatt-hour rate plus a maintenance component. For most buyers this is the difference between a viable operation and a garage full of hot, loud machines tripping breakers.",
          "The economics are simple: a hosted unit at a low industrial power rate usually beats the same unit at residential tariffs even after hosting fees, because facility power is bought at scale and uptime is far higher.",
        ],
      },
      {
        heading: "How deployment works",
        paras: [
          "Once a slot is reserved, machines are shipped either from our Hong Kong warehouse straight to the facility or from your own location. On arrival each unit is racked, connected to your chosen pool and wallet, and burned in under load. You receive per-machine monitoring so you can see hashrate, board temperatures, fan speeds and rejected shares, and technicians handle reboots, fan swaps and hashboard removal without you flying anywhere.",
          "Typical lead time from deposit to hashing is two to four weeks, most of which is freight and customs rather than installation.",
        ],
      },
      {
        heading: "Choosing a hosting contract",
        paras: [
          "Compare four things: the all-in power rate, the contract length and exit terms, the uptime commitment and how downtime is credited, and what happens to your machines if the facility curtails during peak grid demand. Ask whether repairs are billed separately, whether spare hashboards are stocked on site, and how payouts and invoices are reconciled each month.",
          "We place hardware in vetted North American and Middle Eastern facilities and will tell you plainly when self-hosting at your own site is the better financial decision.",
        ],
      },
    ],
  },

  repair: {
    title: "Inside Our ASIC Repair Lab",
    blocks: [
      {
        heading: "Diagnosis before quotation",
        paras: [
          "Every unit that arrives is logged, photographed and bench-tested before any work is quoted. We read the kernel log, check each voltage domain, test the PSU under load and thermally image the hashboards to find failed chips, cracked solder joints and dead voltage regulators. You get a written diagnosis with a fixed price, and you decide whether the repair is worth it against the machine's current market value.",
          "Common faults are far cheaper to fix than to replace: a single failed ASIC, a burnt power connector, a corrupted control board or a seized fan typically costs a fraction of a replacement machine.",
        ],
      },
      {
        heading: "What we repair",
        paras: [
          "Our technicians work at chip level on Antminer, WhatsMiner, Avalon and Innosilicon hardware: hashboard rework and chip replacement, control board firmware recovery and EEPROM reflash, PSU capacitor and MOSFET replacement, ultrasonic cleaning of coolant-fouled boards, thermal paste and pad renewal, and fan and airflow restoration. Hydro units are pressure-tested after any coolant-side work.",
          "Repaired machines are returned only after a sustained full-load run confirms the rated hashrate and a stable error rate, and each repair carries a workmanship warranty on the parts we touched.",
        ],
      },
      {
        heading: "Sending hardware in",
        paras: [
          "Tell us the model, the fault symptoms, the number of affected units and your location, and we will confirm the correct intake address and packing requirements. Ship boards separately where possible, use the original foam or equivalent, and include your reference inside the box. Batch repairs for farms are scheduled so that machines return in staged groups, keeping most of your fleet hashing while the rest is serviced.",
          "If a unit is beyond economical repair we say so, quote a salvage value for the usable parts, and credit it against replacement hardware.",
        ],
      },
    ],
  },

  wholesale: {
    title: "Wholesale And Bulk Miner Procurement",
    blocks: [
      {
        heading: "Volume pricing and allocation",
        paras: [
          "Wholesale pricing starts around ten units and improves with quantity, prepayment and flexibility on delivery windows. Because we hold stock in Hong Kong and buy through authorised distribution, we can allocate mixed batches — new flagship units alongside graded used hardware — so your average cost per terahash lands where your model needs it.",
          "For large orders we can stage shipments across weeks or months, hold allocation against a deposit, and lock pricing for a defined window so your build schedule is not exposed to spot-market swings.",
        ],
      },
      {
        heading: "Logistics for farm-scale orders",
        paras: [
          "We handle pallet consolidation, commercial invoicing, HS classification and insurance from our Hong Kong warehouse to your site, by air for speed or by sea container for cost. Deliveries to the United States, Canada, Europe, the Middle East, Australia and Latin America are routine, and we work with your customs broker or importer of record so machines are not held at the border.",
          "Pre-shipment services are available on request: firmware flashing, custom pool and wallet pre-configuration, hashrate certificates per serial number, and labelled pallets that match your rack plan.",
        ],
      },
      {
        heading: "Support after the pallets land",
        paras: [
          "Bulk buyers get a named contact, spare-parts pricing agreed up front, and access to our repair lab for warranty and non-warranty work. We can hold buffer stock of hashboards, PSUs and fans for your fleet so a failure means a same-week swap rather than a month of downtime.",
          "Send us your target models, quantity, budget and destination and we will return a costed proposal including freight, duties guidance and realistic delivery dates.",
        ],
      },
    ],
  },

  cart: {
    title: "How Ordering And Payment Work",
    blocks: [
      {
        heading: "From cart to confirmed order",
        paras: [
          "Adding hardware to your cart reserves nothing until checkout, so quantities and models can be changed freely. At checkout you choose a payment method, complete the payment, then submit your transaction reference together with full delivery details. Our team verifies the payment, re-confirms live stock and freight cost, and emails a formal confirmation before anything ships.",
          "If a unit sells out between your order and our confirmation, we offer the closest equivalent machine or a full refund — we never substitute hardware without your written approval.",
        ],
      },
      {
        heading: "Payment methods",
        paras: [
          "We accept major cryptocurrencies, CashApp, Chime and bank transfer. Crypto payments are made to the address and QR code published on our checkout page; after sending funds you paste the transaction ID so the payment can be matched on-chain. CashApp, Chime and bank payments are reviewed manually by our finance desk, which usually completes within one business day.",
          "For security, wallet addresses and bank details are only ever shown on this website. Treat any payment instruction that arrives by email, chat or social media as fraudulent and contact us directly to verify.",
        ],
      },
      {
        heading: "Shipping and delivery expectations",
        paras: [
          "In-stock hardware normally leaves our Hong Kong warehouse within one to three business days of payment confirmation. Express air freight reaches most of North America and Europe in three to seven business days, and other regions in five to twelve. Heavy or multi-pallet orders may move by sea freight, which is slower but materially cheaper per unit.",
          "Import duties and taxes are set by your own customs authority and are payable by the buyer. We supply commercial invoices, HS codes and packing lists with every shipment so clearance is routine, and we will tell you before you pay if a destination has known restrictions on mining hardware.",
        ],
      },

    ],
  },

  checkout: {
    title: "Checkout, Verification And Delivery In Detail",
    blocks: [
      {
        heading: "Step by step",
        paras: [
          "Checkout runs in four steps. First, select your payment method and review the order total. Second, pay: for crypto, scan or copy the address shown on screen and send the exact amount from your wallet or exchange. Third, paste the transaction ID or payment reference so we can verify it. Fourth, complete the delivery form — full name, company if applicable, phone, email, street address, city, state or province, postal code and country, plus any customs or broker details.",
          "Once submitted, your order goes to our sales desk for verification. You will receive confirmation with freight cost, expected dispatch date and tracking as soon as the payment clears.",
        ],
      },
      {
        heading: "Why we verify manually",
        paras: [
          "Mining hardware is high value and freight-sensitive, so a human checks every order: that the paid amount matches the invoice, that the shipping address can accept a pallet or heavy parcel, that the destination country's import rules are satisfied, and that the units you bought are physically on the shelf. This is slower than an automatic card charge and it prevents the two failures that actually cost buyers money — wrong hardware and stuck shipments.",
          "Crypto transactions are matched on-chain against the transaction ID you supply, so keep that reference until delivery is complete.",
        ],
      },
      {
        heading: "Delivery, duties and warranty",
        paras: [
          "In-stock units normally dispatch within one to three business days of payment confirmation. Express air freight from Hong Kong typically takes three to seven business days to North America and Europe, and five to twelve business days to other regions. Duties and import taxes are payable to your own customs authority; we provide full commercial documentation to keep clearance straightforward.",
          "All hardware ships with our written warranty terms. Report transit damage with photographs within 48 hours of delivery so we can open a carrier claim on your behalf.",
        ],
      },
    ],
  },

  reviews: {
    title: "How We Collect And Publish Reviews",
    blocks: [
      {
        heading: "Verified purchases only",
        paras: [
          "Every review published here is tied to a completed order — hardware, hosting or a repair job. We ask for feedback after delivery and after the machine has run for a few weeks, because the useful question is not whether the box arrived but whether the hardware held its rated hashrate on site. Reviews are published as written, including the critical ones, with only obvious personal data removed.",
          "We do not buy reviews, incentivise ratings or delete negative feedback. Where a review describes a problem, our reply and the resolution matter more than the star count.",
        ],
      },
      {
        heading: "What buyers consistently comment on",
        paras: [
          "The recurring themes are hashrate accuracy on arrival, packing quality for long-haul freight, how quickly customs paperwork was supplied, and how the team responded when something needed fixing. Those four things are what separate a hardware vendor you can reorder from one you cannot, and they are the areas we measure internally.",
          "Repair and hosting customers tend to comment on turnaround time and on the clarity of diagnosis before work was authorised.",
        ],
      },
      {
        heading: "Judging any miner vendor",
        paras: [
          "Before sending money to any supplier, ask for the measured hashrate of the specific units you are buying, written warranty terms, the physical business address, and a payment route you can trace. Ask what happens if a hashboard fails in month two and who pays the return freight. Vendors who answer those questions in writing are the ones worth buying from.",
          "Our address, phone number and email are published on every page for exactly that reason, and our repair lab means a fault is a service ticket rather than a lost machine.",
        ],
      },
    ],
  },

  used: {
    title: "Buying Used And Refurbished ASIC Miners Safely",
    blocks: [
      {
        heading: "Why used hardware still wins",
        paras: [
          "Used S19-class and equivalent machines sell for a fraction of new-unit pricing, which means the capital you risk per terahash is far lower and payback can be measured in months rather than years. When your electricity is cheap, the older, less efficient machine that cost a tenth as much is frequently the better return, because the capital saved outweighs the extra joules per terahash burned.",
          "The trade-off is efficiency and remaining service life. That is why we publish measured hashrate, condition grade and firmware for each unit instead of a vague description.",
        ],
      },
      {
        heading: "Our refurbishing process",
        paras: [
          "Incoming machines are opened, cleaned ultrasonically where boards are fouled, re-pasted, fitted with new fans and connectors as needed, and then run under full load until hashrate and error rate are stable. Hashboards are checked chip by chip, PSUs are load-tested, and control boards are reflashed with stock or tuned firmware. Anything that fails is repaired in our own lab or sold transparently as a repair candidate.",
          "Every listed unit records what was replaced, the verified hashrate, and the warranty that applies, so you are buying a documented machine rather than a gamble.",
        ],
      },
      {
        heading: "What to check before you buy anywhere",
        paras: [
          "Ask for the measured hashrate and error rate under load, not the factory rating. Ask how many hashboards have been repaired and whether the unit has been immersion-run, because coolant residue changes long-term reliability. Confirm the PSU model matches the board revision, confirm firmware and whether pool settings are locked, and confirm who pays return freight if the machine fails in the first month.",
          "Our used stock ships with a 30-day functional warranty on hashboards and power supplies, worldwide freight from Hong Kong, and access to the same repair lab that prepared the machine.",
        ],
      },
    ],
  },

  productsIndex: {
    title: "How To Choose The Right Bitcoin Miner",
    blocks: [
      {
        heading: "Start with your power cost, not the hashrate",
        paras: [
          "Efficiency, measured in joules per terahash, decides how much of your revenue the electricity bill consumes. At high tariffs only the most efficient hydro and air machines stay profitable; at low industrial rates, cheaper older units can return more on capital because you paid so little per terahash. Work out your rate first, then shortlist hardware that clears your break-even at that rate with a margin for difficulty growth.",
          "Filter this catalogue by brand, algorithm, condition and price, and compare the price per terahash alongside the efficiency figure rather than looking at hashrate alone.",
        ],
      },
      {
        heading: "Air, hydro or immersion",
        paras: [
          "Air-cooled machines are simplest: 200–240V power, plenty of airflow, and no coolant infrastructure — but they are loud and heat-limited. Hydro units move heat into a water loop, run quieter and push far higher hashrate per rack, and need a dry cooler and plumbing sized to the load. Immersion is the quietest and gentlest on components but requires tanks, dielectric fluid and a heat rejection loop.",
          "Choose the cooling type your site can actually support today. A hydro machine without a cooling loop is an expensive paperweight, and hosting exists precisely for buyers whose sites cannot take the load.",
        ],
      },
      {
        heading: "Buying with confidence",
        paras: [
          "Everything listed is bench-tested and hashrate-verified before dispatch, graded honestly as new, used or refurbished, and covered by written warranty terms. We ship worldwide from our Hong Kong warehouse to the United States, Canada, Europe, the Middle East, Australia, Latin America and Africa, with full customs documentation.",
          "If you are unsure which machine suits your electricity rate and available amperage, send us those numbers and we will model the options before you spend anything.",
        ],
      },
    ],
  },

  marketplaceIndex: {
    title: "About The Location Marketplace",
    blocks: [
      {
        heading: "Local buying guides, global stock",
        paras: [
          "This directory covers more than a thousand cities and regions with buying guidance for ASIC miners, the Antminer Z15 Pro, the Bitmain Antminer S23 line and related hardware. Each page explains what local buyers should check — voltage and phase conventions, typical electricity tariffs, import duties, and freight timelines — then links directly to the machines we hold in stock.",
          "Stock itself is central: everything ships from our bonded Hong Kong warehouse, so a buyer in Alkmaar and a buyer in Alberta see the same tested inventory and the same warranty terms, with freight quoted door to door.",
        ],
      },
      {
        heading: "How to use these pages",
        paras: [
          "Search by city, filter by country or hardware family, then open the page closest to your site. Use it to sanity-check the local power and import realities, then request a quote with your electricity rate and available amperage so we can confirm which machines pay back in your market.",
          "If your city is not listed, the guidance for the nearest listed location almost always applies — or simply contact the sales desk and we will price your delivery directly.",
        ],
      },
    ],
  },

  compare: {
    title: "S21 XP Hyd vs S19 XP+ Hydro: How To Read This Comparison",
    blocks: [
      {
        heading: "Efficiency versus raw hashrate",
        paras: [
          "The S19 XP+ Hydro produces more terahash per box, but the S21 XP Hyd converts electricity into hashrate far more efficiently. Which one wins depends entirely on your power price: at low industrial rates the cheaper terahash of the older machine can return more on capital, while at higher tariffs the newer machine's joules-per-terahash advantage compounds every single day of operation.",
          "Use the profitability inputs on this page with your real electricity rate and current hashprice rather than defaults. Small changes in either input move the ranking, which is why we publish the calculation instead of a verdict.",
        ],
      },
      {
        heading: "Site requirements you must plan for",
        paras: [
          "Both machines are hydro units, so neither runs on air alone. You need a closed coolant loop with a dry cooler or heat exchanger sized to the full kilowatt load, correct flow rate and pressure, filtration, and leak detection. Electrically, plan three-phase distribution with headroom rather than running at the breaker limit, and confirm the PSU revision matches the hashboards before ordering.",
          "The upside is density and noise: hydro machines put several times the hashrate into the same floor space as air-cooled units and run quietly enough for sites where noise complaints would otherwise end the project.",
        ],
      },
      {
        heading: "Buying either machine from us",
        paras: [
          "Both models are bench-tested and hashrate-verified before dispatch, ship worldwide from our Hong Kong warehouse with full customs documentation, and carry written warranty terms. Our repair lab services hydro hashboards and pressure-tests any unit after coolant-side work, so a fault later on is a service ticket rather than a write-off.",
          "Tell us your electricity rate, available amperage and cooling capability and we will confirm which of the two actually pays back on your site before you commit capital.",
        ],
      },
    ],
  },
};
