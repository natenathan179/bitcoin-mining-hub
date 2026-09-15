/**
 * One-off generator: appends the eight guides that close the remaining gaps in
 * the Antminer / WhatsMiner keyword batch (U3S23H, M79S, M61, M20S, WhatsMiner
 * firmware downloads, one-petahash builds, BitForge Nano class home miners and
 * the smaller Speed Miner / Power Miner / Monzbit brands).
 * Run with: bun scripts/add-keyword-batch-posts.ts
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

const DATE = "2026-09-07";

const posts: Post[] = [
  {
    slug: "antminer-u3s23h-specs-hashrate-and-who-it-suits",
    title: "Antminer U3S23H: Specs, Hashrate and Who It Suits",
    metaTitle: "Antminer U3S23H Specs and Buying Guide | BMD",
    category: "Brand Reviews",
    categoryId: "brand",
    date: DATE,
    description:
      "What the Antminer U3S23H is, the hashrate and power figures to confirm before you pay, how it compares with S21-class units, and who should actually buy one.",
    keywords: ["antminer u3s23h", "u3s23h", "antminer u3", "bitmain u3s23h", "antminer s23"],
    intro: [
      "The Antminer U3S23H is one of Bitmain's compact S23-generation units, and searches for it usually come from buyers who have seen a listing and want to know whether the specification is real before they wire money. Because the U-series sits outside the familiar S19/S21 naming, sellers describe it inconsistently — sometimes as a rack unit, sometimes as a desktop-scale machine — and that is exactly where buyers get burned.",
      "This guide covers what to verify on any U3S23H offer, how the machine fits against S21-class hardware on cost per terahash, and the site conditions it needs. Where a figure varies by batch we say so rather than quoting a number you might be held to; the safe move is always to have the seller confirm hashrate, wall power and firmware in writing before payment.",
    ],
    sections: [
      {
        h2: "What the U3S23H Actually Is",
        paras: [
          "The U-series naming marks a chassis format rather than a new chip family: the hashing silicon is shared with the S23 generation, packaged for a different power and airflow envelope. In practice that means efficiency in the same neighbourhood as other S23 units, but a lower absolute hashrate and lower wall draw than a full-size 3U hydro machine.",
          "Treat the model number as a starting point, not a specification. Ask the seller for the label photo, the hashrate reported on the miner's own status page at room temperature, and the measured wall power at the plug. Those three numbers tell you more than any datasheet screenshot.",
        ],
      },
      {
        h2: "The Numbers to Confirm Before You Pay",
        paras: [
          "Confirm four things: rated terahash, wall watts, joules per terahash calculated from those two, and cooling type. Divide watts by terahash yourself — do not accept the seller's efficiency claim, because that is the figure most often copied from a different variant.",
          "Then ask which firmware is installed and whether the unit has ever been overclocked. An S23-class board that has spent a year at raised voltage is a different asset from a stock unit, even when the hashrate on screen looks identical today.",
        ],
      },
      {
        h2: "How It Compares With S21 and S23 Air Units",
        paras: [
          "Against an S21-class air miner, an S23-generation unit generally wins on joules per terahash, which matters most when your delivered power costs above about eight cents per kilowatt-hour. Below that, the cheaper purchase price of previous-generation hardware often wins on payback despite the higher running cost.",
          "Compare candidates on delivered dollars per terahash and on watts you can actually supply. A more efficient machine you cannot cool or power is worth less than a slightly thirstier one that runs at full clock all year.",
        ],
      },
      {
        h2: "Power, Cooling and Noise Requirements",
        paras: [
          "Any S23-family unit expects a 200-240 volt supply on its own breaker. Plan the circuit around continuous load, not peak, and leave headroom — running a breaker near its rating for months is how avoidable outages start.",
          "Heat and noise decide the location. A full-power air unit belongs in a garage, outbuilding or hosted rack, never a living space. If the only site you have is inside the house, a hydro unit with the radiator outdoors, or a low-power home miner, is the honest answer.",
        ],
      },
      {
        h2: "Buying Checks for New and Used Units",
        paras: [
          "For used stock, insist on a load test of at least two hours with a screenshot showing all hashboards online, chip temperatures and the accepted-share count. A single-minute screenshot proves the machine powers on, nothing more.",
          "Confirm condition grade, what warranty covers, who pays return shipping if a board fails, and whether the price is delivered with customs paperwork included. Every unit we ship is bench-tested and condition-graded, and we quote delivered prices from Hong Kong by air freight.",
        ],
      },
      {
        h2: "Who Should Buy One and Who Should Not",
        paras: [
          "The U3S23H makes sense for an operator who wants current-generation efficiency in a smaller power slot — a site with limited amperage, or someone adding a machine to an existing rack without upgrading the panel.",
          "If you have abundant cheap power and space, your money usually goes further in bulk previous-generation hardware or a full-size hydro unit. And if you cannot supply 240 volts at all, no S23-family machine is the right purchase.",
        ],
      },
    ],
    faqs: [
      { q: "Is the Antminer U3S23H a real Bitmain model?", a: "It is sold as part of the S23 generation in a compact chassis. Because listings vary by batch, always have the seller confirm rated hashrate, wall power and cooling type in writing before paying." },
      { q: "What efficiency should I expect?", a: "S23-generation silicon is efficient by current standards, but calculate joules per terahash yourself from the measured wall watts and the hashrate the miner reports — not from a datasheet image." },
      { q: "Can I run it on a household 120 V outlet?", a: "No. Plan on a dedicated 200-240 V circuit. Only purpose-built low-power home miners run sensibly on a standard household outlet." },
      { q: "Is a used unit worth buying?", a: "Yes, if it is load-tested for hours with all hashboards online, condition-graded, and priced well below new on a dollars-per-terahash basis." },
      { q: "How loud is it?", a: "Air-cooled ASICs run in the 70-plus decibel range under load — comparable to a shop vacuum that never stops. Plan for a garage, outbuilding or hosted facility." },
    ],
    match: { brands: ["Bitmain"], terms: ["s23", "s21"] },
    readMinutes: 8,
  },
  {
    slug: "whatsminer-m79s-hydro-specs-efficiency-and-payback",
    title: "WhatsMiner M79S: Hydro Specs, Efficiency and Payback",
    metaTitle: "WhatsMiner M79S Hydro Specs and Payback | BMD",
    category: "Brand Reviews",
    categoryId: "brand",
    date: DATE,
    description:
      "The MicroBT WhatsMiner M79S explained: hydro cooling requirements, efficiency class, what to verify before buying, and how payback compares to air-cooled units.",
    keywords: ["whatsminer m79s", "microbt whatsminer m79s", "m79s", "microbt whatsminer", "whatsminer hydro"],
    intro: [
      "The WhatsMiner M79S is MicroBT's high-end hydro-cooled line, and it is bought almost exclusively by operators who already have — or are building — a water loop. If you are searching the model number to compare it against an air machine, the honest framing is that these are two different infrastructure decisions, not two products on a shelf.",
      "This guide covers what the M79S needs from a site, which numbers to confirm before ordering, and when hydro genuinely pays back faster than air. Specifications differ between production batches, so treat every figure as something to confirm with the seller in writing rather than as a promise.",
    ],
    sections: [
      {
        h2: "Where the M79S Sits in the WhatsMiner Range",
        paras: [
          "MicroBT splits its catalogue by cooling: air units in the M30/M50/M60 families, hydro units in the higher-numbered lines. The M79S belongs to the hydro tier, which means far higher hashrate per rack unit and better efficiency than any air machine of the same generation, at the cost of needing pumps, a dry cooler and leak management.",
          "That trade is the whole point. Hydro hardware exists because water moves heat away from silicon far better than air, letting the chips run at a clock and voltage combination that would cook an air-cooled board.",
        ],
      },
      {
        h2: "What Hydro Cooling Actually Requires",
        paras: [
          "A hydro unit is not plug-and-play. You need a closed loop with a manifold, quick-disconnect couplings, a pump with redundancy, a dry cooler or heat exchanger sized to your total kilowatts, treated coolant and a leak-detection plan. Budget for that infrastructure alongside the machines, not afterwards.",
          "Inlet water temperature governs performance. Keep the loop within the manufacturer's window and the machine holds full clock; let it drift and you lose hashrate or trip protection. In hot climates the dry cooler, not the miner, becomes the limiting factor in summer.",
        ],
      },
      {
        h2: "Efficiency and Cost per Terahash",
        paras: [
          "Judge the M79S the same way as anything else: joules per terahash from measured wall power, and delivered dollars per terahash. Hydro units usually win the first number decisively and lose the second on day one, because both the machine and the loop cost money before a single share is submitted.",
          "Work the payback with your real delivered power rate — bill total divided by kilowatt-hours — and include loop capital and pump power in the model. Skipping those two lines is the most common reason hydro projects miss their forecast.",
        ],
      },
      {
        h2: "When Hydro Beats Air on Payback",
        paras: [
          "Hydro wins when power is expensive, density is constrained, or heat has a second use. If you pay above roughly ten cents per kilowatt-hour, the efficiency gap compounds every month and eventually swamps the extra capital. If you are reselling heat to a building, greenhouse or process loop, hydro is the only sensible format.",
          "Air wins when power is very cheap, the site is a shed rather than a hall, or you are running fewer than a handful of machines. At that scale the loop cost per machine never amortises.",
        ],
      },
      {
        h2: "Buying Checks and Warranty Questions",
        paras: [
          "Ask for a load-test record showing hashrate, inlet and outlet temperatures and all hashboards online. For a hydro unit also ask about coolant history and whether the plates have ever been opened — corrosion and residue inside a cold plate are much harder to diagnose than a dusty fan.",
          "Confirm warranty terms in writing, including who pays return freight, and whether the unit ships with couplings and mounting hardware. We bench-test and condition-grade every machine and quote delivered prices from Hong Kong with full customs paperwork.",
        ],
      },
      {
        h2: "Running It Day to Day",
        paras: [
          "Monitor coolant temperature and flow as first-class metrics beside hashrate. A pump degrading quietly shows up as a slow temperature climb long before the miner throws an error, and catching it early is the difference between a service call and a dead hashboard.",
          "Keep spares for the parts that fail in loops rather than in miners: pumps, seals, couplings and filters. Uptime, not peak hashrate, is what pays back a hydro build.",
        ],
      },
    ],
    faqs: [
      { q: "What makes the M79S different from air WhatsMiners?", a: "It is hydro cooled, so it runs at higher density and better efficiency but requires a full water loop with pumps, a dry cooler and leak management." },
      { q: "Can I run one M79S at home?", a: "Technically yes with a small loop and outdoor radiator, but the loop cost per machine only makes sense at multiple units or where heat reuse offsets it." },
      { q: "What inlet temperature should the loop hold?", a: "Stay inside the manufacturer's stated window for your batch. Above it you lose clock speed; well below it you are simply overspending on cooling capacity." },
      { q: "Is a used hydro miner risky?", a: "More than an air unit, because coolant history matters. Insist on a multi-hour load test with inlet and outlet temperatures logged, and ask whether cold plates were ever opened." },
      { q: "How do I compare it fairly with an S21-class machine?", a: "Use joules per terahash from measured wall watts, plus delivered dollars per terahash including your share of loop capital and pump power." },
    ],
    match: { brands: ["MicroBT"], terms: ["whatsminer", "hydro"] },
    readMinutes: 8,
  },
  {
    slug: "whatsminer-m61-review-hydro-hashrate-and-site-fit",
    title: "WhatsMiner M61 Review: Hydro Hashrate and Site Fit",
    metaTitle: "WhatsMiner M61 Review and Site Fit | BMD",
    category: "Brand Reviews",
    categoryId: "brand",
    date: DATE,
    description:
      "A practical look at the MicroBT WhatsMiner M61: where it fits in the hydro range, the specs to confirm, cooling and power needs, and whether it suits your site.",
    keywords: ["whatsminer m61", "microbt m61", "m61 miner", "whatsminer hydro", "microbt whatsminer"],
    intro: [
      "The WhatsMiner M61 is a hydro-cooled MicroBT machine that sits between the mainstream M60 air units and the top of the hydro range. Operators look it up when they want the density of water cooling without paying flagship prices, and it is a reasonable place to land — provided the site can actually host a loop.",
      "Below is what to check before ordering, how the M61 compares to air alternatives on running cost, and the day-to-day operating profile. Batch specifications vary, so treat every number as a question for the seller rather than a settled fact.",
    ],
    sections: [
      {
        h2: "Where the M61 Fits",
        paras: [
          "MicroBT's hydro line trades installation complexity for efficiency and rack density. The M61 belongs to that line, so it targets operators with a manifold, pump set and dry cooler already planned, or a hosting provider that supplies them.",
          "If your comparison shortlist contains only air machines, the M61 is not really a like-for-like option. Compare it instead against other hydro units, or against hosted hydro capacity where the facility owns the loop.",
        ],
      },
      {
        h2: "Specifications Worth Confirming",
        paras: [
          "Get rated terahash, wall watts, inlet temperature window and required flow rate in writing. Then compute joules per terahash yourself from wall watts divided by terahash — that single derived number is how you compare it to anything else on the market.",
          "Also confirm the firmware version and whether the machine has run overclocked. Hydro units tolerate more aggressive tuning than air, which means used hydro stock has more often been pushed hard.",
        ],
      },
      {
        h2: "Loop, Power and Space",
        paras: [
          "Size the dry cooler for your worst summer week, not the annual average. Undersized heat rejection is the most common reason a hydro deployment fails to hit its modelled hashrate, and it always shows up in the hottest month.",
          "On the electrical side, plan dedicated 200-240 volt circuits with headroom and treat pump power as part of the site load. Pumps are small next to miners but they are the part that must never stop.",
        ],
      },
      {
        h2: "Running Cost Against Air Units",
        paras: [
          "Model payback with your delivered power rate from an actual bill. At high power prices the M61's efficiency advantage over same-generation air hardware compounds quickly; at very low prices, cheap air machines often return capital sooner despite burning more.",
          "Include the loop's capital and maintenance in the model. A hydro machine amortising a loop across only two or three units rarely beats air; across a full rack it usually does.",
        ],
      },
      {
        h2: "Buying and Testing Checklist",
        paras: [
          "Ask for a load test of two hours or more with hashrate, all hashboards online, and inlet and outlet temperatures visible. Request photos of couplings and cold-plate exteriors, and ask whether coolant was ever replaced or the plates opened.",
          "Confirm delivered price, customs paperwork, warranty scope and return-freight responsibility. Our units are bench-tested, condition-graded and shipped by air freight from Hong Kong with tracking and full documentation.",
        ],
      },
      {
        h2: "Who It Suits",
        paras: [
          "The M61 suits a small-to-mid operator building a proper loop, or someone buying into hosted hydro racks where efficiency directly reduces the monthly bill. It also suits heat-reuse projects, where warm water is the product and hashrate is the byproduct.",
          "It does not suit a single-machine home setup, a site stuck on 120 volts, or an operator who has not yet costed pumps and heat rejection. In those cases an efficient air unit or hosting is the better first step.",
        ],
      },
    ],
    faqs: [
      { q: "Is the M61 air or hydro cooled?", a: "Hydro. It needs a closed water loop with a manifold, pump redundancy and a dry cooler sized to your total load." },
      { q: "How does it compare to the M60S?", a: "The M60S line is air cooled and easier to deploy; the M61 offers better density and efficiency but only after you pay for the loop." },
      { q: "What flow rate and inlet temperature does it need?", a: "Confirm both with the seller for your specific batch, then design the loop to hold the inlet inside that window on the hottest day of the year." },
      { q: "Can I host it instead of building a loop?", a: "Yes, and for most buyers under a rack of machines that is the cheaper route, because the facility already owns the heat-rejection infrastructure." },
      { q: "What should a used M61 cost?", a: "Price it on delivered dollars per terahash against current alternatives, then discount further for unknown coolant history or a heavily overclocked past." },
    ],
    match: { brands: ["MicroBT"], terms: ["whatsminer", "m6"] },
    readMinutes: 8,
  },
  {
    slug: "whatsminer-m20s-in-2026-is-the-old-workhorse-worth-it",
    title: "WhatsMiner M20S in 2026: Is the Old Workhorse Worth It",
    metaTitle: "WhatsMiner M20S in 2026: Worth Buying? | BMD",
    category: "Used ASIC Miners",
    categoryId: "used",
    date: DATE,
    description:
      "Whether the WhatsMiner M20S still earns in 2026: efficiency reality, the power price it needs, what a fair used price looks like, and safer alternatives.",
    keywords: ["whatsminer m20s", "m20s miner", "used whatsminer", "microbt whatsminer", "m20s price"],
    intro: [
      "The WhatsMiner M20S was one of the most widely deployed machines of its generation, and thousands are still circulating on the second-hand market at prices that look irresistible. The catch is efficiency: an M20S burns far more joules per terahash than anything current, so the electricity bill decides whether it is a bargain or a space heater.",
      "This guide is deliberately blunt about that arithmetic. It covers the power rate an M20S needs to stay profitable, how to test one before buying, what a fair price looks like today, and when a slightly newer used unit is the smarter purchase.",
    ],
    sections: [
      {
        h2: "The Efficiency Problem in Plain Numbers",
        paras: [
          "Older SHA-256 hardware like the M20S sits in a much worse joules-per-terahash band than current machines. That means for every unit of bitcoin earned, you pay several times the electricity a modern miner would. Nothing about firmware, tuning or pool choice changes that fundamental gap.",
          "So the model is simple: cheap hardware, expensive hashing. It works only where power is genuinely cheap, and it collapses the moment your rate climbs or difficulty rises.",
        ],
      },
      {
        h2: "The Power Rate That Makes It Viable",
        paras: [
          "Calculate your delivered rate by dividing a recent bill total by the kilowatt-hours it covered. If that number is in the low single-digit cents, older hardware can still turn a margin. Around and above about six to eight cents, an M20S typically earns little or nothing after difficulty growth.",
          "Free or curtailed power, flared gas, or surplus hydro change the picture entirely — that is where old machines genuinely belong, because the capital cost is near zero and the electricity is otherwise wasted.",
        ],
      },
      {
        h2: "What a Fair Used Price Looks Like",
        paras: [
          "Price older units on delivered dollars per terahash and then discount hard for efficiency. A machine that costs three times as much to run as a current model must be several times cheaper per terahash to make sense, not merely a bit cheaper.",
          "Factor in the parts you will replace: fans, power supply, thermal paste and possibly a hashboard. Budget for at least one repair in the first year and treat shipping cost as part of the purchase price, because on low-value machines freight can exceed the hardware.",
        ],
      },
      {
        h2: "How to Test One Before You Pay",
        paras: [
          "Insist on a load test of at least two hours: all three hashboards online, hashrate within a few percent of rated, chip temperature spread reasonably tight, and accepted shares climbing steadily on the pool side.",
          "Look for the tells of a hard life: heavy dust, corroded connectors, mismatched fan models, scorch marks near the PSU, or a hashrate that starts strong and sags as the case warms. Any of those justify walking away or paying scrap-adjacent money.",
        ],
      },
      {
        h2: "Noise, Heat and Where to Put It",
        paras: [
          "An M20S is loud and hot in the way all air-cooled ASICs are — plan for a garage, outbuilding, workshop or hosted rack, and a dedicated 200-240 volt circuit. Intake air above the mid-30s Celsius will throttle it and shorten its remaining life.",
          "Because older machines produce more heat per unit of earnings, they are the best candidates for genuine heat reuse: workshops, drying rooms, greenhouses. If the warmth has value, the economics improve without touching the mining side.",
        ],
      },
      {
        h2: "Better Alternatives at the Same Budget",
        paras: [
          "For most buyers, a used mid-generation unit at a somewhat higher price returns capital faster than a very cheap M20S, simply because the running cost is lower every hour it hashes. Run both scenarios at your real power rate before deciding.",
          "If you want the cheapest possible way to learn, a low-power desktop miner teaches you pools, firmware and monitoring without a 3-kilowatt bill. If you want returns, buy efficiency. Every unit we ship is tested and condition-graded so you can compare like with like.",
        ],
      },
    ],
    faqs: [
      { q: "Is the WhatsMiner M20S still profitable?", a: "Only with very cheap power — roughly low single-digit cents per kilowatt-hour — or free curtailed energy. At typical residential rates it usually loses money." },
      { q: "What should I pay for a used M20S?", a: "Price it on delivered dollars per terahash, then discount heavily for its poor efficiency and expected repairs. Include freight, which can rival the hardware cost." },
      { q: "How many hashboards does it have and what if one is dead?", a: "A missing board means a proportional hashrate loss at the same fixed overhead. Only buy a partially working unit at a price that treats it as a parts machine." },
      { q: "Can I improve efficiency with firmware?", a: "Underclocking can improve joules per terahash slightly, but it cannot close a generational gap. Do not buy on the assumption tuning will rescue the math." },
      { q: "Is it a good first miner to learn on?", a: "It teaches you the operational side cheaply, but the power bill is real. A low-power desktop miner is the gentler learning platform." },
    ],
    match: { brands: ["MicroBT"], condition: "used", terms: ["whatsminer"] },
    readMinutes: 8,
  },
  {
    slug: "whatsminer-firmware-download-versions-safety-rollback",
    title: "WhatsMiner Firmware Download: Versions, Safety, Rollback",
    metaTitle: "WhatsMiner Firmware Download and Safety | BMD",
    category: "Setup & Operations",
    categoryId: "setup",
    date: DATE,
    description:
      "How to source WhatsMiner firmware safely, which version to run, how to flash without bricking a control board, and how to roll back when an update goes wrong.",
    keywords: ["whatsminer firmware download", "whatsminer firmware", "whatsminer tool download", "microbt firmware", "whatsminer update"],
    intro: [
      "Firmware is the one maintenance task that can turn a working WhatsMiner into a paperweight, so it deserves a process rather than a click. Most bricked control boards we see in the repair queue arrive after an unofficial image, an interrupted flash, or a version mismatch between firmware and hashboard revision.",
      "This guide covers where firmware should come from, how to decide whether you need an update at all, the flashing sequence that avoids trouble, and what to do when a machine comes back up wrong. It applies to the WhatsMiner tool workflow as well as the browser interface.",
    ],
    sections: [
      {
        h2: "Only Update When You Have a Reason",
        paras: [
          "A stable miner hitting rated hashrate does not need new firmware. Valid reasons to update are a documented bug affecting you, a security fix, support for a pool or monitoring feature you actually use, or a manufacturer instruction tied to a repair.",
          "Chasing version numbers for their own sake is how fleets end up on mixed, unsupported builds. If you cannot name the problem the update solves, skip it.",
        ],
      },
      {
        h2: "Where Firmware Should Come From",
        paras: [
          "Use the manufacturer's own distribution or a supplier you have a commercial relationship with. Forum attachments, file-sharing links and resellers of 'unlocked' images are the main source of bricked boards and, occasionally, of hijacked payout addresses.",
          "Verify that the image matches your exact model and hardware revision, not just the family name. An M30-series file on an M50-series board is a reliable way to lose a control board.",
        ],
      },
      {
        h2: "The WhatsMiner Tool Workflow",
        paras: [
          "The manufacturer's utility handles discovery, batch configuration and firmware pushes across a subnet, which is why it is the standard route for anything beyond a couple of machines. Run it on a wired network segment, not over wifi, and confirm the tool lists every target before you start.",
          "Do a single machine first. Flash one unit, let it run a full hour under load, check hashrate and temperatures, then roll the same version out in small batches. Fleet-wide simultaneous updates leave you with no known-good reference when something breaks.",
        ],
      },
      {
        h2: "Flashing Without Bricking Anything",
        paras: [
          "Before you start: back up the current configuration, note the pool settings and worker names, and make sure power is stable. A brownout mid-write is the classic cause of an unrecoverable control board, so put the machine on a circuit you trust.",
          "Never power-cycle during a flash, even if the interface looks frozen. Give it the full time the tool states, then wait for the miner to come back and rejoin the pool on its own before touching anything.",
        ],
      },
      {
        h2: "Custom and Overclock Firmware",
        paras: [
          "Third-party firmware can improve joules per terahash through undervolting, and some operators run it fleet-wide with good results. The trade is warranty: manufacturers and many suppliers treat unofficial images as grounds for refusal, and heavy overclocking measurably shortens hardware life.",
          "If you do run custom builds, use one vendor consistently, keep an official image on hand for reflashing, and prefer efficiency tuning over raw hashrate gains. The extra terahash rarely pays for the extra failures.",
        ],
      },
      {
        h2: "Recovery and Rollback",
        paras: [
          "Symptoms of a bad update are a miner that never rejoins the pool, hashboards missing from the status page, or a hashrate well below rating with normal temperatures. Reflash the known-good version from the manufacturer's distribution before changing anything else.",
          "If the control board will not respond at all, stop experimenting — repeated flash attempts can make recovery harder. Our repair centre handles control-board and hashboard recovery for customers worldwide, and it is usually cheaper than replacing the machine.",
        ],
      },
    ],
    faqs: [
      { q: "Where do I download WhatsMiner firmware safely?", a: "From MicroBT's own distribution or your supplier. Avoid forum attachments and 'unlocked' images — they are the leading cause of bricked control boards." },
      { q: "Do I need the WhatsMiner tool?", a: "For one or two machines the web interface is enough. Beyond that the tool's batch discovery and configuration save real time and reduce mistakes." },
      { q: "Will custom firmware void my warranty?", a: "Usually yes. Manufacturers and most suppliers treat unofficial images as a warranty exclusion, so weigh the efficiency gain against the coverage you lose." },
      { q: "My miner won't come back after an update. What now?", a: "Reflash the known-good official image for your exact model and revision. If the control board is unresponsive, stop and send it for board-level repair." },
      { q: "Can firmware make an old miner efficient?", a: "Undervolting helps a little, but it cannot close a generational efficiency gap. Buy hardware on measured joules per terahash, not on tuning promises." },
    ],
    match: { brands: ["MicroBT", "Bitmain"], terms: ["whatsminer"] },
    readMinutes: 8,
  },
  {
    slug: "1000-th-s-bitcoin-mining-what-one-petahash-really-costs",
    title: "1000 TH/s Bitcoin Mining: What One Petahash Really Costs",
    metaTitle: "1000 TH/s Mining: Real Cost of One Petahash | BMD",
    category: "Profitability",
    categoryId: "profit",
    date: DATE,
    description:
      "What it takes to run 1000 TH/s: how many machines, kilowatts and dollars, plus payback math at four power rates and the mistakes that wreck petahash builds.",
    keywords: ["1000th/s", "1000 th/s bitcoin miner", "petahash mining", "1 ph/s mining", "bitcoin mining hashrate"],
    intro: [
      "A thousand terahash — one petahash — is the round number where hobby mining becomes a small operation. It is also where the interesting costs stop being the machines and start being power, cooling, space and someone to maintain it all.",
      "This guide breaks a 1000 TH/s build into its real components: how many units it takes depending on the hardware you choose, the electrical load that follows, and what payback looks like at four different power rates. The point is to size the project honestly before any hardware is ordered.",
    ],
    sections: [
      {
        h2: "How Many Machines Make a Petahash",
        paras: [
          "The machine count falls out of arithmetic: divide 1000 by the per-unit terahash. Current flagship air units get you there in a handful of machines; mid-generation hardware needs roughly twice as many; older stock can need dozens. Every extra chassis adds a breaker, a rack slot, airflow and one more thing that can fail.",
          "Fewer, more efficient machines almost always beat many cheap ones at this scale, because the hidden costs — circuits, space, labour, spares — scale with unit count rather than with hashrate.",
        ],
      },
      {
        h2: "The Electrical Load Nobody Budgets For",
        paras: [
          "Multiply your chosen unit's wall watts by the machine count to get the continuous load, then add roughly ten to fifteen percent for fans, pumps, networking and derating. A petahash of current hardware typically lands in the low tens of kilowatts; a petahash of old hardware can be several times that.",
          "Then check what your service can actually deliver. Panel capacity, transformer size and utility approval are the real gate on most builds, and upgrades are measured in months and five-figure sums, not in weekend work.",
        ],
      },
      {
        h2: "Capital Cost: Hardware Is Only Part of It",
        paras: [
          "Price hardware on delivered dollars per terahash including freight and duty, then add the infrastructure line items: breakers and wiring, PDUs, racks or shelving, ventilation or a hydro loop, sound treatment, network gear and monitoring.",
          "For a first build, expect infrastructure to add a meaningful fraction on top of hardware. Operators who skip this line are the ones whose machines sit in boxes waiting on an electrician.",
        ],
      },
      {
        h2: "Payback at Four Power Rates",
        paras: [
          "Run the model at four cents, eight cents, twelve cents and sixteen cents per kilowatt-hour using your own hardware figures and current network difficulty. The pattern is consistent: at four cents almost any efficient machine returns capital in a reasonable window; at sixteen cents only the most efficient current hardware has a path, and older units lose money every hour.",
          "Use a delivered rate from an actual bill, not a headline tariff, and re-run the model with difficulty growth assumptions. A forecast that assumes today's difficulty forever is not a forecast.",
        ],
      },
      {
        h2: "Self-Host or Colocate",
        paras: [
          "At one petahash, hosting is a genuine competitor to building. A facility supplies the power contract, cooling, security and hands-on maintenance for a per-kilowatt-hour or per-machine fee, and you keep ownership of the hardware and its resale value.",
          "Build your own when you have cheap power, suitable space and time. Host when your power is expensive, your site is residential, or your time is worth more than the margin you would save.",
        ],
      },
      {
        h2: "The Mistakes That Wreck Petahash Builds",
        paras: [
          "The recurring ones: undersized heat rejection that only bites in summer, breakers loaded to their rating, no spare PSUs or fans on the shelf, no monitoring or alerts, and mixed firmware versions nobody can support.",
          "Fix all five before scaling. Uptime is the metric that actually determines the return on a build this size, and each of those five failures costs days of hashing that you never get back.",
        ],
      },
    ],
    faqs: [
      { q: "How many miners do I need for 1000 TH/s?", a: "Divide 1000 by the per-unit terahash of your chosen model. Current flagships need only a handful; older hardware can need dozens, with all the extra circuits and maintenance that implies." },
      { q: "How much power does one petahash use?", a: "Multiply unit wall watts by machine count and add ten to fifteen percent for auxiliaries. Efficient current hardware lands in the low tens of kilowatts; old hardware, far more." },
      { q: "Is 1000 TH/s profitable?", a: "It depends almost entirely on your delivered power rate and hardware efficiency. Model it at four, eight, twelve and sixteen cents per kilowatt-hour before committing." },
      { q: "Should I host instead of building?", a: "At this size hosting is competitive: the facility carries power, cooling and maintenance while you keep hardware ownership and resale value." },
      { q: "What is the biggest hidden cost?", a: "Electrical work and heat rejection. Both are quoted in months and large sums, and both are discovered too late by first-time builders." },
    ],
    match: { brands: ["Bitmain", "MicroBT"], terms: ["s21", "whatsminer"] },
    readMinutes: 9,
  },
  {
    slug: "bitforge-nano-and-small-home-miners-compared",
    title: "BitForge Nano and Small Home Miners Compared",
    metaTitle: "BitForge Nano vs Small Home Miners | BMD",
    category: "Hardware Rankings",
    categoryId: "rank",
    date: DATE,
    description:
      "How BitForge Nano class desktop miners compare on hashrate, watts, noise and price, what they realistically earn, and when to step up to a full-size ASIC.",
    keywords: ["bitforge nano", "home bitcoin miner", "desktop asic miner", "low power bitcoin miner", "quiet bitcoin miner"],
    intro: [
      "Small desktop miners like the BitForge Nano class exist for a different reason than industrial ASICs. They draw tens of watts instead of thousands, sit quietly on a desk, and are bought to learn, to hold a lottery ticket on a solo block, or to keep a wallet address hashing at home rather than to generate income.",
      "This guide sets expectations honestly: what these machines produce, how to compare the various small units on the market, what they cost to run, and the point at which you should stop buying nano hardware and buy one real miner instead.",
    ],
    sections: [
      {
        h2: "What Desktop Miners Are Actually For",
        paras: [
          "A nano-class miner contributes a tiny fraction of network hashrate, so pooled earnings are measured in cents per day at best. The genuine value is educational and experimental: you learn pools, stratum settings, firmware, monitoring and temperature behaviour on a device that costs pennies an hour to run.",
          "The other honest use case is solo lottery mining, where you point the device at a solo pool and accept an extremely small chance of a full block reward. It is entertainment with a positive tail, not an investment plan.",
        ],
      },
      {
        h2: "How to Compare the Small Units",
        paras: [
          "Compare four things: hashrate in gigahash or terahash, wall watts, noise, and price. Then compute joules per terahash exactly as you would for a full-size machine — some desktop units are surprisingly inefficient, others are respectable for their size.",
          "Also weigh openness. Devices with active open-source firmware communities get monitoring, solo-pool support and bug fixes long after the seller has moved on, which matters more on niche hardware than a few percent of hashrate.",
        ],
      },
      {
        h2: "Power, Noise and Where They Live",
        paras: [
          "Most desktop miners run from a standard household outlet with a USB-C or small DC supply, drawing anywhere from a few watts to around a hundred. That is why they work in a home office where a full ASIC never could.",
          "Noise is the other reason. A small fan is a background hum rather than the 70-plus decibels of an air-cooled industrial unit. If the machine must live in a room where people talk, this class is the only realistic option.",
        ],
      },
      {
        h2: "What They Realistically Earn",
        paras: [
          "On a pool, expect pocket change — enough to watch payouts arrive and confirm your configuration works. Do not model a payback period; treat the purchase as a fixed cost for learning and a small ongoing electricity expense.",
          "Solo mining changes the shape but not the expected value. Your odds scale with your share of network hashrate, which for a desktop device is minute. Enjoy it as a lottery ticket that also teaches you the stack.",
        ],
      },
      {
        h2: "Buying Checks",
        paras: [
          "Small-brand hardware carries more risk than a Bitmain or MicroBT unit: shorter support life, thinner documentation, and warranty terms that may be one person's goodwill. Ask what happens if the board fails in month two, and buy from a seller who answers that question in writing.",
          "Confirm what is in the box — power supply, cable, cooling — and that the firmware is a version you can actually reflash. A device you cannot reflash is a device you cannot fix.",
        ],
      },
      {
        h2: "When to Step Up to a Real Miner",
        paras: [
          "The moment your goal shifts from learning to earning, the calculation changes completely. One efficient full-size ASIC outproduces any practical stack of desktop units and costs far less per terahash, provided you can supply 240 volts and somewhere to put the heat and noise.",
          "If you cannot, hosting is the bridge: buy an industrial machine, run it in a facility at a fixed power rate, and keep the desktop unit at home for tinkering. We bench-test and condition-grade every full-size unit we ship and quote delivered prices from Hong Kong.",
        ],
      },
    ],
    faqs: [
      { q: "How much does a BitForge Nano class miner earn?", a: "On a pool, cents per day. These devices are bought for learning and solo lottery mining, not for income." },
      { q: "Can it run on a normal household outlet?", a: "Yes. Desktop miners typically draw from a few watts to around a hundred and run from a small USB-C or DC supply." },
      { q: "Is solo mining with one worth trying?", a: "As entertainment, yes. Your chance of a block scales with your share of network hashrate, which is tiny, so treat it as a lottery ticket." },
      { q: "How do I compare two small miners?", a: "Use hashrate, wall watts, joules per terahash, noise and price — plus whether an active firmware community supports the device." },
      { q: "When should I buy a full-size ASIC instead?", a: "As soon as earning is the goal and you can supply a dedicated 240 V circuit with somewhere to dump heat and noise, or you are willing to host." },
    ],
    match: { terms: ["home", "low power", "desktop"] },
    readMinutes: 7,
  },
  {
    slug: "speed-miner-power-miner-and-monzbit-brands-explained",
    title: "Speed Miner, Power Miner and Monzbit Brands Explained",
    metaTitle: "Speed Miner, Power Miner, Monzbit Explained | BMD",
    category: "Buying Guides",
    categoryId: "buy",
    date: DATE,
    description:
      "What Speed Miner, Power Miner and Monzbit actually are, how to tell a manufacturer from a reseller or clone, and how to vet a smaller mining brand before paying.",
    keywords: ["speed miner", "power miner", "monzbit", "asic miner brands", "buy asic"],
    intro: [
      "Search any mining term for long enough and you meet names like Speed Miner, Power Miner and Monzbit. Some are legitimate resellers, some are hosting or repair outfits, some are storefronts built around rebadged hardware, and a few are pure scam pages. Telling them apart is a skill worth ten minutes before every purchase.",
      "This guide explains what these brand names usually turn out to be, how to distinguish a chip manufacturer from a reseller or a clone, and the specific checks that separate a real supplier from a website. It is intentionally not a list of accusations — it is a method you can apply to any name you find.",
    ],
    sections: [
      {
        h2: "Three Kinds of Name in Mining",
        paras: [
          "There are only a handful of real ASIC manufacturers designing SHA-256 silicon. Everything else falls into two groups: resellers who buy from those manufacturers and sell on, and rebadgers who put a new label on someone else's board or on refurbished hardware.",
          "None of those is automatically bad. A good reseller adds testing, warranty, freight and support you would not get direct. The problem is a rebadger presenting itself as a manufacturer, because you cannot then evaluate what you are actually buying.",
        ],
      },
      {
        h2: "How to Identify What You're Dealing With",
        paras: [
          "Look for the chip origin. A genuine manufacturer publishes its own silicon generations and firmware; a reseller lists other companies' models; a rebadger shows model names that appear nowhere else and specifications that suspiciously mirror a known unit.",
          "Reverse-search the product photos. Stock images lifted from a manufacturer's press kit, or the same photo appearing under three different brand names, tells you the whole story in about a minute.",
        ],
      },
      {
        h2: "The Vetting Checklist That Matters",
        paras: [
          "Ask for a company registration and a physical address, a phone number a human answers, and a written quote with the delivered price, model, condition grade and warranty terms. Then ask a technical question only an operator could answer — inlet temperature limits, PSU voltage range, what firmware ships installed.",
          "Check payment terms. Crypto-only with no invoice, no company name and pressure to pay today is the standard scam pattern. A real supplier will give you documentation before money moves.",
        ],
      },
      {
        h2: "Red Flags in Listings",
        paras: [
          "Prices far below market for current hardware; efficiency figures better than the best machine on the market; 'in stock, ships today' for models that are genuinely allocated; no serial numbers; no test evidence; and reviews that all appeared in the same week.",
          "Also watch for specification copy-paste errors — a hydro model described with air-cooling fan counts, or watts and terahash that do not divide into the claimed efficiency. Sellers who do not understand the product cannot support it.",
        ],
      },
      {
        h2: "Why the Brand Name Matters Less Than the Terms",
        paras: [
          "Ultimately you are buying two things: a machine and a promise. The machine is defined by measured hashrate, measured wall watts and condition. The promise is defined by warranty scope, who pays return freight, and how repairs are handled.",
          "Get both in writing and the brand behind the storefront becomes a secondary question. Without them, even a famous name on the page gives you nothing to enforce.",
        ],
      },
      {
        h2: "How We Handle It",
        paras: [
          "We sell hardware from the manufacturers that actually make it — Bitmain, MicroBT and the other established names — and we say plainly whether each unit is new, used or refurbished. Every machine is bench-tested before shipping, and the test result is what sets the condition grade.",
          "Prices are quoted delivered from Hong Kong by air freight with tracking, a commercial invoice and full customs paperwork, and our own repair centre handles hashboard and PSU faults afterwards. That is the standard to hold any supplier to, including us.",
        ],
      },
    ],
    faqs: [
      { q: "Is Speed Miner or Power Miner a real manufacturer?", a: "Names like these are almost always resellers, storefronts or rebadgers rather than chip designers. Check whose silicon and firmware the machine actually runs before buying." },
      { q: "What is Monzbit?", a: "Another brand name that appears around mining hardware sales. Vet it the same way as any small supplier: company registration, written quote, warranty terms and test evidence." },
      { q: "How do I spot a rebadged miner?", a: "Model names that appear nowhere else, specs mirroring a known unit, and product photos that reverse-search to another company's press images." },
      { q: "Is buying from a reseller a bad idea?", a: "Not at all. A good reseller adds testing, warranty, freight handling and repair support. The risk is a rebadger pretending to be a manufacturer." },
      { q: "What is the single best protection against a scam?", a: "A written quote naming the model, condition grade, delivered price, warranty scope and return-freight responsibility — before any money moves." },
    ],
    match: { brands: ["Bitmain", "MicroBT"], terms: ["miner"] },
    readMinutes: 8,
  },
];

// --- blog.ts ---
const blogPath = "src/lib/blog.ts";
let blog = readFileSync(blogPath, "utf8");
for (const p of posts) {
  if (blog.includes(`"slug": "${p.slug}"`)) throw new Error("duplicate slug " + p.slug);
  if (blog.includes(`"title": "${p.title}"`)) throw new Error("duplicate title " + p.title);
}
const marker = "];\n\nexport const getPost";
if (!blog.includes(marker)) throw new Error("blog.ts array end marker not found");
const body = posts
  .map((p) => {
    const { metaTitle, ...rest } = p;
    void metaTitle;
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

// --- sitemap ---
const smPath = "public/sitemap-blog.xml";
let sm = readFileSync(smPath, "utf8");
const entries = posts
  .map(
    (p) =>
      `  <url><loc>https://bitcoinminingdepot.net/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
  )
  .join("\n");
sm = sm.replace("</urlset>", `${entries}\n</urlset>`);
writeFileSync(smPath, sm);

console.log("added", posts.length, "posts");
