/**
 * One-off generator: appends the educational pillar guides that close the
 * keyword gap against competitor sites (what is bitcoin mining, how to mine
 * bitcoin, bitcoin mining machine, btc miner, mining software, crypto mining,
 * desktop solo miners). Run with: bun scripts/add-pillar-posts.ts
 */
import { readFileSync, writeFileSync } from "node:fs";

interface Post {
  slug: string;
  title: string;
  metaTitle: string;
  category: string;
  categoryId: string;
  date: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: { h2: string; paras: string[] }[];
  faqs: { q: string; a: string }[];
  match: Record<string, unknown>;
  readMinutes: number;
}

const posts: Post[] = [
  {
    slug: "what-is-bitcoin-mining-how-it-works-costs-and-hardware",
    title: "What Is Bitcoin Mining? How It Works, Costs and Hardware",
    metaTitle: "What Is Bitcoin Mining? How It Works | BMD",
    category: "Setup & Operations",
    categoryId: "setup",
    date: "2026-09-06",
    description:
      "Bitcoin mining explained in plain terms: how proof of work secures the network, what miners actually earn, what hardware and power it takes, and what it costs.",
    keywords: ["what is bitcoin mining", "bitcoin mining", "how bitcoin mining works", "proof of work", "mining hardware"],
    intro: [
      "Bitcoin mining is the process that adds new transactions to the bitcoin blockchain and issues new coins in the same step. Specialised computers called ASIC miners race to find a number that, when hashed together with the pending block of transactions, produces a result below a network-set target. The first machine to find it broadcasts the block, and the network pays that miner the block subsidy plus the transaction fees inside it.",
      "That is the whole mechanism. Everything else — hashrate, difficulty, joules per terahash, pools, hosting — is engineering and economics built around it. This guide explains how the process works, what it costs to participate today, and which hardware is realistic depending on your electricity price and where the machine will physically live.",
    ],
    sections: [
      {
        h2: "Proof of Work in Plain Language",
        paras: [
          "A miner takes the block it wants to publish, adds a changing number called a nonce, and runs the pair through the SHA-256 hash function. The output is unpredictable, so the only way to find a hash below the target is to try quintillions of combinations per second. This deliberate waste of computation is what makes rewriting bitcoin history economically impossible: an attacker would have to out-spend the entire honest network in electricity and hardware.",
          "Because the answer is hard to find but instant to verify, every other node on the network can check a submitted block in milliseconds. That asymmetry — expensive to produce, cheap to validate — is the core of proof of work and the reason bitcoin needs no trusted referee.",
        ],
      },
      {
        h2: "Hashrate, Difficulty and Why Your Share Shrinks",
        paras: [
          "Hashrate measures how many hash attempts a machine makes per second, quoted in terahash (TH/s) for modern units. Your expected earnings are simply your hashrate divided by the total network hashrate, multiplied by the coins issued in that period. Nothing else in the formula is under your control.",
          "Roughly every two weeks the network retargets difficulty so blocks keep arriving about every ten minutes. When more hashrate joins, difficulty rises and every existing machine earns slightly less bitcoin per day. Any profitability model that assumes today's difficulty forever is wrong; assume a steady climb and buy hardware efficient enough to survive it.",
        ],
      },
      {
        h2: "What Miners Actually Earn",
        paras: [
          "Each block pays a fixed subsidy that halves roughly every four years, plus the fees users attached to their transactions. Fee income spikes during congestion and can briefly rival the subsidy, but it is volatile and should never anchor a purchase decision. Model revenue on the subsidy and treat fees as upside.",
          "Almost nobody mines alone. Solo mining a full-size ASIC means going years between wins on average, so miners join pools that combine hashrate and pay out proportionally, minus a one to three percent fee. Payouts are smooth and predictable; the trade-off is that you never hit a whole block yourself.",
        ],
      },
      {
        h2: "The Real Cost Structure: Power Dominates",
        paras: [
          "A modern full-size miner draws between three and five and a half kilowatts continuously — 72 to 132 kilowatt-hours a day. At twelve cents per kilowatt-hour that is roughly nine to sixteen dollars of electricity every day, per machine, forever. Over a three-year life the power bill routinely exceeds the purchase price several times over.",
          "This is why efficiency in joules per terahash matters more than headline hashrate. A machine at 15 J/TH produces the same work for roughly half the electricity of a 30 J/TH unit. Above about ten cents per kilowatt-hour, only current-generation hardware makes sense; below six cents, cheap previous-generation machines often pay back fastest.",
        ],
      },
      {
        h2: "Hardware: What Is Realistic for You",
        paras: [
          "Full-size air-cooled ASICs such as the Antminer S19 and S21 families or MicroBT's WhatsMiner M50 and M60 series are the workhorses of the industry. They need a dedicated 240 volt circuit, real airflow and somewhere that tolerates 72 to 80 decibels of fan noise — in practice a garage, outbuilding, warehouse or hosted facility.",
          "If the machine must live near people, hydro-cooled units and low-power home miners in the one to two kilowatt band are the sensible options. If you have no suitable site at all, hosting places your hardware in an industrial facility at a fixed per-kilowatt-hour rate, which is usually cheaper than residential power anyway.",
        ],
      },
      {
        h2: "Getting Started Without Wasting Capital",
        paras: [
          "Work in this order: confirm your delivered electricity rate, confirm the electrical capacity and location available, then pick hardware that fits both. Buying a miner before checking your circuit and your noise tolerance is the most common and most expensive beginner mistake we see.",
          "Start with one machine, learn the firmware, pool configuration and thermal behaviour, then scale. Our team quotes delivered pricing per terahash and ships worldwide from Hong Kong, including to the USA, Canada and Europe, so you can compare real numbers rather than datasheet promises.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is bitcoin mining still profitable?",
        a: "Yes, for operators with cheap power and efficient hardware. Profit is decided by your electricity rate, your machine's joules per terahash and the price you paid per terahash — not by bitcoin's price alone.",
      },
      {
        q: "Can I mine bitcoin on a normal computer?",
        a: "No. CPUs and GPUs are billions of times slower than ASICs at SHA-256 and would earn effectively nothing while burning electricity. Bitcoin mining requires purpose-built ASIC hardware.",
      },
      {
        q: "How long does it take to mine one bitcoin?",
        a: "There is no fixed answer. A 200 TH/s machine earns a small daily fraction of a coin, so accumulating a whole bitcoin can take years. Miners think in daily revenue and payback months, not whole coins.",
      },
      {
        q: "How much electricity does mining use?",
        a: "Typically 3 to 5.5 kW per full-size machine, running continuously. That is 90 to 165 kWh per day for a single unit, which is why power price decides profitability.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "how-to-mine-bitcoin-step-by-step-guide",
    title: "How to Mine Bitcoin: A Practical Step-by-Step Guide",
    metaTitle: "How to Mine Bitcoin: Step-by-Step | BMD Guide",
    category: "Setup & Operations",
    categoryId: "setup",
    date: "2026-09-06",
    description:
      "Every step to start mining bitcoin: checking your power and site, choosing hardware, wiring, pool and wallet setup, firmware tuning and monitoring uptime.",
    keywords: ["how to mine bitcoin", "how do i mine bitcoin", "start mining bitcoin", "asic setup", "mining pool setup"],
    intro: [
      "Mining bitcoin is a logistics exercise more than a technical one. The software side takes twenty minutes; the parts that decide whether you make money are your electricity rate, your electrical capacity, your cooling and your uptime. This guide walks the sequence we use when commissioning machines for customers.",
      "Follow it in order. Every step that looks boring — reading your power bill, checking your breaker panel, measuring your room temperature — exists because skipping it is what turns a working miner into an expensive paperweight.",
    ],
    sections: [
      {
        h2: "Step 1: Find Your Real Delivered Power Rate",
        paras: [
          "Take a recent electricity bill, divide the total amount owed by the kilowatt-hours consumed, and use that number. It includes delivery charges, taxes and tiered pricing, which the headline tariff usually hides. Miners who model on the advertised rate consistently overestimate profit by twenty to forty percent.",
          "If the resulting figure is above roughly twelve cents per kilowatt-hour, plan on current-generation efficient hardware or hosting instead of buying older machines. Below six cents, cheap previous-generation units become very attractive because the electricity penalty is tolerable.",
        ],
      },
      {
        h2: "Step 2: Confirm the Site and Circuit",
        paras: [
          "A full-size ASIC needs a dedicated 240 volt circuit — typically a 30 amp breaker per machine with a matching NEMA or IEC outlet — and continuous airflow to exhaust three to five kilowatts of heat. Intake air above 35 degrees Celsius will throttle the machine and shorten hardware life.",
          "Decide the location before you buy: garage, outbuilding, shed, warehouse or hosted facility. Living spaces are ruled out by noise unless you choose a hydro unit or a low-power home miner. If none of these fit, skip straight to hosting.",
        ],
      },
      {
        h2: "Step 3: Choose Hardware That Matches Both Numbers",
        paras: [
          "With your power rate and site constraints known, hardware selection becomes arithmetic. Compare candidates on joules per terahash and delivered dollars per terahash, then check the physical fit: PSU voltage, plug type, noise, and whether the unit is air, hydro or immersion cooled.",
          "Buy from a supplier that documents condition and tests units before shipping. Every machine we sell is bench-tested, condition-graded as new, used or refurbished, and quoted at a delivered price so there are no customs surprises.",
        ],
      },
      {
        h2: "Step 4: Wallet and Pool Before the Machine Arrives",
        paras: [
          "Set up a bitcoin wallet you control and copy its receiving address. Then create an account at a reputable pool, add that address as your payout destination, and note the pool's stratum URL and port for your region. Doing this while you wait for delivery means the miner can start earning the day it lands.",
          "Choose a pool on payout scheme and reliability rather than headline fee. PPS-style payouts give steady, predictable income; PPLNS pays more when luck runs well but varies week to week. Either is fine — inconsistent uptime costs you far more than the fee difference.",
        ],
      },
      {
        h2: "Step 5: Power Up, Find the IP, Configure",
        paras: [
          "Connect ethernet and power, then find the miner's IP address using your router's client list or the manufacturer's scanning tool. Log into the web interface, change the default password immediately, and enter your pool URL with your worker name and, where required, your wallet address as the username.",
          "Within a few minutes the dashboard should show all hashboards online and a hashrate close to the rated figure. Expect roughly 95 percent of the datasheet number in a warm room — that derating is normal, not a fault.",
        ],
      },
      {
        h2: "Step 6: Tune, Monitor and Protect Uptime",
        paras: [
          "Once stable, check chip temperatures and fan speeds under load. Underclocking or undervolting slightly often improves joules per terahash and materially extends hardware life; aggressive overclocking buys a few percent hashrate for disproportionate heat and failure risk. Only run custom firmware from sources you trust.",
          "Set up alerts for offline workers on your pool dashboard, keep the intake filters clean, and hold a spare power supply and fan set on the shelf. A machine at 98 percent uptime beats a faster machine that spends three weeks a year waiting on parts, and our repair centre turns around hashboard and PSU faults for customers worldwide.",
        ],
      },
    ],
    faqs: [
      {
        q: "What do I need to start mining bitcoin?",
        a: "An ASIC miner, a dedicated 240 V circuit, ventilation or hydro cooling, an internet connection, a bitcoin wallet and a pool account. Software setup takes minutes; power and cooling are the real work.",
      },
      {
        q: "Do I need to join a mining pool?",
        a: "Practically, yes. Solo mining a single machine can mean years between rewards. A pool converts that lottery into steady daily payouts for a one to three percent fee.",
      },
      {
        q: "How do I connect a miner to a pool?",
        a: "Open the miner's web interface, enter the pool's stratum URL and port, set your worker name or wallet address as the username, save and restart. The pool dashboard shows your hashrate within minutes.",
      },
      {
        q: "Can I mine bitcoin without buying hardware?",
        a: "Hosting lets you buy a machine and run it in an industrial facility at a fixed power rate. Cloud contracts avoid hardware entirely but usually deliver worse economics and no resale value.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "bitcoin-mining-machine-guide-what-to-buy-and-why",
    title: "Bitcoin Mining Machine Guide: What to Buy and Why",
    metaTitle: "Bitcoin Mining Machine Guide: What to Buy | BMD",
    category: "Buying Guides",
    categoryId: "buy",
    date: "2026-09-06",
    description:
      "How bitcoin mining machines differ: hashrate, efficiency, air vs hydro cooling, price per terahash and which models suit home, small-farm or hosted sites.",
    keywords: ["bitcoin mining machine", "bitcoin miner machine", "mining machine price", "asic miner", "buy mining machine"],
    intro: [
      "A bitcoin mining machine is a single-purpose computer whose only job is running SHA-256 as cheaply as possible. Every model on the market is a different answer to one question: how many joules does it burn per terahash, and what does that cost you up front?",
      "This guide breaks the market into the tiers we actually sell — current flagships, value previous-generation units, hydro machines and low-power home miners — and explains which fits which site, power rate and budget.",
    ],
    sections: [
      {
        h2: "The Two Numbers That Define Every Machine",
        paras: [
          "Efficiency, quoted in joules per terahash, tells you the machine's lifetime operating cost. Price per terahash, calculated from the delivered price divided by rated hashrate, tells you the capital cost. Together they decide payback; everything else is secondary detail.",
          "A useful shortcut: cheap power favours a low price per terahash, expensive power favours low joules per terahash. If your electricity is above ten cents per kilowatt-hour, paying a premium for efficiency is nearly always the correct decision.",
        ],
      },
      {
        h2: "Current-Generation Flagships",
        paras: [
          "The Antminer S21 family, MicroBT's M60 and M6x series and Canaan's newest Avalon units sit between roughly 12 and 18 joules per terahash. They hold margin through difficulty increases that switch older fleets off, which is why professional farms buy them despite the higher price per terahash.",
          "These machines suit operators with stable power contracts and a multi-year horizon. If your site has curtailment risk or seasonal shutdowns, the payback math shifts and the value tier often wins instead.",
        ],
      },
      {
        h2: "Value Tier: Previous-Generation Workhorses",
        paras: [
          "The S19j Pro, S19 XP, M30S++ and M50S trade efficiency in the 21 to 29 joule per terahash band for a far lower entry price. Under about six cents per kilowatt-hour these are frequently the fastest payback available, because you recover a small purchase price quickly.",
          "Treat this tier as a cash-flow play. Buy at a price you would be comfortable writing off inside twelve to eighteen months, and keep spare hashboards and power supplies on hand, since older units are the first to be squeezed by a difficulty jump.",
        ],
      },
      {
        h2: "Hydro and Immersion Machines",
        paras: [
          "Liquid-cooled machines hold their rated hashrate and efficiency because coolant temperature, not room temperature, sets the thermal ceiling. They are dramatically quieter, tolerate hot climates and support higher sustained overclocks, at the cost of a dry cooler, pumps and plumbing.",
          "For one to five machines air cooling is usually correct. Between five and fifty, hydro starts paying for itself in stability and acoustics. Above fifty, hydro or immersion generally wins on both efficiency and maintenance labour.",
        ],
      },
      {
        h2: "Low-Power Home Machines",
        paras: [
          "Home-oriented units draw one to two kilowatts, run far quieter and often work on a standard household circuit. They earn less in absolute terms, but they are the only realistic option for a house without a garage or dedicated 240 volt supply, and many owners use the exhaust heat productively in winter.",
          "Set expectations correctly: a home miner is a learning platform and a modest income stream, not a substitute for industrial hardware. If your goal is return on capital, hosting a full-size machine usually beats running a small one at residential power prices.",
        ],
      },
      {
        h2: "Condition, Warranty and Where You Buy",
        paras: [
          "New machines carry manufacturer warranty and predictable performance. Used and refurbished units cost materially less and can be excellent value when they have been bench-tested, with hashboards verified and thermal paste and fans replaced — which is exactly how our refurbished inventory is prepared.",
          "Insist on condition grading, test reports, delivered pricing and a stated return path before you pay. We ship worldwide from Hong Kong to the USA, Canada and Europe, and every listing states its condition and current price so you can compare on price per terahash instead of marketing copy.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a bitcoin mining machine cost?",
        a: "Used previous-generation machines start in the low hundreds of dollars, mid-tier units run one to three thousand, and current-generation flagships range from roughly three to eight thousand depending on hashrate and cooling.",
      },
      {
        q: "Which bitcoin mining machine is best for beginners?",
        a: "A tested used or refurbished mid-tier unit, or a low-power home miner if noise is a constraint. Learn firmware, pools and thermals on cheaper hardware before committing to a flagship.",
      },
      {
        q: "How long does a mining machine last?",
        a: "Three to five years of continuous operation is typical with clean power, filtered air and periodic fan and thermal-paste service. Liquid-cooled units often last longer because chip temperatures stay stable.",
      },
      {
        q: "Do mining machines come with a power supply?",
        a: "Most full-size Antminer and WhatsMiner units ship with the matching PSU. Hydro models require external cooling infrastructure, and some server-format units need specific PDUs — check each listing before ordering.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "btc-miner-buying-guide-real-costs-and-payback",
    title: "BTC Miner Buying Guide: Real Costs and Payback Math",
    metaTitle: "BTC Miner Buying Guide: Costs & Payback | BMD",
    category: "Profitability",
    categoryId: "profit",
    date: "2026-09-06",
    description:
      "What a BTC miner really costs to own: purchase price per terahash, daily power spend, hosting fees, maintenance, resale value and how to calculate payback.",
    keywords: ["btc miner", "bitcoin miner", "miner bitcoin miner", "mining payback", "cost of bitcoin miner"],
    intro: [
      "The sticker price of a BTC miner is the smallest number in the deal. Over three years, electricity typically costs several times the hardware, and the gap between a good purchase and a bad one is decided by arithmetic you can do in ten minutes before you pay.",
      "This guide lays out the full cost structure and the payback calculation we run with customers, so you can judge any listing — ours or anyone's — on numbers instead of enthusiasm.",
    ],
    sections: [
      {
        h2: "Capital Cost: Think in Dollars Per Terahash",
        paras: [
          "Divide the delivered price, including shipping and duties, by the machine's rated terahash. That single figure normalises across generations and instantly exposes overpriced listings. A machine that looks cheap in absolute terms is often expensive per terahash once you finish the division.",
          "Paying a higher price per terahash is only rational when the extra spend buys materially lower joules per terahash. Otherwise you are simply funding someone else's inventory clearance.",
        ],
      },
      {
        h2: "Operating Cost: The Number That Decides Everything",
        paras: [
          "Multiply the machine's wall power in kilowatts by 24 to get daily kilowatt-hours, then by your delivered rate. A 3.5 kilowatt unit at twelve cents per kilowatt-hour costs about ten dollars a day, every day, whether bitcoin is up or down.",
          "Compare that daily cost against the machine's expected daily revenue at current hashprice. If the margin is thin today, remember difficulty tends to rise: model a steady decline in daily revenue rather than a flat line.",
        ],
      },
      {
        h2: "Hosting Versus Running It Yourself",
        paras: [
          "Hosting charges a fixed rate per kilowatt-hour and bundles rack space, cooling, security and basic remote hands. For anyone on residential power it is often cheaper than self-hosting once you count the cost of electrical work, ventilation and your own time.",
          "Self-hosting wins when you have genuinely cheap power, suitable space and the willingness to be the technician. Price both paths before deciding; the answer flips depending on your local tariff.",
        ],
      },
      {
        h2: "Maintenance, Spares and Downtime",
        paras: [
          "Budget for fans, thermal paste, filters and at least one spare power supply per small fleet. Hashboard failures happen, and a machine waiting three weeks for a part earns nothing while its share of network hashrate keeps shrinking.",
          "Uptime is a financial metric, not a technical one. Ninety-eight percent uptime against ninety percent is an eight percent revenue difference for identical hardware, which is why parts availability and repair turnaround belong in the purchase decision.",
        ],
      },
      {
        h2: "Residual Value and Exit Strategy",
        paras: [
          "Mining hardware depreciates, but the secondary market is liquid, especially for Bitmain and MicroBT units where buyers trust parts supply and firmware support. Build an expected residual value into your model instead of assuming the machine is worthless at end of life.",
          "We buy back and trade in qualifying fleets, which gives operators a defined exit and often makes an upgrade cycle cheaper than holding aging hardware through the next difficulty increase.",
        ],
      },
      {
        h2: "A Payback Calculation You Can Trust",
        paras: [
          "Payback months equals delivered price divided by monthly net margin, where net margin is monthly revenue at current hashprice minus monthly power and hosting cost. Then stress-test it: rerun the same math with revenue twenty percent lower and power ten percent higher.",
          "If the stressed case still pays back inside your tolerance, the purchase is sound. If only the optimistic case works, negotiate the price, choose a more efficient machine, or wait. Our sales desk will run this calculation with your real electricity rate before you commit capital.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much can one BTC miner earn per day?",
        a: "Daily revenue equals your hashrate multiplied by current hashprice, minus power cost. It moves with bitcoin's price and network difficulty, so always model a range rather than a fixed figure.",
      },
      {
        q: "What is a good payback period for a bitcoin miner?",
        a: "Most operators target twelve to twenty-four months on new hardware and under twelve months on cheap used units. Anything longer leaves you exposed to difficulty growth and price drawdowns.",
      },
      {
        q: "Is it cheaper to host or run a miner at home?",
        a: "Hosting usually wins above roughly ten cents per kilowatt-hour, once electrical work, cooling and noise mitigation are counted. Below six cents, self-hosting is normally cheaper if you have the space.",
      },
      {
        q: "Do miners hold resale value?",
        a: "Yes, though it declines with each generation. Bitmain and MicroBT machines resell most reliably because spare parts and firmware support are widely available.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "bitcoin-mining-software-firmware-pools-and-monitoring",
    title: "Bitcoin Mining Software: Firmware, Pools and Monitoring",
    metaTitle: "Bitcoin Mining Software & Firmware Guide | BMD",
    category: "Setup & Operations",
    categoryId: "setup",
    date: "2026-09-06",
    description:
      "What bitcoin mining software actually does: stock versus custom ASIC firmware, pool configuration, tuning profiles, fleet monitoring and safe update practice.",
    keywords: ["bitcoin mining software", "asic firmware", "mining pool software", "miner monitoring", "custom firmware"],
    intro: [
      "There is no single program called bitcoin mining software. On an ASIC, the mining logic already lives in the machine's firmware; what you choose is the firmware build, the pool it talks to, and the monitoring layer that tells you when something breaks.",
      "This guide explains each layer, what stock and custom firmware change, and the tuning and update practices that keep hardware alive rather than shortening its life.",
    ],
    sections: [
      {
        h2: "Firmware Is the Mining Software",
        paras: [
          "Every modern ASIC ships with vendor firmware that runs the hashing engine, drives fans, manages voltage and frequency per hashboard, and speaks the stratum protocol to your pool. You configure it through a web interface on the machine's local IP address — no desktop mining application is involved.",
          "Because firmware controls voltage and clocks, it is the single most dangerous thing to change carelessly. Flash only builds you obtained from the manufacturer or a well-known firmware project, and never from a forum attachment or an unlabelled download.",
        ],
      },
      {
        h2: "Stock Versus Custom Firmware",
        paras: [
          "Custom firmware from established projects can improve joules per terahash through finer per-chip tuning, add autotuning profiles, expose better telemetry and support features like immersion presets. On older hardware the efficiency gain can be genuinely significant.",
          "The trade-offs are real: warranty implications, a development fee on some builds, and the risk of instability if you push voltage. Where efficiency matters more than warranty — typically on used machines — custom firmware is often worth it. On new units under warranty, stay stock.",
        ],
      },
      {
        h2: "Pool Configuration Done Properly",
        paras: [
          "Enter your pool's stratum URL and port, your worker name, and your wallet address where the pool requires it. Always configure a secondary and tertiary pool: if the primary becomes unreachable, the miner fails over instead of sitting idle burning your rent.",
          "Pick the geographically closest stratum endpoint to reduce stale shares, and choose the payout scheme deliberately. PPS gives steady predictable income, PPLNS pays more in lucky periods and less in unlucky ones.",
        ],
      },
      {
        h2: "Tuning: Underclocking Usually Beats Overclocking",
        paras: [
          "Lowering frequency and voltage slightly reduces hashrate a few percent while cutting power more than proportionally, improving joules per terahash and dropping chip temperatures. Cooler chips fail less often, so the machine earns for longer.",
          "Aggressive overclocking buys a small hashrate gain for disproportionate heat, fan wear and failure risk. Reserve it for hydro or immersion machines where the cooling loop can genuinely absorb the extra load.",
        ],
      },
      {
        h2: "Monitoring and Alerting",
        paras: [
          "At minimum, enable offline-worker alerts on your pool dashboard so you learn about a dead machine in minutes rather than at the end of the month. Pool-side hashrate is the honest measure of what you are actually being paid for.",
          "Beyond a handful of machines, a fleet management tool that polls each miner's API for hashboard status, chip temperature, fan RPM and error counts pays for itself immediately. Watch trends: rising temperatures at constant load usually mean dust, failing fans or dried thermal paste.",
        ],
      },
      {
        h2: "Security and Update Hygiene",
        paras: [
          "Change default credentials on first boot, keep miners on an isolated network segment, and never expose a miner's web interface to the public internet. Compromised firmware that silently redirects your hashrate to someone else's pool is a well-documented attack.",
          "Update firmware deliberately: read the release notes, test on one machine, confirm stable hashrate and temperature for a day, then roll out. Our repair centre supports customers through firmware recovery and hashboard diagnostics when an update goes wrong.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need to install mining software on my computer?",
        a: "No. ASIC miners run their own firmware and connect to a pool directly. Your computer is only used to open the miner's web interface for configuration.",
      },
      {
        q: "Is custom ASIC firmware safe?",
        a: "From established, well-known projects, generally yes — and it can improve efficiency. It may void warranty, and unofficial builds from unknown sources risk hijacked hashrate or bricked hardware.",
      },
      {
        q: "What is the best mining pool setup?",
        a: "Use the closest regional stratum endpoint as primary, with two backups configured for automatic failover, and choose PPS for predictable payouts or PPLNS for luck-based upside.",
      },
      {
        q: "How do I monitor several miners at once?",
        a: "Use pool-side alerts plus a fleet monitoring tool that polls each machine's API for hashboard status, temperatures and fan speeds, so you catch faults before they cost a full day of revenue.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "crypto-mining-explained-which-coins-are-worth-mining",
    title: "Crypto Mining Explained: Which Coins Are Worth Mining",
    metaTitle: "Crypto Mining: Which Coins Are Worth Mining | BMD",
    category: "Profitability",
    categoryId: "profit",
    date: "2026-09-06",
    description:
      "A practical look at crypto mining beyond bitcoin: SHA-256, Scrypt, kHeavyHash and Monero's RandomX, plus which algorithms and machines still make money.",
    keywords: ["crypto mining", "cryptocurrency mining", "monero mining", "scrypt mining", "altcoin mining"],
    intro: [
      "Crypto mining covers every proof-of-work coin, not just bitcoin, and each algorithm demands different hardware. Bitcoin uses SHA-256 and requires ASICs; Litecoin and Dogecoin use Scrypt; Kaspa uses kHeavyHash; Monero deliberately favours ordinary CPUs.",
      "This guide maps the main algorithms to the hardware that mines them, and explains how to judge whether a given coin is worth your electricity today rather than in a bull-market fantasy.",
    ],
    sections: [
      {
        h2: "Algorithms Decide Your Hardware",
        paras: [
          "An ASIC is built for one hash function. A SHA-256 machine mines bitcoin and its forks and nothing else; a Scrypt machine mines Litecoin and Dogecoin; a kHeavyHash unit mines Kaspa. There is no switching between algorithms on the same hardware.",
          "This is why algorithm choice is really a hardware purchase decision. Before buying any miner, confirm which coins share its algorithm, because that set defines every market you can ever sell hashrate into.",
        ],
      },
      {
        h2: "SHA-256: Bitcoin and the Deepest Market",
        paras: [
          "SHA-256 hosts by far the most hashrate, the most hardware competition and the deepest resale market. Margins are tight and difficulty climbs relentlessly, but liquidity is excellent: the coin you earn is bitcoin, and the machine you own has buyers worldwide.",
          "For most operators this is the default choice. Efficiency discipline matters most here precisely because competition is fiercest, which is why current-generation hydro and air flagships dominate professional fleets.",
        ],
      },
      {
        h2: "Scrypt and Merge-Mined Coins",
        paras: [
          "Scrypt machines such as the Antminer L7 and L9 mine Litecoin while simultaneously earning Dogecoin through merge mining, which means two revenue streams from one unit of electricity. That dual income has historically made Scrypt hardware competitive with bitcoin machines.",
          "The trade-off is a smaller hardware market and fewer model choices, so pricing can be volatile and spare parts less abundant. Buy Scrypt hardware when the dual-coin revenue and your power price genuinely beat SHA-256 alternatives.",
        ],
      },
      {
        h2: "Monero and CPU-Mineable Coins",
        paras: [
          "Monero's RandomX algorithm is deliberately memory-hard and ASIC-resistant, which keeps mining accessible to ordinary CPUs. It is the realistic entry point for anyone who wants to mine without industrial hardware, though earnings per machine are modest.",
          "Treat CPU mining as participation and learning rather than a business. The economics rarely justify buying hardware specifically for it, but running it on machines you already own can make sense.",
        ],
      },
      {
        h2: "How to Judge Any Coin Before You Buy Hardware",
        paras: [
          "Check three things: daily revenue per unit of hashrate at current prices, how liquid the coin is when you need to sell, and how fast difficulty has grown over the last six months. A coin with attractive revenue but no liquidity is a trap.",
          "Then confirm the hardware has a secondary market. Owning the only machine for a dying algorithm means both your income and your resale value can go to zero simultaneously, which is the classic way altcoin miners lose money.",
        ],
      },
      {
        h2: "Where Diversification Actually Helps",
        paras: [
          "Running a bitcoin fleet alongside a smaller Scrypt or kHeavyHash allocation spreads exposure across difficulty cycles and can smooth revenue. It also means part of your income arrives in assets that behave differently from bitcoin.",
          "Keep it deliberate: diversify because the underlying economics stand up on their own, never because a new coin is marketed as the next big thing. We stock SHA-256, Scrypt and kHeavyHash hardware and will quote delivered pricing per terahash on any of them.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which cryptocurrency is most profitable to mine?",
        a: "It changes with price and difficulty. Bitcoin offers the deepest liquidity and resale market, while Scrypt hardware earning Litecoin plus Dogecoin is frequently competitive at low power rates.",
      },
      {
        q: "Can one machine mine different coins?",
        a: "Only coins sharing its algorithm. A SHA-256 ASIC cannot mine Litecoin or Kaspa; you would need Scrypt or kHeavyHash hardware respectively.",
      },
      {
        q: "Is Monero mining worth it?",
        a: "As a low-cost way to participate with CPUs you already own, yes. As a business built on purchased hardware, the returns rarely justify the investment compared with ASIC mining.",
      },
      {
        q: "Should I mine altcoins instead of bitcoin?",
        a: "Only when the revenue math, coin liquidity and hardware resale market all hold up. Otherwise bitcoin's depth and hardware liquidity usually make it the safer allocation.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
  {
    slug: "nerdqaxe-vs-bitaxe-desktop-solo-miners-compared",
    title: "NerdQAxe vs Bitaxe: Desktop Solo Miners Compared",
    metaTitle: "NerdQAxe vs Bitaxe: Solo Miners Compared | BMD",
    category: "Brand Reviews",
    categoryId: "brand",
    date: "2026-09-06",
    description:
      "NerdQAxe and Bitaxe desktop solo miners compared on hashrate, efficiency, noise and realistic odds — and when a used ASIC earns more for the same money.",
    keywords: ["nerdqaxe", "bitaxe", "solo miner", "desktop bitcoin miner", "lottery mining"],
    intro: [
      "The NerdQAxe and Bitaxe are open-source desktop miners built around recycled ASIC chips. They draw tens of watts instead of kilowatts, sit silently on a desk, and let anyone hold real bitcoin hashrate at home without rewiring the house.",
      "They are genuinely charming devices — and they are lottery tickets, not income. This comparison covers what each actually does, then sets honest expectations against a used industrial ASIC at the same price.",
    ],
    sections: [
      {
        h2: "What These Devices Are",
        paras: [
          "Both are open-hardware boards carrying one or several ASIC chips harvested from full-size miner designs, paired with a small controller, display and fan. Power draw typically ranges from around fifteen watts to roughly eighty watts depending on model and chip count.",
          "Hashrate lands in the hundreds of gigahash to a few terahash. For context, a full-size modern ASIC produces two hundred terahash or more, so these boards represent a tiny fraction of one industrial machine's output.",
        ],
      },
      {
        h2: "NerdQAxe: More Chips, More Hashrate",
        paras: [
          "NerdQAxe designs generally stack multiple ASIC chips on one board, delivering meaningfully higher hashrate than a single-chip Bitaxe while still staying quiet and desk-friendly. That makes it the choice for people who want the maximum solo hashrate a desktop device can reasonably provide.",
          "The trade-off is higher power draw, more heat to move and a higher purchase price. It remains a hobby-scale device: multiple terahash is still a rounding error against network hashrate measured in hundreds of exahash.",
        ],
      },
      {
        h2: "Bitaxe: The Simplest Way In",
        paras: [
          "The Bitaxe is a single-chip, open-source design prized for low cost, low power and hackability. It is the cheapest credible way to own real bitcoin hashrate, and its schematics and firmware are fully public, which is a large part of its appeal.",
          "As a teaching tool it is excellent: you learn stratum, pool configuration, firmware flashing and thermal behaviour on hardware that costs less than a hashboard repair. Just do not expect it to pay a power bill.",
        ],
      },
      {
        h2: "The Odds, Stated Honestly",
        paras: [
          "Solo mining pays only if your device finds an entire block. With a few terahash against a network in the hundreds of exahash, the expected wait is measured in many thousands of years — while the payoff, if it ever lands, is a full block reward.",
          "That is the deal: near-zero probability, large prize. Buy one because you find that interesting, because you support decentralised hashrate, or because you want to learn. Never buy one expecting yield.",
        ],
      },
      {
        h2: "When a Used ASIC Is the Better Purchase",
        paras: [
          "If your goal is income, the same money spent on a tested used industrial ASIC buys hundreds of times more hashrate and produces steady pool payouts. The catch is that it needs a 240 volt circuit, real ventilation and tolerance for 72 to 80 decibels.",
          "So the decision is not about which device is better in the abstract — it is about your site. No suitable space and no tolerance for noise? A desktop solo miner is a fine hobby. Have a garage, outbuilding or hosting contract? Buy the used ASIC and earn every day.",
        ],
      },
      {
        h2: "Running Either One Well",
        paras: [
          "Point the device at a solo-mining-capable pool endpoint, keep intake air unobstructed, and watch chip temperature — these small boards throttle quickly in warm rooms and often benefit from a larger heatsink or better fan than they ship with.",
          "Update firmware from the official project repositories only, and keep the device off the public internet like any other miner. If you later want real hashrate, our used and refurbished inventory is bench-tested and condition-graded, and we ship worldwide from Hong Kong.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between NerdQAxe and Bitaxe?",
        a: "Bitaxe is a single-chip open-source solo miner focused on low cost and low power. NerdQAxe designs use several chips for higher hashrate, at higher power draw and price.",
      },
      {
        q: "Can a Bitaxe or NerdQAxe actually mine a block?",
        a: "Technically yes — every share has the same chance of solving a block. Realistically the expected wait spans thousands of years, so treat it as a lottery ticket rather than income.",
      },
      {
        q: "How much power do desktop solo miners use?",
        a: "Roughly fifteen to eighty watts depending on model and chip count, which is why they run quietly on a desk with no electrical work required.",
      },
      {
        q: "Is a used ASIC better than a desktop solo miner?",
        a: "For earning, yes by a wide margin — hundreds of times more hashrate and steady pool payouts. But it needs a 240 V circuit, ventilation and somewhere that tolerates loud fans.",
      },
    ],
    match: { condition: "used" },
    readMinutes: 8,
  },
  {
    slug: "how-does-bitcoin-mining-work-inside-a-mining-operation",
    title: "How Does Bitcoin Mining Work Inside a Real Operation",
    metaTitle: "How Does Bitcoin Mining Work? Inside a Farm | BMD",
    category: "Setup & Operations",
    categoryId: "setup",
    date: "2026-09-06",
    description:
      "From hash attempts to payouts: how a working mining operation is wired, cooled, monitored and paid, and which decisions actually move the margin.",
    keywords: ["how does bitcoin mining work", "mining farm", "mining operation", "hashrate", "mining pool payouts"],
    intro: [
      "The textbook answer to how bitcoin mining works stops at hashing and block rewards. The operational answer is about electricity contracts, airflow, breaker sizing, monitoring and repair queues — the things that separate a farm making money from one burning it.",
      "This walkthrough follows the chain from a single hash attempt to money in your wallet, using the way we actually commission and service machines from our Hong Kong facility.",
    ],
    sections: [
      {
        h2: "From Hash Attempt to Accepted Share",
        paras: [
          "Your pool sends each machine a work template. The miner hashes it with billions of nonce variations per second and returns any result that meets the pool's share difficulty. Those accepted shares are the accounting record of your contribution.",
          "Occasionally a share also satisfies the far harder network target, and the pool publishes a block. The reward goes to the pool, which distributes it across everyone's shares. Your income therefore tracks accepted shares, not luck.",
        ],
      },
      {
        h2: "Electrical Design Comes First",
        paras: [
          "Each full-size machine wants its own 240 volt circuit, typically a 30 amp breaker, with correct plug type and cable rating. Loading circuits to their limit is how fires start; size for continuous duty, not peak tolerance, and have an electrician sign off multi-machine installs.",
          "At farm scale this becomes three-phase distribution, PDUs and load balancing across phases. Getting the electrical layout right before the hardware arrives is far cheaper than retrofitting once machines are racked.",
        ],
      },
      {
        h2: "Airflow Is a Design Problem, Not an Afterthought",
        paras: [
          "Air-cooled machines pull cool air in one end and exhaust hot air out the other. Any path that lets exhaust recirculate to the intake raises intake temperature, throttles the chips and quietly costs you hashrate. Separate hot and cold sides with physical barriers.",
          "Aim to keep intake below roughly 35 degrees Celsius. Filter the intake, clean filters on schedule, and remember that dust plus heat is the most common cause of premature hashboard and fan failure.",
        ],
      },
      {
        h2: "Hydro and Immersion at Scale",
        paras: [
          "Liquid cooling moves the thermal problem outside the building: coolant carries heat to a dry cooler or heat exchanger, so ambient temperature stops governing performance. Machines hold rated hashrate, run far quieter and tolerate higher sustained clocks.",
          "The cost is infrastructure — pumps, manifolds, coolant, leak detection and maintenance discipline. Above roughly fifty machines this usually pays for itself in stability, density and lower labour per terahash.",
        ],
      },
      {
        h2: "Monitoring, Repairs and Uptime Economics",
        paras: [
          "Pool-side hashrate is the number that matters, because it reflects what you get paid for. Alert on offline workers, track per-machine temperature and fan trends, and investigate any unit whose hashrate drifts down — that is usually a failing hashboard announcing itself early.",
          "Keep spare PSUs, fans and control boards on the shelf, and have a repair path arranged before you need it. Our repair centre handles hashboard and PSU faults for customers worldwide, which shortens the downtime that silently eats fleet revenue.",
        ],
      },
      {
        h2: "Getting Paid and Keeping Records",
        paras: [
          "Pools pay to the bitcoin address you configure, on a schedule and minimum threshold you set. Withdraw to a wallet you control, and reconcile payouts against expected revenue monthly — a persistent shortfall usually means stale shares, throttling or an offline worker nobody noticed.",
          "Keep records of electricity consumption, hardware cost and payouts from day one. It makes tax reporting straightforward and gives you the real cost per terahash you need before your next hardware purchase.",
        ],
      },
    ],
    faqs: [
      {
        q: "How does a mining pool decide what to pay me?",
        a: "By your accepted shares over the payout window. PPS pays a fixed amount per share regardless of pool luck; PPLNS distributes actual block rewards across recent shares, so income varies with luck.",
      },
      {
        q: "Why is my miner producing less hashrate than advertised?",
        a: "Usually warm intake air causing throttling, dusty filters, a failing fan, or a partially faulty hashboard. Expect around 95 percent of rated output in a warm room as normal derating.",
      },
      {
        q: "How many miners can I run on one circuit?",
        a: "Typically one full-size machine per dedicated 240 V 30 A circuit. Continuous mining load leaves no headroom for sharing, and overloaded circuits are a genuine fire risk.",
      },
      {
        q: "What keeps a mining operation profitable long term?",
        a: "Cheap power, efficient hardware in joules per terahash, high uptime and a fast repair path. Those four factors outweigh every short-term price movement.",
      },
    ],
    match: {},
    readMinutes: 8,
  },
];

// --- blog.ts ---
const blogPath = "src/lib/blog.ts";
let blog = readFileSync(blogPath, "utf8");
for (const p of posts) {
  if (blog.includes(`"slug": "${p.slug}"`)) throw new Error(`duplicate slug ${p.slug}`);
}
const marker = "];\n\nexport const getPost";
if (!blog.includes(marker)) throw new Error("blog.ts array end marker not found");
const body = posts
  .map((p) => {
    const { metaTitle, ...rest } = p;
    return JSON.stringify(rest, null, 2)
      .split("\n")
      .map((l) => "  " + l)
      .join("\n");
  })
  .join(",\n");
blog = blog.replace(marker, `${body},\n${marker}`);
writeFileSync(blogPath, blog);

// --- blog-index.ts ---
const idxPath = "src/lib/blog-index.ts";
let idx = readFileSync(idxPath, "utf8");
const idxMarker = "];\n";
const idxEnd = idx.indexOf("\n];", idx.indexOf("export const BLOG_INDEX"));
if (idxEnd < 0) throw new Error("blog-index array end not found");
const idxBody = posts
  .map((p) =>
    JSON.stringify(
      {
        slug: p.slug,
        title: p.title,
        metaTitle: p.metaTitle,
        category: p.category,
        categoryId: p.categoryId,
        date: p.date,
        description: p.description,
        keywords: p.keywords,
        readMinutes: p.readMinutes,
      },
      null,
      2,
    )
      .split("\n")
      .map((l) => "  " + l)
      .join("\n"),
  )
  .join(",\n");
idx = idx.slice(0, idxEnd) + ",\n" + idxBody + idx.slice(idxEnd);
writeFileSync(idxPath, idx);
void idxMarker;

// --- sitemap ---
const smPath = "public/sitemap-blog.xml";
let sm = readFileSync(smPath, "utf8");
const entries = posts
  .map(
    (p) =>
      `  <url><loc>https://bitcoinminingdepot.com/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
  )
  .join("\n");
sm = sm.replace("</urlset>", `${entries}\n</urlset>`);
writeFileSync(smPath, sm);

console.log("added", posts.length, "posts");
