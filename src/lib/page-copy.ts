import type { CopyBlock } from "@/components/site/SeoCopy";

/**
 * Long-form editorial copy for pages whose interface is form- or grid-heavy.
 * Keeps every page substantive for readers and lifts the text-to-HTML ratio
 * that SEO crawlers measure.
 */
export const PAGE_COPY: Record<string, { title: string; blocks: CopyBlock[] }> = {
  usedAsic: {
    title: "How To Value A Used ASIC Miner Before You Pay",
    blocks: [
      {
        heading: "Start from your electricity rate, not the price tag",
        paras: [
          "The single number that decides which used ASIC miner belongs on your site is your delivered electricity cost per kilowatt hour, including demand charges, transmission and any hosting margin. Multiply the machine's wall power in kilowatts by 24, then by 30, then by that rate, and you have the monthly energy bill for one unit. Compare that figure against the revenue the machine's terahash currently earns and you immediately see whether the model is a producer or a space heater at your tariff.",
          "As a working rule, sites paying under six cents can still run 30 to 38 joules per terahash hardware profitably, sites between six and nine cents want the low twenties, and anything above ten cents needs current-generation efficiency or hosted placement to make sense. We publish measured wall power alongside hashrate on every listing precisely so you can run that arithmetic before you commit capital.",
        ],
      },
      {
        heading: "What a fair used price looks like",
        paras: [
          "Used ASIC pricing is quoted in dollars per terahash, which makes machines of different generations directly comparable. Take the asking price, divide by the verified hashrate, and compare that figure across the listings on this page. A well-priced second-hand unit should land materially below the dollar-per-terahash of a new machine of the same efficiency class, and the discount should widen as the unit's efficiency falls further behind the current fleet average.",
          "Cheap outliers are usually cheap for a reason: unrepaired hashboards, missing PSUs, water-block corrosion on hydro units, or firmware locked by a previous operator. When a price looks far below the market, ask what was replaced, whether the machine ran on immersion or air, and what hashrate it held for a sustained multi-hour test rather than a thirty-second boot reading.",
        ],
      },
      {
        heading: "The checks we run so you do not have to",
        paras: [
          "Each unit is bench-run under full load until hashrate, chip temperatures and hardware error rate stabilise. Hashboards are read chip by chip, power supplies are load-tested, fans and connectors are replaced when they show wear, and control boards are reflashed to stock or to a tuned firmware you specify. Units that cannot hold rated output are repaired in our own lab or sold openly as repair candidates instead of being mixed into graded stock.",
          "The result is the data you see on each listing: verified hashrate, wall power, condition grade, firmware, and what was replaced. That record is what turns a used purchase from a gamble into a calculated deployment, and it is why buyers reorder rather than test the market again on every batch.",
        ],
      },
      {
        heading: "Deployment, freight and support",
        paras: [
          "Every order leaves our Hong Kong warehouse by direct air freight with DHL Express, FedEx International Priority, UPS Worldwide Express or Kerry Logistics, arriving with a tracking number, commercial invoice and the customs paperwork your broker needs. Pallet and container quantities move on consolidated air or sea freight, and we will document HS codes and declared values to match your import process.",
          "Before you order, send us your tariff, available amperage, ambient temperature range and target hashrate. Our desk will come back with the specific units from this inventory that clear your payback threshold, the power distribution they need, and whether hosting is the cheaper route for your first deployment.",
        ],
      },
      {
        heading: "Which second-hand models are worth shortlisting now",
        paras: [
          "The S19 family remains the workhorse of the used market. The base S19 and S19j Pro sit around 90 to 104 terahash at roughly 29 to 30 joules per terahash, which suits cheap-power sites and hosted racks where the hosting fee is the binding constraint. The S19j Pro+ and S19k Pro push efficiency into the mid twenties and command a premium that is usually justified once your tariff passes seven cents. Hydro variants such as the S19 XP Hyd belong in facilities that already have a water loop and a plan for glycol, filtration and leak detection.",
          "On the MicroBT side, WhatsMiner M30S++ and M50 units are attractive when the seller can document board revisions and PSU history, because those platforms tolerate warm environments well and their power supplies are straightforward to service. Avoid orphan models with no spare-part market, however cheap they look: a machine you cannot repair is a machine you will retire early.",
        ],
      },
      {
        heading: "Common mistakes buyers make with used hardware",
        paras: [
          "The first is buying on hashrate alone and discovering the site cannot deliver the amperage the fleet needs, which turns a bargain into stranded inventory. The second is ignoring ambient conditions: an air-cooled miner in a hot, humid, dusty room will lose chips within months no matter how well it tested on our bench. The third is underestimating landed cost, because freight, duties and local electrical work routinely add a meaningful percentage to the invoice.",
          "The fourth, and the most expensive, is treating a used fleet as a set-and-forget asset. Machines need monitoring, filter changes, periodic repaste and a spares pool. Operators who budget a small maintenance allowance per unit per year consistently outperform those who buy the cheapest available hardware and hope, and the difference shows up in uptime long before it shows up in the wallet balance.",
        ],
      },
    ],
  },

  usedRefurb: {
    title: "Refurbished Bitcoin Miners: What Refurbishing Actually Changes",
    blocks: [
      {
        heading: "Used, refurbished and repair candidate are not the same thing",
        paras: [
          "A used machine is a working miner sold in the condition it arrived in, cleaned and tested but not rebuilt. A refurbished machine has had its wear parts replaced and its performance restored to near factory output before it is listed. A repair candidate is a unit with a known fault, priced accordingly, sold to operators who keep spare boards and a hot-air station on site. Mixing those three categories is the most common way buyers overpay in this market, which is why every listing here states its grade explicitly.",
          "The filters on this page let you narrow by condition, brand, price ceiling and minimum hashrate, so you can compare like with like instead of guessing from a photograph and a model number.",
        ],
      },
      {
        heading: "Inside our refurbishing bench",
        paras: [
          "Refurbishing starts with a full teardown. Boards fouled by dust or condensation are cleaned ultrasonically, thermal pads and paste are replaced, heat sinks that have lifted are re-seated, and corroded connectors are cut back and re-terminated. Fans are replaced as a set rather than individually so airflow stays balanced, and power supplies are load-tested to rated output before they go back into a chassis.",
          "The unit then runs a sustained burn-in at rated frequency while we log hashrate, per-chip temperature and hardware error rate. Only machines that hold their numbers across that window are graded refurbished. Anything that drifts goes back to the bench or is relisted honestly as a repair candidate.",
        ],
      },
      {
        heading: "Firmware, tuning and efficiency",
        paras: [
          "Second-hand hardware often arrives with vendor firmware from a previous operator, sometimes locked to their pool or wallet. We reflash control boards to clean stock firmware by default, and on request we can deliver units running tuned firmware so you can underclock for joules per terahash or push frequency where power is genuinely cheap. Underclocking an older machine is frequently the difference between a marginal deployment and a comfortable one.",
          "Tell us the operating point you want — maximum efficiency, maximum hashrate, or a fixed power budget per unit — and we will set the machines up before they ship rather than leaving you to tune a rack by hand.",
        ],
      },
      {
        heading: "Warranty, spares and what happens if something fails",
        paras: [
          "Graded units ship with a 30-day functional warranty covering hashrate and power draw as listed. If a board fails inside that window we repair or replace it; outside it, our repair lab quotes board-level work at a fraction of replacement cost, which is usually the economic choice on older platforms where spares remain plentiful.",
          "For fleets above a few dozen machines we recommend buying a small spares pool alongside the order — a spare PSU and hashboard per ten units keeps uptime high without an emergency freight bill every time a chip goes. We will quote those spares with the hardware.",
        ],
      },
      {
        heading: "Getting a straight answer on payback",
        paras: [
          "Payback on used hardware is a function of four inputs: purchase price, wall power, your electricity rate, and how long you expect the machine to remain revenue-positive as difficulty rises. Send us the first three and we will model the fourth against the current network, then tell you plainly which units on this page clear your threshold and which do not.",
          "That conversation takes minutes and it is free. Message our desk on WhatsApp or email sales@bitcoinminingdepot.net with your tariff and target budget, and we will reply with a shortlist drawn from the stock listed above, including freight to your address.",
        ],
      },
    ],
  },

  cryptoForSale: {
    title: "Crypto Mining Hardware For Sale: How To Buy Well In 2026",
    blocks: [
      {
        heading: "What you are actually buying when you buy crypto mining hardware",
        paras: [
          "A crypto miner is a purpose-built computer that does one arithmetic job billions of times a second. Bitcoin machines run SHA-256, Litecoin and Dogecoin machines run Scrypt, Kaspa units run kHeavyHash and Monero rigs run RandomX on CPUs. Because the silicon is fixed to one algorithm, a unit's value comes from three numbers only: hashrate, wall power and the efficiency between them, expressed in joules per terahash. Everything else - brand loyalty, resale hype, marketing names - is noise once those three figures are on the table.",
          "Every unit listed for sale on this site is bench-tested under load in our Hong Kong warehouse before it is offered. We record measured hashrate rather than the sticker figure, note the PSU revision and firmware, and photograph the actual machine. That matters most on previous-generation and refurbished stock, where two units with identical model names can differ by ten percent in real output.",
        ],
      },
      {
        heading: "Pick the machine your electricity price can carry",
        paras: [
          "Your power tariff decides which half of the catalogue is relevant. Under about five cents per kilowatt-hour, older 30-38 J/TH workhorses remain profitable and give you the cheapest entry per terahash, which is why farm operators with cheap hydro or flared gas keep buying them. Between five and nine cents you want current-generation air-cooled hardware in the high-teens J/TH band. Above ten cents, only the newest hydro and immersion flagships stay comfortably cash-positive, and hosting is usually the better answer than buying retail power.",
          "Run the arithmetic before you order: daily revenue is your hashrate share of network issuance, daily cost is kilowatts multiplied by twenty-four multiplied by your tariff. If the gap is thin at today's difficulty, it will close in the next adjustment. We publish specs per model and our team will sanity-check your numbers against the site's own operating data before you commit capital.",
        ],
      },
      {
        heading: "Cooling, hosting and the infrastructure most buyers underestimate",
        paras: [
          "Air-cooled ASICs push roughly three thousand watts of heat and eighty decibels of fan noise into whatever room they occupy, which rules out most homes and offices. Hydro and immersion machines are quieter and denser but require pumps, dry coolers or dielectric tanks and a plan for heat rejection. Before you buy, know your available amperage, breaker layout, ambient temperature range and airflow path - retrofitting these after a pallet arrives is where budgets break.",
          "If you have no suitable site, hosting is the practical path: we rack, power, cool and monitor the machine in an industrial facility and you keep the pool payouts. If you already run a fleet, our repair lab handles hashboard, controller, PSU and fan faults, so hardware you buy here stays serviceable rather than becoming scrap after one failure.",
        ],
      },
      {
        heading: "Ordering, crypto payment and worldwide delivery",
        paras: [
          "Checkout is cryptocurrency-based and deliberately transparent. You choose the coin and network, we display the receiving address with a QR code, you send the payment, paste the transaction ID and complete full delivery details. Our team confirms the transaction on-chain, then releases the unit for dispatch and sends tracking. For pallet and container volumes, the wholesale desk quotes freight and prepares HS codes and commercial invoices in advance.",
          "We ship from Hong Kong to the United States, Canada, Europe and the United Kingdom, Latin America, the Middle East, Asia, Australia and Africa. Express courier suits one to four machines; air or sea freight suits larger orders. Every unit carries a thirty-day functional warranty covering hashboard and power-supply failure, and support continues after delivery through the same team that tested the machine.",
        ],
      },
    ],
  },
  home: {
    title: "Enterprise Bitcoin Mining Hardware, Hosting And Repair",
    blocks: [
      {
        heading: "Buying mining hardware from a vendor that runs machines",
        paras: [
          "Bitcoin Mining Depot sells the hardware we commission, service and repair. Every ASIC leaves our Hong Kong warehouse bench-tested and hashrate-verified, with the PSU revision, firmware and condition confirmed in writing before you pay. We ship worldwide - the United States, Canada, Europe and the UK, Asia, the Middle East, Australia, Latin America and Africa - with commercial invoices and HS codes prepared so customs clearance is routine rather than a two-week problem.",
          "Our catalogue spans current-generation air and hydro flagships, previous-generation workhorses, and thoroughly refurbished used units for buyers optimising capital cost over efficiency. Alongside hardware we operate hosting for miners without suitable power or cooling, and a repair lab for hashboard, controller, PSU and fan faults.",
        ],
      },
      {
        heading: "Match the machine to your power price, not to the spec sheet",
        paras: [
          "Profitability is decided by three numbers: your electricity rate, the machine's joules per terahash, and current hashprice. At low industrial tariffs, cheaper terahash from older hardware often returns more on invested capital. As power costs rise, efficiency dominates and newer machines win by a widening margin every day they run.",
          "Send us your tariff, available amperage and cooling capability and we will model the options with your figures. If the honest answer is that self-hosting does not pay at your power price, we will say so and quote hosting instead.",
        ],
      },
      {
        heading: "Deployment, cooling and electrical planning",
        paras: [
          "Air-cooled fleets need real airflow design - separated hot and cold aisles, filtered intake and exhaust capacity sized to the full kilowatt load. Hydro machines need a closed coolant loop, correct flow and pressure, filtration and leak detection, with a dry cooler matched to the heat rejected. Immersion needs dielectric fluid, tank sealing and pump redundancy. Electrically, plan three-phase distribution with headroom rather than running at the breaker limit.",
          "Our guide library and knowledge center document these builds step by step, from single-unit home installs through container deployments, so you can plan before hardware arrives instead of improvising after it does.",
        ],
      },
      {
        heading: "Payment, warranty and support",
        paras: [
          "We accept major cryptocurrencies with published QR addresses and transaction-ID confirmation, plus CashApp, Chime and bank transfer. Warranty terms are written in plain language, and claims are handled against those terms with spares kept for the models we sell in volume.",
          "After delivery we help with pool setup, firmware and tuning, undervolting for efficiency, and fault diagnosis. Talk to the sales desk on WhatsApp, email or the contact form and you will reach someone who has commissioned the machine you are asking about.",
        ],
      },
    ],
  },

  privacy: {
    title: "How We Handle Your Information",
    blocks: [
      {
        heading: "Data we collect and why",
        paras: [
          "We collect only what an order or an enquiry requires: your name, email, phone number, delivery address, the hardware you asked about, and - where you pay in cryptocurrency - the transaction identifier you submit so we can match payment to order. Quote requests and inquiry forms are delivered to our sales inbox and used to answer you, price freight and prepare customs paperwork.",
          "We do not sell personal data, we do not build advertising profiles from it, and we do not share it beyond the parties needed to fulfil your order: payment confirmation, freight carriers and customs authorities.",
        ],
      },
      {
        heading: "Retention, security and your choices",
        paras: [
          "Order records are retained as long as commercial and tax obligations require, and enquiry records only as long as the conversation is useful. Access is limited to staff who need it. Traffic to the site is served over HTTPS, and administrative access to inventory and order data is authenticated.",
          "You may ask us what we hold about you, request corrections, or ask for deletion of records we are not legally required to keep. Email the address on our contact page and we will respond in writing.",
        ],
      },
    ],
  },

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
      {
        heading: "Why our answers name numbers instead of slogans",
        paras: [
          "Mining is an engineering purchase, so every answer above commits to a figure: joules per terahash, amperage per unit, delivery windows by region, warranty length in months. Vague reassurance is what gets buyers into trouble - a machine that arrives without the right PSU revision, a farm wired to 80 percent of the load it actually needs, or a hydro deployment ordered before the dry cooler was sized.",
          "If a question you have is not answered here, it is usually because the honest answer depends on your site: your tariff, your ambient temperature, your available breaker capacity and your import regime. Send those four numbers to the sales desk and we will answer specifically rather than generically.",
        ],
      },
      {
        heading: "How we handle pre-sales engineering questions",
        paras: [
          "Every quote request is reviewed by someone who has commissioned machines, not only sold them. We check that the electrical plan matches the fleet, that the cooling method suits the ambient conditions, and that the payback assumption uses a realistic hashprice rather than a peak-market figure. Where the numbers do not work we say so and propose either a different model, a used unit at lower capital cost, or hosting instead of self-hosting.",
          "That review is free and carries no obligation. It exists because returned or bricked hardware costs us more than a lost sale, so we would rather spend an hour on your load calculation than process a dispute later.",
        ],
      },
      {
        heading: "Support after the invoice is paid",
        paras: [
          "Buyers receive tracking, customs paperwork and firmware guidance in writing. Once machines are on site we help with pool configuration, tuning profiles, undervolting for efficiency, and diagnosis of hashboard or fan faults over chat or email. If a unit needs bench work, our repair lab quotes the job before touching it and pressure-tests hydro units after any coolant-side service.",
          "Warranty claims are handled against written terms, not discretion. You will always know what is covered, for how long, and what the process is before you buy.",
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
      {
        heading: "What we ask reviewers to cover",
        paras: [
          "Feedback is most useful when it names the machine, the destination country, the delivery window and how the hardware behaved after commissioning. That is why the reviews above read like deployment notes rather than star ratings: buyers care whether the hashrate matched the listing, whether the PSU revision was correct, how long customs took and what happened when something failed.",
          "We publish critical reviews alongside positive ones. A vendor with only perfect feedback across hundreds of international freight shipments is not being straight with you - freight gets delayed, units occasionally arrive with a faulty fan, and how that is resolved is the real measure.",
        ],
      },
      {
        heading: "How to verify a hardware vendor before wiring funds",
        paras: [
          "Ask for bench-test evidence of the exact unit, a written warranty term, a serial or batch reference, and clarity on which PSU and firmware ship with the machine. Confirm the shipping route, who is the importer of record, and how duties and VAT are handled in your country. Ask what happens if the hashrate lands below spec at your ambient temperature.",
          "Any vendor should answer those in writing before payment. We do, and our reviews reflect buyers who tested those answers against reality in North America, Europe, the Middle East, Asia, Africa, Latin America and Oceania.",
        ],
      },
      {
        heading: "What buyers most often mention",
        paras: [
          "Three themes recur across the feedback above. First, hashrate honesty: units are listed at tested output rather than datasheet best case, so machines land at or near the number on the page. Second, freight predictability: buyers in North America and Europe consistently report express air delivery inside the quoted window with paperwork that cleared customs without a broker chasing us for missing HS codes. Third, responsiveness after the sale, which is the part most vendors quietly skip.",
          "Where reviews are critical, it is usually about freight timing during peak season or a fan or PSU that failed early. Those are the realities of shipping heavy electronics internationally; what matters is that replacements and repairs were handled against written terms rather than argued about.",
        ],
      },
      {
        heading: "How reviews connect to our repair and hosting work",
        paras: [
          "A meaningful share of our reviewers are repeat customers who first came to us for a repair or for hosting and later bought hardware, or the reverse. That matters when judging feedback: these are buyers who have seen the whole operation - bench testing, coolant work, hashboard-level diagnosis, colocation uptime - not only the checkout page.",
          "If you would like to speak with a customer running the machine you are considering in a climate similar to yours, ask the sales desk. Where a buyer has agreed to be a reference, we will connect you.",
        ],
      },
      {
        heading: "Leaving your own review",
        paras: [
          "After delivery and commissioning we invite buyers to review the specific unit they received. We ask for the model, destination, delivery time and measured hashrate at their ambient temperature, because that is the information the next buyer needs. Reviews are published as written; we do not edit criticism out or pay for feedback.",
          "If something went wrong with your order, contact support before reviewing - not because we want the rating managed, but because most complaints have a fix, and a repaired outcome is more useful to future readers than an unresolved one.",
        ],
      },
      {
        heading: "Independent checks you can run yourself",
        paras: [
          "Reviews are one input, not the whole picture. Before ordering from any vendor, ask for photographs or a short video of the exact unit powered on with the miner's own status page visible, showing hashrate per hashboard, chip temperatures and fan speeds. Ask for the firmware version and whether it is stock or third-party, since some tuned firmware voids manufacturer coverage. Request the PSU model and revision, because a mismatched supply is the most common cause of a machine that hashes for an hour and then throttles.",
          "Then verify the commercial side: a written warranty term with a stated duration and scope, a clear returns and DOA process, and a named freight route with realistic transit times to your country. Ask who is importer of record and what duty rate applies. A vendor that answers all of that in writing before payment is a vendor whose reviews you can trust; one that deflects is telling you something important.",
        ],
      },
      {
        heading: "Why we publish deployment context with every review",
        paras: [
          "A five-star review from a buyer with three-cent power in a cold climate tells you little about how the same machine behaves in a humid coastal city at thirty-five degrees ambient. That is why the feedback above names locations and machines: it lets you weight the review against your own conditions instead of averaging strangers' experiences into a single number.",
          "If you want the closest analogue to your site, filter mentally by climate and tariff rather than by rating, then ask us for the tuning profile that buyer settled on. We keep notes on what worked, and sharing them costs us nothing and saves you a month of experimenting.",
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
      {
        heading: "What refurbishment actually means here",
        paras: [
          "A used miner in our inventory has been opened, cleaned, thermal-paste refreshed where required, tested on all hashboards, and run under load long enough to confirm stable hashrate and temperatures. Fans and PSUs are replaced rather than nursed. Chips that underperform are logged and the machine is priced accordingly instead of being sold as if new.",
          "That process is why used hardware can be the strongest return on capital in mining: you buy proven silicon at a fraction of new-unit pricing, and at moderate electricity rates a well-maintained previous-generation machine often pays back faster than a flagship.",
        ],
      },
      {
        heading: "Choosing used over new at your power price",
        paras: [
          "The rule of thumb is simple. Cheap power favours older, less efficient machines because capital cost dominates the return. Expensive power favours new, efficient machines because electricity dominates. Somewhere between roughly six and nine cents per kilowatt-hour the ranking flips, and where exactly depends on hashprice, uptime and your cooling overhead.",
          "Send us your tariff and we will model both options with your numbers before you commit. If new hardware wins for your site we will tell you, even though the used unit is in stock today.",
        ],
      },
      {
        heading: "Warranty, spares and repair backing",
        paras: [
          "Used units ship with written warranty terms and access to our repair lab for hashboard, controller, PSU and fan work. We keep spares for the models we sell in volume, which matters more than the headline warranty length - a covered fault is only useful if the parts exist to fix it.",
          "Every used listing states its condition honestly, and we ship worldwide from Hong Kong with full customs documentation so the machine clears without surprises.",
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
      {
        heading: "How to shortlist from this catalogue",
        paras: [
          "Start with your electricity rate, then your available amperage, then your cooling method - in that order. The tariff sets the efficiency band you can afford to run, the amperage caps the fleet size per circuit, and the cooling method decides whether air, hydro or immersion models are even viable on your site. Only after those three constraints does brand preference matter.",
          "Use the filters to narrow by category and search by model, then compare joules per terahash rather than headline terahash. A machine with lower total hashrate and better efficiency usually wins on any tariff above a few cents.",
        ],
      },
      {
        heading: "What ships with every order",
        paras: [
          "Listings state hashrate, power draw, efficiency and condition as tested, not as printed on the manufacturer datasheet. Units are bench-tested and hashrate-verified before dispatch, packed for international air freight, and accompanied by commercial invoices and HS codes so customs clearance is routine.",
          "Payment options include major cryptocurrencies, CashApp, Chime and bank transfer, and every order is confirmed in writing with the exact model, quantity, PSU revision and delivery window before funds move.",
        ],
      },
      {
        heading: "Efficiency bands and what each one is for",
        paras: [
          "Hardware in this catalogue falls into three broad efficiency bands. Below roughly 15 joules per terahash you are buying current-generation silicon: highest capital cost per unit, lowest electricity cost per terahash, and the only sensible choice on tariffs above about nine cents per kilowatt-hour. Between 15 and 25 joules per terahash sit the previous-generation workhorses - the machines most commercial farms actually run, because the capital saving usually beats the efficiency loss on industrial power contracts. Above 25 joules per terahash you are in legacy territory, viable only with very cheap or curtailed power, flared gas, or heat-reuse projects where the warmth has value of its own.",
          "Read the joules-per-terahash figure on every listing before the headline hashrate. Two machines quoting similar terahash can differ by 40 percent in electricity cost, and over a three-year hold that difference dwarfs the purchase price gap between them.",
        ],
      },
      {
        heading: "Air, hydro and immersion: choosing a cooling class",
        paras: [
          "Air-cooled units are the simplest to deploy and the easiest to resell, and they suit sites with generous airflow, moderate ambient temperatures and tolerance for noise. Hydro units move heat into a closed water loop, which lets you pack far more hashrate per square metre, run quietly, and push higher clocks - but they require a dry cooler or heat exchanger sized to the full load, correct flow rate, filtration and leak detection before the first unit is energised. Immersion places boards in dielectric fluid, giving excellent thermal stability and dust immunity at the cost of tank engineering, fluid handling and messier servicing.",
          "Do not buy across cooling classes casually. A hydro flagship delivered to a site with no coolant loop is an expensive paperweight, and immersion conversions void some manufacturer warranties. If you are unsure which class your building supports, describe the site to us and we will tell you plainly what it can run today and what it could run after modest upgrades.",
        ],
      },
      {
        heading: "Electrical planning before the order, not after",
        paras: [
          "Each modern ASIC draws between roughly 3 and 11 kilowatts depending on model and tuning. Size circuits to continuous load with headroom rather than to nameplate at the breaker limit, confirm voltage compatibility - many high-power units expect 220 to 277 volts and will not run on standard North American residential 120 volt circuits - and plan for the PDU, cabling and breaker types the fleet actually needs.",
          "Tell us your available amperage and voltage and we will state exactly how many of a given model that service supports, including the derating we recommend for continuous duty. This single check prevents the most common and most expensive purchasing mistake in the industry.",
        ],
      },
      {
        heading: "Freight, duties and lead times by region",
        paras: [
          "Orders leave our Hong Kong warehouse by express air freight for most destinations, typically arriving in three to seven business days for the United States, Canada, the United Kingdom, the European Union, the Gulf and Australia, with sea freight available on container-scale orders where cost matters more than speed. Every shipment carries a commercial invoice with the correct HS classification, declared values that match the invoice, and the documentation your broker needs.",
          "Duties, VAT and import taxes are the buyer's responsibility as importer of record unless we agree otherwise in writing, and we will tell you the typical rate for your country before you order so the landed cost holds no surprises.",
        ],
      },
      {
        heading: "Ordering, payment and confirmation",
        paras: [
          "Add hardware to the cart or open the inquiry form on any listing to request a quote with your destination and quantity. We confirm availability, PSU revision, firmware, freight cost and delivery window in writing before any payment. Settlement is by major cryptocurrency against a published address with QR code and transaction-ID confirmation, or by CashApp, Chime or bank transfer for buyers who prefer fiat rails.",
          "Once payment is verified you receive an invoice, packing confirmation and tracking. Larger fleet orders can be staged across multiple shipments so your electrical build and your hardware arrive in step.",
        ],
      },
      {
        heading: "Firmware, tuning and long-term maintenance",
        paras: [
          "Efficiency is not fixed at purchase. Undervolting and frequency tuning can cut power draw meaningfully at a modest hashrate cost, which on expensive tariffs often improves net margin. Conversely, sites with very cheap power sometimes overclock for more revenue per box. We ship machines on stock firmware unless you ask otherwise, document the tuning profiles that have worked for each model, and will walk you through applying them after delivery.",
          "Maintenance is mostly discipline: filter cleaning, dust removal on a schedule, thermal paste refresh on older units, fan replacement before failure rather than after, and log monitoring so a degrading hashboard is caught while it is still a repair rather than a replacement. Our repair lab handles hashboard, controller, PSU and fan work for the models we sell, with spares held for high-volume lines.",
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
      {
        heading: "How the location guides are built",
        paras: [
          "Each marketplace page starts from local realities: typical industrial and residential electricity tariffs, grid stability, climate and cooling load, import duty treatment, and the availability of colocation nearby. Hardware recommendations follow from those constraints rather than from a generic bestseller list, so a page for a hot, high-tariff city recommends different machines than one for a cold, cheap-power region.",
          "Every guide links straight into live inventory so you can move from research to a quote in one step, with delivery and duty handling explained for that market.",
        ],
      },
      {
        heading: "Using a location guide before you buy",
        paras: [
          "Read the power section first and compare the quoted tariff with your own bill, because that single number decides which efficiency band is worth buying. Then check the climate and cooling notes against your building, and the import notes against how you intend to receive the shipment. Finally open the linked hardware and ask us to confirm pricing and freight to your address.",
          "If your city is not covered, the nearest listed location is usually close enough on power and import treatment to guide the decision, and our sales desk will confirm the specifics for your exact address.",
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
