/**
 * One-off content-quality fix: removes 6 blog posts that were near-duplicates
 * of a richer existing post on the same exact topic (title differed by a
 * single word, or the same model/guide covered twice), and rewrites 17
 * standalone posts that shared a templated, topic-irrelevant body (the
 * "real pricing, efficiency in J/TH..." batch) with genuine, topic-specific
 * content matching the rest of the library's quality bar.
 *
 * Operates on the real data structures (import + rebuild), not text splicing,
 * so there's no risk of bracket/line mismatches on the 2MB blog.ts file.
 * Run with: bun scripts/fix-thin-content-2026-09.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { BLOG_POSTS, type BlogPost } from "../src/lib/blog";
import { BLOG_INDEX, type BlogIndexEntry } from "../src/lib/blog-index";

const DATE = "2026-09-16";

// slug of the thin duplicate -> slug of the richer post it duplicates.
// The thin one is removed and 301-redirected to the rich one.
const REDIRECTS: Record<string, string> = {
  "antminer-daily-profit-how-to-calculate-it-correctly": "antminer-daily-profit-how-to-compute-it-correctly",
  "antminer-l5-profitability-is-the-old-scrypt-unit-viable": "antminer-l5-profitability-legacy-scrypt-economics",
  "antminer-d9-profitability-dash-mining-returns-modelled": "antminer-d9-profitability-and-x11-hardware-outlook",
  "antminer-l7-9050-profitability-litecoin-doge-returns": "antminer-l7-9050-profitability-full-cost-model",
  "used-asic-miner-buying-guide-grades-tests-and-prices": "used-asic-miner-buying-guide-inspection-pricing-and-risk",
  "antminer-l9-for-sale-tested-units-price-and-warranty": "antminer-l9-for-sale-availability-and-pricing",
};

interface Rewrite {
  slug: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  intro: string[];
  sections: { h2: string; paras: string[] }[];
  faqs: { q: string; a: string }[];
  readMinutes: number;
}

const REWRITES: Rewrite[] = [
  {
    slug: "used-bitcoin-miners-how-to-buy-tested-second-hand-asics",
    metaTitle: "Used Bitcoin Miners: Where to Buy Tested Units | BMD",
    description:
      "Where used bitcoin miners actually come from, the sourcing channels worth trusting, and a condensed verification checklist before you pay for second-hand hardware.",
    keywords: ["used bitcoin miners", "used bitcoin miner for sale", "second hand bitcoin asic", "buy used bitcoin miner", "tested used asic"],
    intro: [
      "\"Used bitcoin miner\" covers everything from a carefully load-tested unit from a fleet upgrade to a dust-caked machine pulled from a shed and sold as-is. The hardware itself isn't the risk — the sourcing channel and the seller's honesty about condition are. Get those two things right and a used SHA-256 ASIC is one of the best value purchases in this market.",
      "This guide is about sourcing specifically: where genuine used inventory actually comes from, which channels tend to be more reliable, and a condensed checklist to run before paying. For the deeper mechanics of inspecting and negotiating an individual unit, see our full used ASIC buying guides — this one focuses on finding the right seller in the first place.",
    ],
    sections: [
      {
        h2: "The Three Real Sources of Used Bitcoin Miners",
        paras: [
          "Most legitimate used bitcoin miners come from one of three places: operators upgrading to a newer generation and liquidating the old fleet, hosting facilities clearing space for new tenants, and specialist resellers who buy those liquidations in bulk, test individually, and resell one unit at a time.",
          "Each source trades price against certainty. A direct fleet liquidation is often cheapest per unit but the least individually verified. A specialist reseller costs more but has already absorbed the testing and grading work, which is worth paying for unless you're comfortable doing it yourself at scale.",
        ],
      },
      {
        h2: "Marketplaces vs. Dedicated Suppliers",
        paras: [
          "General marketplaces (eBay, Facebook groups, classifieds) carry real used bitcoin miners from individual sellers and small resellers, at prices that swing widely because testing and disclosure vary listing to listing. Dedicated mining hardware suppliers charge more but typically bench-test before listing and stand behind a written warranty.",
          "Neither is universally better — a marketplace listing with a documented load test and a responsive, verifiable seller can beat an expensive supplier quote, and vice versa. The deciding factor is always the evidence behind the listing, not which category of seller it came from.",
        ],
      },
      {
        h2: "What a Trustworthy Listing Actually Shows",
        paras: [
          "A seller worth buying from states a specific condition grade with a definition behind it, shows a load-test result — hashrate, hashboards online, temperatures — and discloses any repairs rather than burying them. Current photos of the actual unit, including the label and serial number, matter more than a polished description.",
          "Treat 'powers on, works great' with no test evidence as a starting point for negotiation, not a reason to walk away — it just means the price should reflect the unknowns, and you should plan to test it yourself the moment it arrives.",
        ],
      },
      {
        h2: "Pricing a Used Bitcoin Miner Fairly",
        paras: [
          "Convert every listing to delivered dollars per terahash, including freight, before comparing sellers. Then discount from new-unit pricing by a margin that reflects both the missing warranty and how many generations behind the model is — a recent-generation used unit needs only a modest discount; an old, inefficient one needs a steep one to make sense against current hardware.",
          "Factor in likely repairs — fans, thermal paste, occasionally a hashboard — especially on units with no documented run history, and remember that on lower-value hardware, freight can be a meaningful fraction of the total price.",
        ],
      },
      {
        h2: "The Condensed Pre-Payment Checklist",
        paras: [
          "Before paying: confirm the exact model and hardware revision, get a load-test result showing all hashboards online and hashrate within a few percent of rated, confirm firmware version and overclock history, and get warranty terms in writing including who pays return freight.",
          "If any of those five things is missing from a listing, ask for it directly rather than assuming it's fine. A seller with nothing to hide answers every one of those questions without hesitation.",
        ],
      },
      {
        h2: "Where We Fit In",
        paras: [
          "We source, bench-test and condition-grade used bitcoin miners at our Hong Kong facility, stating plainly what each grade means rather than leaning on vague marketing language. Delivered pricing includes freight and customs paperwork, so the number you're quoted is the number you pay.",
          "If a unit develops a fault after arrival, our repair centre handles hashboard, control board and PSU issues directly — the follow-through that turns a used purchase into a reliable asset instead of a gamble.",
        ],
      },
    ],
    faqs: [
      { q: "Where do the best-value used bitcoin miners come from?", a: "Fleet liquidations from operators upgrading generations, sold either directly or through a specialist reseller who has load-tested and graded them individually." },
      { q: "Is a marketplace listing riskier than buying from a supplier?", a: "Not inherently — the risk is the absence of test evidence and disclosure, which can happen on either channel. Judge the specific listing, not the category of seller." },
      { q: "What's the minimum evidence a listing should provide?", a: "A load test showing all hashboards online and hashrate near rated, current photos of the actual unit, and a stated condition grade with a real definition behind it." },
      { q: "How much should I discount a used price versus new?", a: "Enough to cover the missing warranty and the model's remaining competitive efficiency — a recent-generation unit needs a smaller discount than an old, inefficient one." },
      { q: "What should I do the moment a used miner arrives?", a: "Power it on and run a load test of at least an hour before considering the purchase final, so any problem surfaces while you still have recourse." },
    ],
    readMinutes: 7,
  },
  {
    slug: "used-asic-miners-for-sale-best-value-models-ranked",
    metaTitle: "Used ASIC Miners Ranked by Value | BMD",
    description:
      "Which used ASIC miners actually deliver the best value right now, ranked by delivered dollars per terahash and running cost rather than sticker price alone.",
    keywords: ["used asic miners for sale", "best value used asic", "used asic miner ranking", "cheap used asic miner", "used asic price per terahash"],
    intro: [
      "\"Best value\" in used ASIC hardware isn't the cheapest machine on the page — it's the one that returns the most hashing capacity per dollar spent, including the electricity it will burn for the next few years. Ranking used miners requires holding purchase price, efficiency and remaining useful life in the same frame at once.",
      "This is a ranking by tier rather than a fixed model list, because used inventory and pricing shift constantly. Use the framework below to rank whatever is actually available when you're shopping, and you'll land on the same answer this guide would give for today's exact listings.",
    ],
    sections: [
      {
        h2: "The Ranking Metric That Actually Matters",
        paras: [
          "Rank candidates on delivered dollars per terahash first, then discount that ranking by joules per terahash relative to current hardware. A machine that's cheap per terahash but burns two or three times the electricity of a current model for the same output can rank below a pricier, more efficient alternative once running cost is included.",
          "Run both numbers from your own delivered power rate, not a generic assumption — the ranking genuinely changes between a four-cent and a twelve-cent kilowatt-hour rate, sometimes reversing which tier wins outright.",
        ],
      },
      {
        h2: "Tier One: Recent-Generation Used Units",
        paras: [
          "Used units one or two generations behind current flagships usually rank highest on value for buyers at moderate-to-high power rates. You give up a little peak efficiency for a meaningfully lower purchase price, and the machine still has years of competitive life ahead.",
          "This tier is where most serious buyers should be shopping, provided the unit passes a proper load test and carries some form of warranty or return protection.",
        ],
      },
      {
        h2: "Tier Two: Mid-Generation Value Plays",
        paras: [
          "Three to four generations back, prices drop sharply while efficiency drops more gradually than the price does — which is exactly the gap that creates value. This tier ranks well specifically at low power rates, where the extra electricity cost matters less than the capital saved.",
          "Above roughly eight to ten cents per kilowatt-hour, this tier's ranking usually falls behind Tier One once you run the actual payback math, so don't buy here on price alone without checking your rate first.",
        ],
      },
      {
        h2: "Tier Three: Legacy Hardware",
        paras: [
          "Old, inefficient units rank at the bottom for nearly every buyer, with one exception: genuinely free or curtailed power, where capital cost is the only variable that matters and running cost is close to irrelevant. Outside that specific situation, legacy hardware's ranking rarely survives contact with real electricity bills.",
          "If you're tempted by a legacy unit's low price, run the payback math before buying rather than after — it's the fastest way to tell whether you're looking at a bargain or a slow-motion loss.",
        ],
      },
      {
        h2: "How Condition Grade Shifts a Model's Rank",
        paras: [
          "The same model can rank differently depending on whether it's load-tested and graded or sold as an unknown. A properly graded unit at a modest premium usually outranks an untested 'as-is' unit of the identical model, because the discount on the untested unit rarely compensates for the added risk.",
          "When ranking two listings of the same model, treat the one with real test evidence as the higher-value option even at a somewhat higher price, unless the price gap is large enough to fully cover the risk of a bad unit.",
        ],
      },
      {
        h2: "Putting a Ranking Together for Your Own Shortlist",
        paras: [
          "List your candidates, get rated hashrate and wall watts for each, compute joules per terahash, price each on delivered dollars per terahash, and run payback at your real power rate. Rank by payback period, not by sticker price — that's the number that actually reflects value.",
          "We bench-test and condition-grade every used unit we carry and quote delivered pricing with freight and customs included, so you can rank our stock against any other listing on a true apples-to-apples basis.",
        ],
      },
    ],
    faqs: [
      { q: "What single number should I rank used ASICs by?", a: "Delivered dollars per terahash, adjusted downward for any efficiency disadvantage versus current hardware at your actual power rate — not the sticker price alone." },
      { q: "Does the cheapest used ASIC ever rank best?", a: "Only with very cheap or free power. At typical rates, a somewhat pricier but more efficient unit usually returns capital faster." },
      { q: "How much does condition grading change a model's ranking?", a: "Significantly — a load-tested, graded unit is worth more than an untested one of the identical model, often enough to justify a real price premium." },
      { q: "Should I rank by hashrate or by efficiency?", a: "Efficiency (joules per terahash) matters more for ranking value, since it drives your ongoing cost. Hashrate alone just tells you how big the machine is." },
      { q: "How often does the ranking change?", a: "Whenever your power rate, network difficulty or available listings change meaningfully — re-run the comparison rather than trusting a ranking from months ago." },
    ],
    readMinutes: 7,
  },
  {
    slug: "bitcoin-mining-institute-a-practical-self-taught-curriculum",
    metaTitle: "Bitcoin Mining Institute: Self-Taught Curriculum | BMD",
    description:
      "A structured, self-taught curriculum for learning bitcoin mining from zero — organised into stages with what to study, what to buy, and what to skip at each step.",
    keywords: ["bitcoin mining institute", "bitcoin mining course", "learn bitcoin mining", "bitcoin mining curriculum", "bitcoin mining education"],
    intro: [
      "There's no accredited \"Bitcoin Mining Institute\" handing out diplomas — what actually exists is a body of practical knowledge that operators build stage by stage, usually the hard way, one mistake at a time. This guide organises that knowledge into a curriculum you can follow deliberately instead of learning it in a random order.",
      "It's structured in four stages, each building on the last, with a clear signal for when you're ready to move to the next one. Skip stages at your own risk — most expensive mining mistakes come from buying hardware before finishing stage one.",
    ],
    sections: [
      {
        h2: "Stage One: The Economics, Before You Own Anything",
        paras: [
          "Before touching hardware, learn to calculate daily and monthly profit from four inputs: hashrate, wall watts, your electricity rate, and network difficulty. Practice this calculation on three or four different machines using public specifications until it's automatic, not a lookup.",
          "You're ready for stage two when you can explain, without a calculator in hand, why two machines with the same hashrate can have completely different profitability, and why difficulty growth erodes a fixed machine's output over time.",
        ],
      },
      {
        h2: "Stage Two: Electrical and Site Fundamentals",
        paras: [
          "Learn what a dedicated 200-240 volt circuit actually requires, why household 120V outlets can't run full-size hardware, and how to size a breaker with proper headroom for continuous load. Learn the noise and heat profile of air, hydro and immersion cooling, and which sites tolerate which type.",
          "You're ready for stage three when you can look at any site — garage, spare room, shed, hosted rack — and correctly say what class of hardware it can and can't support, and why.",
        ],
      },
      {
        h2: "Stage Three: Operating a Machine Day to Day",
        paras: [
          "Learn pool selection and configuration, worker naming conventions, firmware update discipline, and the basic diagnostic sequence for a machine that's underperforming: check hashboards online, check temperatures, check pool connection, in that order. Learn what a normal load-test result looks like so you can recognise an abnormal one.",
          "You're ready for stage four when you can set up a new machine end to end — power, network, pool, monitoring — without referring to a guide, and diagnose a common fault from symptoms alone.",
        ],
      },
      {
        h2: "Stage Four: Buying, Selling and Scaling",
        paras: [
          "Learn to vet a seller (company registration, written quote, test evidence, warranty terms), price hardware on delivered dollars per terahash, and plan an exit strategy before you buy rather than after. Learn the difference between building your own site and hosting, and when each makes sense.",
          "This stage never really ends — market conditions, hardware generations and difficulty all keep moving, and staying current is the actual ongoing curriculum once the fundamentals are solid.",
        ],
      },
      {
        h2: "Resources Worth Studying at Each Stage",
        paras: [
          "For stage one, any mining profitability calculator that accepts your own hashrate and wattage inputs. For stage two, manufacturer datasheets and a conversation with a licensed electrician before any real installation. For stage three, the manufacturer's own configuration documentation and forums where real operators troubleshoot in public.",
          "For stage four, actual supplier quotes and used-market listings — there's no substitute for reading real pricing and real seller behaviour once you know what to look for.",
        ],
      },
      {
        h2: "The Fastest Way to Shortcut This Curriculum",
        paras: [
          "Buying from a supplier that bench-tests, condition-grades and documents everything compresses stages two through four considerably, because the verification work that normally takes months of mistakes to learn is already done for you on every unit.",
          "It doesn't replace stage one — you still need to understand the economics yourself — but it removes most of the operational risk while you're still building that judgment. We're set up to be that shortcut: tested hardware, written warranty terms, and a support desk that answers the stage-three questions directly.",
        ],
      },
    ],
    faqs: [
      { q: "Is there an actual accredited bitcoin mining course?", a: "Not in the traditional sense. The knowledge is practical and operator-taught; this curriculum organises it into stages you can follow deliberately instead of learning by accident." },
      { q: "What should I learn first?", a: "The profitability calculation — hashrate, watts, your power rate and network difficulty. Everything else depends on understanding that math first." },
      { q: "How long does this curriculum take?", a: "Stages one and two can be learned in a weekend of focused reading. Stage three takes hands-on time with a real machine. Stage four is ongoing for as long as you keep buying and selling hardware." },
      { q: "Do I need to finish all four stages before buying anything?", a: "At minimum finish stage one — buying before you can calculate profitability is how most people overpay for the wrong machine." },
      { q: "Can buying from a good supplier replace this curriculum?", a: "It shortcuts stages two through four considerably by handling verification and testing for you, but you still need stage one's economics knowledge to know if you're even making a sound purchase." },
    ],
    readMinutes: 8,
  },
  {
    slug: "bitcoin-mining-business-plan-model-costs-and-margins",
    metaTitle: "Bitcoin Mining Business Plan: Costs & Margins | BMD",
    description:
      "How to build a real bitcoin mining business plan: capital costs, operating margins, break-even timing and the scaling stages that separate a hobby from a business.",
    keywords: ["bitcoin mining business plan", "bitcoin mining business model", "start a bitcoin mining business", "mining farm business plan", "bitcoin mining margins"],
    intro: [
      "A bitcoin mining business plan is really just a profitability model with a growth path attached — but most first drafts skip half the real costs and none of the scaling constraints. This guide walks through building one properly: what belongs in the capital and operating columns, how margins actually behave at scale, and the stages a mining business typically moves through.",
      "It's written for someone planning to run this as an actual operation, not a single home machine — the numbers and constraints below only start to matter once you're deciding whether to commit real capital to multiple units.",
    ],
    sections: [
      {
        h2: "Capital Costs: More Than Just Hardware",
        paras: [
          "Hardware is the obvious line item, priced on delivered dollars per terahash including freight and duty. The costs that get missed are electrical infrastructure (panels, breakers, PDUs), cooling or ventilation, racking or shelving, networking and monitoring gear, and — if you're not hosting — the site itself.",
          "For a first build, budget infrastructure as a meaningful fraction on top of hardware cost, not an afterthought. Operators who skip this line are the ones whose machines sit in boxes waiting on an electrician months after purchase.",
        ],
      },
      {
        h2: "Operating Costs and Where Margin Actually Comes From",
        paras: [
          "Electricity is the dominant operating cost by far, followed by pool fees (roughly one to two percent of revenue), maintenance (fans, thermal paste, occasional hashboard replacement), and — if hosted — the facility's per-kilowatt-hour or per-machine fee on top of raw power.",
          "Margin is revenue minus all of that, and it compresses over time even with zero changes on your end, because network difficulty rises as more hashrate joins globally. A business plan that assumes today's margin holds forever isn't a plan — it's a snapshot.",
        ],
      },
      {
        h2: "Modelling Break-Even Honestly",
        paras: [
          "Break-even is the point where cumulative net revenue equals total capital invested. Model it at your real delivered power rate — total bill divided by kilowatt-hours — and re-run it with a conservative difficulty growth assumption, not a flat difficulty that never changes.",
          "Run the model at your actual rate and at rates one and two cents higher, since utility rates change and a plan that only survives at today's exact price is fragile by design.",
        ],
      },
      {
        h2: "How Margins Change With Scale",
        paras: [
          "Per-machine margin doesn't really change with scale — the economics of one miner are the economics of a hundred, machine for machine. What changes is fixed overhead: electrical infrastructure, monitoring, and labour spread across more units, which is why a business at real scale often has better margins per machine than a single home unit once those fixed costs are amortised.",
          "The trade-off is capital intensity and site complexity — scaling requires committing more money upfront and managing a more complex electrical and cooling build, which raises the stakes if the difficulty or price environment shifts against you.",
        ],
      },
      {
        h2: "The Stages a Mining Business Usually Moves Through",
        paras: [
          "Stage one is proving the model on a small number of machines at your actual site and power rate. Stage two is scaling that proven setup within your existing electrical capacity. Stage three is a genuine infrastructure decision — upgrading service capacity, moving to a larger site, or shifting to hosting instead of building further yourself.",
          "Most business plans that fail skip straight from stage one to a large stage-three commitment without the stage-two data to justify it. Prove the model small, then scale deliberately.",
        ],
      },
      {
        h2: "Building the Plan With Real Numbers",
        paras: [
          "Get delivered hardware pricing, real electrical quotes, and your actual utility rate before finalising anything — don't plan against list prices or headline tariffs. We quote delivered pricing from Hong Kong with freight and customs included, and can model expected output for specific machines at your rate so your plan starts from real numbers instead of assumptions.",
          "A plan built on real quotes and a conservative difficulty assumption will disappoint you less than one built on best-case numbers, and it's the only kind that actually survives contact with the first difficulty adjustment.",
        ],
      },
    ],
    faqs: [
      { q: "What's the biggest cost first-time plans usually miss?", a: "Electrical infrastructure and site preparation — panels, breakers, PDUs and cooling — which can add a meaningful fraction on top of hardware cost." },
      { q: "How do margins change as a mining business scales?", a: "Per-machine economics stay roughly flat, but fixed overhead spreads across more units, often improving overall margin — at the cost of higher capital intensity and site complexity." },
      { q: "Should a business plan assume today's difficulty stays constant?", a: "No. Difficulty rises as more global hashrate joins, so a durable plan should model conservative difficulty growth rather than a flat assumption." },
      { q: "What's the safest way to scale a mining business?", a: "Prove the model on a small deployment at your real site and power rate first, then scale within existing capacity before committing to a larger infrastructure upgrade." },
      { q: "What power rate should a business plan use?", a: "Your actual delivered rate from a real utility bill, tested against scenarios one and two cents higher so the plan isn't fragile to a rate change." },
    ],
    readMinutes: 8,
  },
  {
    slug: "what-is-bit-mining-bitcoin-mining-explained-simply",
    metaTitle: "What Is Bit Mining? Bitcoin Mining Explained | BMD",
    description:
      "A plain-language explanation of what bitcoin mining actually is, why it uses electricity to secure the network, and how new bitcoin gets created — no jargon.",
    keywords: ["what is bit mining", "what is bitcoin mining", "bitcoin mining explained simply", "how does bitcoin mining work", "bitcoin mining for beginners"],
    intro: [
      "\"Bit mining\" is a common shorthand for bitcoin mining — the process that both secures the Bitcoin network and creates new bitcoin. If you've never touched cryptocurrency before, the word \"mining\" is genuinely misleading: nothing is dug out of the ground, and there's no physical resource involved at all.",
      "This is the plain-language version, written for someone who has heard the term and wants to actually understand it, not for someone already comfortable with blockchain terminology. No prior knowledge assumed.",
    ],
    sections: [
      {
        h2: "The One-Sentence Version",
        paras: [
          "Bitcoin mining is specialised computers competing to solve a math puzzle roughly every ten minutes; whoever solves it first gets to add the next batch of transactions to Bitcoin's public ledger and receives newly created bitcoin as a reward.",
          "Everything else about mining is detail on top of that one sentence — the hardware, the electricity, the pools, the difficulty adjustments. If you only remember one thing, remember that it's a competition, and computers with more processing power have a proportionally better chance of winning it.",
        ],
      },
      {
        h2: "Why Compete for a Math Puzzle at All",
        paras: [
          "Bitcoin needs an agreed-upon order for transactions, and it needs to prevent anyone from spending the same bitcoin twice. Instead of trusting a bank or company to keep that order, Bitcoin makes computers compete for the right to record it, and rewards the winner — this is called \"proof of work,\" because winning proves you spent real computing effort.",
          "That competition is also what makes the network secure: rewriting Bitcoin's history would require re-winning that competition over and over faster than everyone else combined, which becomes effectively impossible once enough computing power is competing honestly.",
        ],
      },
      {
        h2: "Where the New Bitcoin Actually Comes From",
        paras: [
          "Every time someone wins the competition, the Bitcoin software creates a fixed amount of new bitcoin and gives it to them — this is the only way new bitcoin enters circulation. That reward is cut in half roughly every four years, which is why Bitcoin's total supply is capped and shrinks toward zero new coins over time.",
          "The winner also collects the transaction fees from everyone whose transactions they included in that batch, which is why miners' income has two parts: the fixed new-coin reward and variable transaction fees.",
        ],
      },
      {
        h2: "Why It Takes Special Computers, Not a Laptop",
        paras: [
          "The math puzzle is just a specific type of calculation performed over and over as fast as possible. Specialised chips called ASICs are built to do exactly that one calculation and nothing else, making them thousands of times faster at it than a general-purpose computer chip — which is why mining bitcoin on a laptop today earns essentially nothing.",
          "This specialisation is also why mining hardware can't be repurposed for anything else. An ASIC built for Bitcoin's specific calculation cannot mine a different cryptocurrency that uses a different calculation, and it can't do general computing tasks either.",
        ],
      },
      {
        h2: "Why Individual Miners Join \"Pools\"",
        paras: [
          "Winning the competition alone is now extremely unlikely for any single machine, because so much computing power is competing globally. Pools let many machines combine their computing power, win collectively far more often, and split the reward proportionally — turning an unpredictable jackpot into steady, small, frequent payments.",
          "Almost every miner today, from a single home machine to a large operation, mines through a pool rather than trying to win the competition alone.",
        ],
      },
      {
        h2: "Why Mining Uses So Much Electricity",
        paras: [
          "Because the competition rewards raw calculation speed, and running calculations at high speed on real hardware consumes real electricity — there's no way around that trade-off, and it's intentional. The electricity cost is what makes attacking the network expensive, which is the whole security model working as designed.",
          "This is also why mining profitability comes down almost entirely to your electricity price: the machine's calculation speed is fixed once you buy it, but your power cost determines whether that speed earns more than it costs to run.",
        ],
      },
    ],
    faqs: [
      { q: "Is bitcoin mining actually digging anything up?", a: "No. \"Mining\" is a metaphor. It's specialised computers competing to solve a calculation, with no physical resource involved at all." },
      { q: "Can I mine bitcoin on a normal computer?", a: "Not profitably. Specialised ASIC chips are thousands of times faster at Bitcoin's specific calculation than a general-purpose computer, which has made regular hardware uncompetitive for years." },
      { q: "Where does new bitcoin actually come from?", a: "It's created by the Bitcoin software itself as a reward for winning the mining competition — that's the only way new bitcoin enters circulation." },
      { q: "Why does mining need so much electricity?", a: "The competition rewards raw calculation speed, and speed costs electricity on real hardware. That cost is intentional — it's what makes attacking the network expensive." },
      { q: "What's a mining pool and why does it matter?", a: "A pool combines many machines' computing power to win the competition more often and split the reward proportionally, turning a rare jackpot into steady, predictable payouts." },
    ],
    readMinutes: 6,
  },
  {
    slug: "where-to-mine-bitcoins-home-colocation-or-hosting",
    metaTitle: "Where to Mine Bitcoin: Home vs Colocation vs Hosting | BMD",
    description:
      "Comparing the three real places to run a bitcoin miner — home, colocation and third-party hosting — on cost, control, noise and how each actually fits different buyers.",
    keywords: ["where to mine bitcoins", "bitcoin mining at home", "bitcoin mining colocation", "bitcoin mining hosting", "where to run a bitcoin miner"],
    intro: [
      "Once you've decided to buy a bitcoin miner, the next real decision is where it actually runs — and that choice affects your costs, your noise tolerance, your involvement level and your risk far more than most people expect going in. There are three genuine options: your own home, a colocation facility, and a managed hosting provider.",
      "This guide compares the three directly, on the factors that actually matter for a decision, rather than treating it as an obvious choice. The right answer depends on your site, your power access, and how hands-on you actually want to be.",
    ],
    sections: [
      {
        h2: "Running It at Home",
        paras: [
          "Home mining means you own the site, the power contract and the hardware, with the lowest ongoing cost per machine since there's no facility fee. The trade-off is real: a full-size air-cooled ASIC runs at 70-80 decibels and needs a dedicated 200-240 volt circuit, which rules out most living spaces and many garages without electrical work.",
          "Home mining suits someone with a genuinely separate space — a detached garage, workshop or outbuilding — cheap or moderate power, and the willingness to handle their own maintenance, troubleshooting and noise management.",
        ],
      },
      {
        h2: "Colocation: You Bring the Machine, They Bring the Building",
        paras: [
          "Colocation means renting rack space, power and cooling infrastructure at a facility while you retain full control over the machine's configuration, pool choice and payout wallet — similar to how colocation works for general-purpose servers. You typically pay a per-kilowatt-hour rate plus a space fee, and you (or a technician you hire) still handle hands-on maintenance.",
          "This suits an operator who wants industrial-grade power and cooling without building it themselves, but still wants direct control over the machine rather than handing configuration to someone else entirely.",
        ],
      },
      {
        h2: "Managed Hosting: Full-Service Operation",
        paras: [
          "Hosting goes a step further: the facility handles power, cooling, monitoring and often basic maintenance and troubleshooting as part of the service, typically for a per-kilowatt-hour rate that includes more of the operational burden than colocation does. You still own the hardware and receive the mining revenue, but you're not the one fixing a fault at 2 a.m.",
          "This suits buyers who want the returns of owning hardware without any of the site, noise or hands-on maintenance responsibility — including people who don't have a suitable site at all.",
        ],
      },
      {
        h2: "Comparing the Real Costs",
        paras: [
          "Home has the lowest ongoing fee (no facility markup) but the highest upfront and hidden cost if your site needs electrical work, and the highest personal time cost for maintenance. Colocation and hosting both add a facility fee on top of raw power, but remove the site-buildout cost entirely and reduce or eliminate maintenance burden.",
          "Run the actual numbers for your situation: compare your home electrical-upgrade cost plus your own time against a colocation or hosting quote's all-in rate. For many buyers without an existing suitable site, hosting wins purely on avoided setup cost.",
        ],
      },
      {
        h2: "Noise, Heat and Site Constraints",
        paras: [
          "This is where home mining most often fails in practice: a machine that seemed fine on paper turns out to be intolerable in a space shared with neighbours, family or nearby windows. Colocation and hosting facilities are purpose-built for exactly this heat and noise load, which is the core value they're selling beyond just electricity.",
          "If you're unsure whether your home site can handle a full-size unit, that uncertainty alone is a reason to seriously consider colocation or hosting instead of finding out the hard way after buying hardware.",
        ],
      },
      {
        h2: "Making the Choice",
        paras: [
          "Choose home if you have a genuinely separate, ventilated space, cheap-to-moderate power, and want hands-on control. Choose colocation if you want industrial infrastructure but still want to configure and manage the machine yourself. Choose hosting if you want the returns of ownership with none of the site or maintenance burden.",
          "We can help with all three: if you're buying hardware to host, ask about our hosting programme; if you're buying to run yourself, every unit ships bench-tested with clear setup documentation regardless of where it ends up running.",
        ],
      },
    ],
    faqs: [
      { q: "What's the cheapest place to run a bitcoin miner?", a: "Home, on a per-machine basis, since there's no facility fee — but only if your site can actually support the electrical load, heat and noise without costly upgrades." },
      { q: "What's the difference between colocation and hosting?", a: "Colocation rents you space, power and cooling while you configure and maintain the machine yourself. Hosting typically includes more hands-on maintenance and monitoring as part of the service." },
      { q: "Can I mine bitcoin from an apartment?", a: "Not with a full-size air-cooled ASIC — the noise and power requirements rule that out. A low-power desktop miner is the only realistic apartment option, and it earns very little." },
      { q: "Is hosting worth the extra fee over colocation?", a: "If you don't want to handle maintenance and troubleshooting yourself, yes. If you're comfortable doing that work, colocation's lower fee may be the better value." },
      { q: "How do I decide between all three?", a: "Compare your actual home setup cost and time against colocation and hosting quotes for your specific hardware — the right answer depends entirely on your own site and involvement preference." },
    ],
    readMinutes: 7,
  },
  {
    slug: "all-about-crypto-mining-hardware-coins-and-returns",
    metaTitle: "Crypto Mining Hardware Across Coins Compared | BMD",
    description:
      "A coin-agnostic survey of crypto mining hardware — which algorithms need ASICs, which still use GPUs, and how realistic returns compare across the mineable coin landscape.",
    keywords: ["crypto mining hardware", "crypto mining coins compared", "asic vs gpu mining", "which coins are mineable", "crypto mining returns"],
    intro: [
      "Crypto mining hardware splits along algorithm lines, not brand lines — the machine that mines bitcoin cannot mine most other coins, and the machine that mines Litecoin cannot mine bitcoin. This guide surveys the landscape coin-agnostically: which algorithms dominate the mineable coin space, what hardware each needs, and how realistic returns compare across them.",
      "It's meant as an orientation for someone deciding where to point mining capital, not a deep dive into any single coin — for that, see our model-specific and coin-specific guides once you've picked a lane.",
    ],
    sections: [
      {
        h2: "SHA-256: Bitcoin and Its Merged-Mining Cousins",
        paras: [
          "SHA-256 is Bitcoin's algorithm, fully dominated by ASICs, with the deepest secondary market and the most predictable hardware pipeline of any mineable coin. A handful of smaller SHA-256 coins can be merge-mined alongside bitcoin at effectively no extra cost, adding marginal revenue to an existing bitcoin operation.",
          "This is the default choice for most new entrants because of hardware availability, resale liquidity and the sheer amount of public information available for modelling returns accurately.",
        ],
      },
      {
        h2: "Scrypt: Litecoin and Dogecoin's Merged Pair",
        paras: [
          "Scrypt ASICs mine Litecoin and Dogecoin simultaneously through merged mining, paying out in both coins from the same hashrate. Scrypt hardware is a smaller market than SHA-256 but still mature, with efficient current-generation units available from established manufacturers.",
          "Returns here depend on both coins' combined price and difficulty, which historically has moved somewhat independently of bitcoin — a genuine diversification angle for an operator already holding SHA-256 capacity.",
        ],
      },
      {
        h2: "Equihash and kHeavyHash: Smaller, Specialised Niches",
        paras: [
          "Equihash (Zcash and related coins) and kHeavyHash (Kaspa) each have dedicated ASIC hardware from a small number of manufacturers, with thinner secondary markets and less price history to model against than SHA-256 or Scrypt. Efficiency gains between generations can be dramatic, which also means older units age out of profitability faster.",
          "These niches suit buyers who specifically want exposure to that coin rather than bitcoin, understanding that liquidity — both for the coin and for reselling the hardware later — is thinner than the mainstream algorithms.",
        ],
      },
      {
        h2: "Where GPU Mining Still Survives",
        paras: [
          "GPU mining persists only on algorithms deliberately designed to resist ASIC dominance, or on coins too small or too new to justify ASIC development yet. The trade-off is efficiency: a GPU rig burns far more electricity per unit of output than an ASIC on an algorithm that has one, which caps realistic returns compared to ASIC-mineable coins at the same power rate.",
          "GPU mining's real advantage is flexibility — the same hardware can switch between algorithms and coins as profitability shifts, something no ASIC can do. That flexibility has value for an operator actively managing a portfolio, less so for someone who just wants steady returns.",
        ],
      },
      {
        h2: "Comparing Realistic Returns Across the Landscape",
        paras: [
          "Regardless of algorithm, returns come down to the same four inputs: hashrate, wall power, your electricity rate, and network difficulty for that specific coin. SHA-256 and Scrypt have the most reliable data to model against; smaller niches require more caution because price and difficulty history is thinner and more volatile.",
          "Never assume a smaller coin's headline return figures will hold — they're typically calculated at a snapshot in time and can swing hard with a single large miner joining or leaving that specific network.",
        ],
      },
      {
        h2: "Choosing a Lane",
        paras: [
          "For most buyers, SHA-256 remains the default: deepest market, best information, most predictable hardware pipeline. Scrypt is a reasonable second position for diversification. Equihash, kHeavyHash and other niches suit buyers with specific coin conviction who accept thinner liquidity in exchange for that exposure.",
          "We carry hardware across SHA-256, Scrypt and several smaller algorithms, bench-tested and condition-graded the same way regardless of which coin it mines — talk to us about your specific goal and we'll point you to the right lane rather than the biggest-margin sale.",
        ],
      },
    ],
    faqs: [
      { q: "Can one machine mine multiple different cryptocurrencies?", a: "Only within the same algorithm family, and only via merged mining (like Scrypt's Litecoin/Dogecoin pair). A machine built for one algorithm cannot mine a coin using a different one." },
      { q: "Is bitcoin still the best coin to mine?", a: "For most buyers, yes — it has the deepest hardware market, the most reliable modelling data, and the best resale liquidity of any mineable coin." },
      { q: "Why does GPU mining still exist if ASICs are so much faster?", a: "Only on algorithms specifically designed to resist ASIC dominance, or on coins too new or small for ASIC development yet to make sense." },
      { q: "Are smaller mineable coins riskier to mine?", a: "Generally yes — thinner liquidity for both the coin and the hardware, and less historical data to model returns against reliably." },
      { q: "How do I compare returns across different algorithms fairly?", a: "Use the same four inputs for each — hashrate, wall watts, your power rate, and that coin's network difficulty — rather than comparing headline return percentages from different sources." },
    ],
    readMinutes: 8,
  },
  {
    slug: "all-about-mining-bitcoins-full-beginner-to-operator-guide",
    metaTitle: "Mining Bitcoin: Beginner to Operator Guide | BMD",
    description:
      "The path from buying your first bitcoin miner to running it like an operator — one machine, the decisions that come next, and when to scale up.",
    keywords: ["mining bitcoins guide", "start mining bitcoin", "bitcoin mining for beginners", "become a bitcoin miner", "scaling bitcoin mining"],
    intro: [
      "Most people start mining bitcoin with one machine and a rough idea of what they're doing, and either stop there or gradually become an actual operator without ever deciding to. This guide traces that path deliberately — buying the first machine, the decisions that come immediately after, and the signals that tell you it's time to scale.",
      "It's bitcoin-specific and practical, meant to be read once before you buy anything and referred back to at each stage rather than absorbed all at once.",
    ],
    sections: [
      {
        h2: "Buying the First Machine",
        paras: [
          "Pick one efficient machine sized to what your site can actually support electrically — don't buy the biggest unit on the page before confirming your circuit can carry it. Get rated hashrate and wall watts confirmed in writing, and buy from a seller who bench-tests and states a real warranty.",
          "Resist the urge to buy two or three machines immediately. One machine teaches you everything you need for stage two at a fraction of the capital risk if something about your setup needs adjusting.",
        ],
      },
      {
        h2: "The First Week: Setup and Baseline",
        paras: [
          "Get it on a dedicated circuit, connected by Ethernet, pointed at a pool with a wallet address you control, and confirm it holds rated hashrate for several days straight. This baseline period is where you learn what normal actually looks like for your specific site — temperature, noise, and how the machine behaves as ambient conditions change.",
          "Track daily output against your calculated expectation. A meaningful, sustained gap between expected and actual output is worth investigating now, before you've scaled the same problem across more machines.",
        ],
      },
      {
        h2: "The First Month: Real Cost Tracking",
        paras: [
          "Pull an actual electricity bill covering the mining period and calculate your true delivered power rate, not an assumed one. Recompute profitability with that real number, and be honest with yourself about whether the machine is actually earning what you expected.",
          "This is also when maintenance rhythm starts to matter: check for dust accumulation, confirm fans are running at expected speeds, and get comfortable with the manufacturer's monitoring interface so problems don't sit unnoticed.",
        ],
      },
      {
        h2: "Deciding Whether to Scale",
        paras: [
          "Scale only after the first machine has proven the model at your real power rate over enough time to be confident, not on optimism. The decision to add machines should follow the same math as the first purchase — payback period at your actual costs — not a different, more hopeful calculation.",
          "Check your electrical capacity before adding anything. A second machine on the same circuit as the first, without checking amperage headroom, is the single most common way new operators trip a breaker or damage wiring.",
        ],
      },
      {
        h2: "Becoming a Small Operator",
        paras: [
          "Past two or three machines, treat this like a small operation rather than a hobby: dedicated monitoring with alerts, a maintenance schedule instead of reactive fixes, spare parts on hand (fans, a spare PSU), and a clear record of each machine's performance so you catch a degrading unit early.",
          "This is also the point where hosting becomes worth evaluating seriously if your site's electrical capacity is the binding constraint — moving additional machines to a hosted facility can let you keep scaling without a full electrical upgrade at home.",
        ],
      },
      {
        h2: "What Changes at Real Scale",
        paras: [
          "Beyond a handful of machines, fixed costs — monitoring software, spare inventory, your own time — spread across more units and generally improve your margin per machine versus a single-unit setup, but the electrical and cooling build becomes a genuine capital project rather than a weekend task.",
          "If you reach this point, revisit your whole plan with real infrastructure quotes rather than scaling by simply repeating what worked for one or two machines — the constraints and the economics both shift at that scale.",
        ],
      },
    ],
    faqs: [
      { q: "How many machines should I start with?", a: "One. It teaches you everything needed for the next stage at a fraction of the capital risk if anything about your setup needs adjusting." },
      { q: "How long should I run one machine before scaling?", a: "Long enough to calculate real profitability from an actual electricity bill and confirm the machine performs as expected — typically at least a full billing cycle." },
      { q: "What's the most common mistake when scaling up?", a: "Adding machines to the same electrical circuit without checking amperage headroom first, which is how breakers trip and wiring gets damaged." },
      { q: "When does hosting become worth considering?", a: "Once your site's electrical capacity becomes the constraint on further scaling, rather than your capital." },
      { q: "Does per-machine profitability change as I add more units?", a: "The core economics stay similar, but fixed costs — monitoring, spares, your time — spread across more machines, which can improve overall margin at real scale." },
    ],
    readMinutes: 7,
  },
  {
    slug: "are-all-crypto-coins-mined-proof-of-work-vs-proof-of-stake",
    metaTitle: "Are All Crypto Coins Mined? PoW vs PoS | BMD",
    description:
      "No — most major cryptocurrencies today use proof of stake, not mining. Here's which major coins are actually mined, which aren't, and why the split happened.",
    keywords: ["are all crypto coins mined", "proof of work vs proof of stake", "which cryptocurrencies are mined", "mined vs staked coins", "crypto consensus mechanisms"],
    intro: [
      "No — most cryptocurrencies today aren't mined at all. Mining is specific to \"proof of work\" coins; a large and growing share of the market runs on \"proof of stake\" instead, which secures the network through locked-up coin ownership rather than computing power. Confusing the two is common, and it matters if you're deciding whether buying mining hardware even applies to a coin you're interested in.",
      "This guide draws that line clearly: which major coins are mined, which are staked, and why the split happened in the first place.",
    ],
    sections: [
      {
        h2: "Proof of Work: Security Through Computation",
        paras: [
          "Proof-of-work coins secure their network by having computers compete to solve a calculation, rewarding the winner with newly created coins — this is mining, in the literal sense used throughout this site. Bitcoin, Litecoin, Dogecoin, Monero, Kaspa and Zcash are all proof-of-work coins that are genuinely mined with dedicated hardware.",
          "The defining trait is that security scales with computing power and electricity spent — more honest computing power competing makes the network harder to attack, at the direct cost of real energy consumption.",
        ],
      },
      {
        h2: "Proof of Stake: Security Through Ownership",
        paras: [
          "Proof-of-stake coins secure their network differently: participants lock up (\"stake\") coins they already own as collateral, and are chosen to validate transactions roughly in proportion to how much they've staked, earning rewards for honest participation and risking penalties for misbehaviour. There's no computational race and no mining hardware involved at all.",
          "Ethereum made this exact switch in 2022, moving from proof-of-work mining to proof-of-stake validation — which is why older content mentioning \"mining Ethereum\" describes a method that no longer applies to that network.",
        ],
      },
      {
        h2: "Why the Split Happened",
        paras: [
          "Proof of stake emerged largely as a response to proof of work's energy consumption and the centralisation pressure of specialised mining hardware, offering security without the same electricity cost or the ASIC arms race. Critics of proof of stake argue it can concentrate influence among large coin holders instead, a different but real centralisation concern.",
          "Neither model is objectively superior — they're different trade-offs between energy use, hardware requirements, and how security ties to existing wealth versus computing investment. Different projects have made different bets on which trade-off suits their goals.",
        ],
      },
      {
        h2: "How to Tell Which Type a Coin Is",
        paras: [
          "Check the project's own documentation for the term \"consensus mechanism\" — it will say proof of work, proof of stake, or occasionally a hybrid or variant of either. If a coin markets itself around staking rewards or validator nodes, it's proof of stake; if it markets itself around hashrate and mining hardware, it's proof of work.",
          "Be cautious of outdated articles and old forum posts, since some major coins (Ethereum being the clearest example) switched mechanisms entirely, making pre-2022 mining content about them obsolete.",
        ],
      },
      {
        h2: "What This Means for Buying Hardware",
        paras: [
          "Mining hardware — ASICs or GPUs — is only relevant to proof-of-work coins. There is no hardware to buy for mining a proof-of-stake coin; participation there means acquiring and staking the coin itself, an entirely different capital and risk profile than buying a physical machine.",
          "If you're specifically interested in a proof-of-stake coin, mining guides and mining hardware simply don't apply — you're looking at a staking guide instead, a different topic with different mechanics and different risks.",
        ],
      },
      {
        h2: "Which Major Coins Are Actually Mined Today",
        paras: [
          "Bitcoin, Litecoin, Dogecoin, Monero, Kaspa, Zcash and Dash remain genuinely proof-of-work and mined with dedicated hardware as of today. Ethereum, Cardano, Solana, Polkadot and most newer large-cap chains launched with or switched to proof of stake and are not mined at all.",
          "This list shifts over time as projects evolve, so if you're evaluating a specific coin, check its current consensus mechanism directly rather than assuming based on age or reputation alone.",
        ],
      },
    ],
    faqs: [
      { q: "Is bitcoin proof of work or proof of stake?", a: "Proof of work. Bitcoin is genuinely mined with dedicated hardware and has no plans to change that." },
      { q: "Can I still mine Ethereum?", a: "No. Ethereum switched entirely to proof of stake in 2022; mining hardware no longer applies to it." },
      { q: "Is proof of stake better than proof of work?", a: "They're different trade-offs, not a strict better-or-worse — proof of stake uses far less energy but ties security to existing coin ownership rather than computing investment." },
      { q: "How do I know if a coin is mined or staked?", a: "Check its documentation for \"consensus mechanism.\" It will state proof of work (mined), proof of stake (staked), or a variant of either." },
      { q: "Do I need mining hardware for a proof-of-stake coin?", a: "No. There's no hardware involved in proof of stake at all — participation means staking coins you already hold, not buying a physical machine." },
    ],
    readMinutes: 7,
  },
  {
    slug: "are-all-cryptocurrencies-mined-what-miners-can-earn",
    metaTitle: "What Can Crypto Miners Actually Earn? | BMD",
    description:
      "A realistic survey of what miners actually earn across bitcoin, Litecoin/Dogecoin, Monero and Kaspa — and why headline numbers rarely match real take-home returns.",
    keywords: ["what can crypto miners earn", "crypto mining earnings", "how much do miners earn", "bitcoin mining earnings", "mining income by coin"],
    intro: [
      "Not every cryptocurrency is mined, and among the ones that are, actual earnings vary enormously by coin, hardware efficiency and your electricity rate — headline \"per day\" figures floating around online are almost always stale or best-case. This guide surveys realistic earnings across the coins people most commonly ask about, and explains why the number you'll actually see rarely matches what you read beforehand.",
      "Every figure here should be treated as a snapshot, not a promise — difficulty, price and your own costs move constantly, and the only reliable earnings figure is one you calculate yourself with current numbers.",
    ],
    sections: [
      {
        h2: "The Formula Behind Every Earnings Figure",
        paras: [
          "Whatever the coin, earnings come down to the same calculation: your hashrate's share of total network hashrate, times the coin's reward and fee income, minus your electricity cost and pool fees. Any \"earnings\" number that doesn't disclose the hashrate and difficulty it was calculated at is not useful — it's a snapshot from an unknown moment.",
          "Recompute this weekly if you're tracking seriously, since difficulty rises over time for a fixed machine and quietly erodes output even when nothing else changes.",
        ],
      },
      {
        h2: "Bitcoin: The Most Predictable Earnings Model",
        paras: [
          "Bitcoin has the deepest hashrate, the most mature hardware market, and the most reliable public data for modelling earnings accurately for any specific machine. Earnings scale directly with efficiency — current-generation hardware earns meaningfully more net income than older machines at the same electricity rate, purely from the efficiency gap.",
          "Because so much hashrate already competes for bitcoin, an individual machine's absolute share — and therefore its raw earnings — is small; profitability comes from the gap between that revenue and your specific running cost, not from a large headline number.",
        ],
      },
      {
        h2: "Litecoin and Dogecoin: Merged Earnings",
        paras: [
          "Scrypt miners earn both Litecoin and Dogecoin simultaneously through merged mining from the same hashrate, which effectively combines two coins' reward streams into one earnings figure. This can make Scrypt earnings look larger at a glance, but the combined coin value still has to clear your electricity cost the same way any other coin does.",
          "Scrypt's smaller total network hashrate than bitcoin means an individual machine typically represents a larger share of that network, which can mean steadier, more concentrated earnings relative to Bitcoin's much larger competing hashrate.",
        ],
      },
      {
        h2: "Monero and Privacy-Coin Mining",
        paras: [
          "Monero remains ASIC-resistant by design, meaning CPU and some GPU mining still participate meaningfully — a genuinely different earnings profile than ASIC-dominated coins, generally lower absolute output per dollar of hardware but accessible without specialised equipment.",
          "Earnings here are more sensitive to software efficiency and CPU/GPU model choice than to a single dominant hardware type, which makes generic 'per day' figures for Monero especially unreliable without knowing the exact hardware referenced.",
        ],
      },
      {
        h2: "Kaspa and Newer kHeavyHash Hardware",
        paras: [
          "Kaspa's dedicated ASIC hardware is newer and less standardised than Bitcoin's, with efficiency improving quickly between generations — meaning earnings figures for Kaspa age faster than for more established coins as new, more efficient hardware displaces older units.",
          "Treat any Kaspa earnings figure as valid only for the specific hardware generation it names, and expect the number to compress as newer, more efficient units enter the network.",
        ],
      },
      {
        h2: "Why Your Real Number Will Differ From What You Read",
        paras: [
          "Every published earnings figure is a snapshot at one difficulty, one price and one assumed electricity rate — almost never yours. The only number worth trusting is one you calculate from your own machine's specifications, your own electricity bill, and current network data.",
          "We can model expected earnings for any specific machine we sell against your actual power rate before you buy, which is a far more useful number than any generic figure you'll find published online.",
        ],
      },
    ],
    faqs: [
      { q: "Which cryptocurrency has the most predictable mining earnings?", a: "Bitcoin, because of its deep hashrate history and the most mature public data for modelling any specific machine's expected output accurately." },
      { q: "Why do online 'earnings per day' figures never match reality?", a: "They're snapshots at one specific difficulty, price and electricity rate — almost never yours, and quickly outdated as difficulty rises." },
      { q: "Can I earn from mining without an ASIC?", a: "For ASIC-resistant coins like Monero, yes, with CPU or GPU hardware — though at much lower output per dollar than ASIC-mineable coins." },
      { q: "Do Litecoin and Dogecoin earnings combine?", a: "Yes — Scrypt miners earn both simultaneously through merged mining from the same hashrate." },
      { q: "How often should I recalculate expected earnings?", a: "Weekly at minimum, since network difficulty rises over time and silently reduces a fixed machine's output even when nothing else changes." },
    ],
    readMinutes: 7,
  },
  {
    slug: "are-all-cryptos-mined-mineable-coins-worth-hardware",
    metaTitle: "Which Mineable Coins Are Worth the Hardware? | BMD",
    description:
      "Not every mineable coin justifies buying dedicated hardware. A practical filter for deciding which mineable coins are actually worth the capital today.",
    keywords: ["mineable coins worth hardware", "is crypto mining worth it", "which coins worth mining", "best coins to mine", "mineable cryptocurrency list"],
    intro: [
      "Being mineable isn't the same as being worth mining — plenty of proof-of-work coins exist with too little liquidity, too little price stability, or too thin a hardware market to justify buying dedicated equipment for. This is a practical filter for the buying decision specifically: given that a coin CAN be mined, should you actually put capital into hardware for it?",
      "The answer depends on four things: hardware availability and resale value, liquidity to actually sell what you earn, price and difficulty stability, and whether your electricity rate clears the specific coin's economics. Walk through all four before buying anything.",
    ],
    sections: [
      {
        h2: "Filter One: Does Real Hardware Exist for It?",
        paras: [
          "If a coin has no dedicated ASIC and relies on GPU mining against a resistant algorithm, your hardware doubles as general-purpose equipment with resale value beyond that one coin — a genuine advantage if the coin underperforms. If it has dedicated ASIC hardware, check how many manufacturers make it; a single-manufacturer niche coin means thinner resale and less competitive pricing.",
          "Coins with no meaningful hardware market at all — announced but never actually supported by real manufacturers — aren't a hardware decision yet; they're speculation on a market that doesn't exist.",
        ],
      },
      {
        h2: "Filter Two: Can You Actually Sell What You Earn?",
        paras: [
          "Mining a coin you can't easily convert to cash or a more liquid asset is a paper return, not a real one. Check daily trading volume on major exchanges for the specific coin — thin volume means your mined output could move the price against you just by selling it, or worse, sit illiquid when you actually need to cash out.",
          "Bitcoin, Litecoin, Dogecoin and a handful of others clear this filter easily. Many smaller mineable coins do not, regardless of how attractive their mining economics look on paper.",
        ],
      },
      {
        h2: "Filter Three: How Stable Is the Difficulty and Price History?",
        paras: [
          "A coin with a long, relatively stable difficulty growth curve is far easier to model reliably than one prone to sudden hashrate spikes or drops, which can happen when a large miner enters or exits a smaller network abruptly. Check historical difficulty charts, not just current difficulty, before committing capital.",
          "Newer or smaller coins are more prone to this volatility simply because a single large participant represents a bigger share of total network hashrate — the same absolute hashrate swing matters far more on a small network than a large one.",
        ],
      },
      {
        h2: "Filter Four: Does the Electricity Math Actually Clear?",
        paras: [
          "This filter is identical regardless of coin: hashrate, wall watts, your electricity rate, and current difficulty determine whether the coin's specific reward and fee structure clears your running cost. A coin can pass every other filter and still fail here if its current price-to-difficulty ratio is simply unfavourable.",
          "Run this calculation last, after confirming the first three filters, since there's no point modelling profitability for a coin with no viable hardware or no liquid market to sell into.",
        ],
      },
      {
        h2: "Coins That Generally Clear All Four Filters",
        paras: [
          "Bitcoin, Litecoin and Dogecoin (via merged mining), and — with somewhat more caution on liquidity and hardware market depth — Kaspa and Monero, generally clear all four filters for most buyers today. This isn't a permanent list; markets and hardware availability shift.",
          "Beyond these, evaluate case by case using the four filters above rather than trusting a static ranking, since smaller mineable coins can shift from viable to unviable (or the reverse) faster than the mainstream ones.",
        ],
      },
      {
        h2: "How We Can Help With This Decision",
        paras: [
          "We carry hardware across several of the coins that reliably clear these filters, bench-tested and condition-graded the same way regardless of algorithm. If you're considering a coin we don't stock, we can usually still tell you honestly whether it's likely to clear these four filters before you spend money elsewhere.",
          "The goal is matching your capital to a coin whose mining economics you can actually verify, not the coin with the most exciting marketing this month.",
        ],
      },
    ],
    faqs: [
      { q: "What's the biggest reason a mineable coin isn't worth hardware?", a: "Usually thin liquidity — you can mine it, but can't easily sell what you earn without moving the price against yourself." },
      { q: "Is a coin with dedicated ASIC hardware always a safe bet?", a: "Not automatically — check how many manufacturers make that hardware and how deep the resale market is before assuming it's a safe purchase." },
      { q: "Why does difficulty stability matter for the buying decision?", a: "A volatile difficulty history makes modelling future returns unreliable, since a single large miner entering or leaving a small network can swing your expected output significantly." },
      { q: "Should I check profitability before or after checking liquidity?", a: "After. There's no point calculating profitability for a coin you can't actually convert your earnings out of." },
      { q: "Does this list of viable coins change over time?", a: "Yes — re-run all four filters periodically rather than trusting a static list, since hardware markets and coin liquidity both shift." },
    ],
    readMinutes: 7,
  },
  {
    slug: "are-bitcoins-mined-how-new-btc-enters-circulation",
    metaTitle: "How New Bitcoin Enters Circulation | BMD",
    description:
      "Yes, bitcoin is mined — here's exactly how new BTC enters circulation, the halving schedule, the 21 million cap, and what happens when block rewards eventually end.",
    keywords: ["are bitcoins mined", "how new bitcoin is created", "bitcoin halving explained", "bitcoin 21 million cap", "bitcoin block reward"],
    intro: [
      "Yes — every bitcoin in existence was created through mining, and mining remains the only mechanism by which new bitcoin enters circulation. There is no other issuance method, no founder allocation still being released, and no central authority that can create more. This guide explains exactly how that issuance works, on a fixed and fully predictable schedule.",
      "Understanding this schedule matters beyond trivia — it directly explains why bitcoin's supply is capped, why mining rewards shrink over time, and what that means for the mining business model decades from now.",
    ],
    sections: [
      {
        h2: "The Coinbase Transaction: Where New BTC Is Actually Created",
        paras: [
          "Every roughly ten minutes, the miner who wins that round's competition includes a special transaction — called the coinbase transaction — at the start of the new block, paying themselves a fixed amount of brand-new bitcoin. This is literally the only place in the entire system where bitcoin is created from nothing; every other transaction just moves existing bitcoin between addresses.",
          "The winning miner also collects the transaction fees from everyone else's transactions included in that same block, but the coinbase transaction's new-coin portion is separate from those fees and is what people mean by \"the block reward.\"",
        ],
      },
      {
        h2: "The Halving: Why the Reward Shrinks on a Schedule",
        paras: [
          "The new-coin reward started at 50 bitcoin per block in 2009 and cuts exactly in half every 210,000 blocks — roughly every four years — a rule written directly into Bitcoin's code that no one can change without near-universal agreement across the network. This event is called \"the halving,\" and it has already happened multiple times, each time permanently reducing new supply growth.",
          "Because the halving is scheduled by block count rather than calendar date, its exact timing shifts slightly based on how fast blocks are actually found, but it has never missed its programmed target by more than a few days across Bitcoin's history.",
        ],
      },
      {
        h2: "Why the Total Supply Is Capped at 21 Million",
        paras: [
          "Because the reward keeps halving indefinitely rather than continuing at a fixed rate, the total amount of bitcoin that will ever be created converges toward a fixed ceiling — 21 million coins — rather than growing forever. No new rule needs to trigger this; it's simply the mathematical result of a reward that keeps cutting in half.",
          "The vast majority of that 21 million cap has already been mined, since the earliest halvings released the largest absolute amounts of new bitcoin. The remaining unmined supply is a small and shrinking fraction of the total.",
        ],
      },
      {
        h2: "What Happens When Block Rewards Eventually End",
        paras: [
          "Once the new-coin reward eventually rounds down to zero — projected for around the year 2140, after enough halvings — miners will earn only from transaction fees, not from newly created bitcoin. Whether that fee income alone will be enough to sustain mining security at that point is a genuinely open question that depends heavily on Bitcoin's transaction volume and fee market by then.",
          "This transition is far enough in the future that it has no bearing on mining economics today, but it's the honest answer to \"what happens after all 21 million are mined\" — mining doesn't necessarily stop, but its economics change fundamentally.",
        ],
      },
      {
        h2: "Why This Schedule Is Considered Trustworthy",
        paras: [
          "The issuance schedule is enforced by every participant's software independently verifying every block, not by trusting a company or government to honour a promise. Changing it would require convincing the overwhelming majority of the network to run different software simultaneously, which has never happened and is deliberately difficult by design.",
          "This is the core reason bitcoin's fixed supply is treated as credible rather than as a marketing claim — it's mathematically enforced by the same distributed verification that secures every transaction, not stated policy that could quietly change.",
        ],
      },
      {
        h2: "How This Connects to Mining Economics Today",
        paras: [
          "Every halving cuts a miner's new-coin revenue in half overnight without warning changing anything else — hardware, electricity cost and difficulty all stay wherever they were. This is exactly why efficiency matters so much for surviving a halving: only operators with a low enough cost per unit of output remain profitable after the reward drops.",
          "If you're mining bitcoin specifically, understand where the next halving falls and model your hardware's economics against a post-halving reward, not just today's — it's the single most predictable disruption in this entire industry.",
        ],
      },
    ],
    faqs: [
      { q: "Is bitcoin actually mined, or was it all created at launch?", a: "It's mined continuously — every bitcoin in existence, from the very first block to today, was created through the mining process. None of it was pre-allocated at launch." },
      { q: "What is the bitcoin halving?", a: "A scheduled event, roughly every four years, that cuts the new-coin mining reward exactly in half. It's written directly into Bitcoin's code." },
      { q: "Why is bitcoin's supply capped at 21 million?", a: "Because the reward keeps halving indefinitely rather than staying fixed, total issuance mathematically converges toward that ceiling rather than growing forever." },
      { q: "What happens to miners after all 21 million bitcoin are mined?", a: "They'll earn only from transaction fees rather than newly created coins — a transition projected for around the year 2140." },
      { q: "Can the bitcoin issuance schedule be changed?", a: "Only if the overwhelming majority of the network agreed to run different software simultaneously, which has never happened and is deliberately difficult." },
    ],
    readMinutes: 7,
  },
  {
    slug: "bitdeer-sealminer-a2-pro-hydro-specs-price-comparison",
    metaTitle: "Bitdeer SealMiner A2 Pro Hydro Specs & Price | BMD",
    description:
      "What the Bitdeer SealMiner A2 Pro Hydro actually offers: specs to confirm before buying, realistic pricing, and how it compares against Bitmain and MicroBT hydro units.",
    keywords: ["bitdeer sealminer a2 pro hydro", "sealminer a2 pro", "bitdeer sealminer specs", "bitdeer sealminer price", "bitdeer hydro miner"],
    intro: [
      "Bitdeer's SealMiner line is a newer entrant in the hydro-cooled ASIC space, built by a company better known for its own mining operations and cloud hashrate products than for hardware sales — which makes buyers reasonably cautious about specs, support and resale value compared to Bitmain or MicroBT's longer track record.",
      "This guide covers the A2 Pro Hydro specifically: what to confirm before paying, realistic pricing against the established hydro competition, and where a newer manufacturer's hardware genuinely fits versus where the established names still win on certainty.",
    ],
    sections: [
      {
        h2: "Who Bitdeer Is and Why That Matters",
        paras: [
          "Bitdeer is primarily a large-scale mining and hosting operator that has expanded into designing and selling its own hardware, a different starting point than Bitmain or MicroBT, whose core business has always been chip design and manufacturing. That history doesn't disqualify the hardware, but it does mean a shorter public track record for support, firmware updates and long-term parts availability.",
          "Weigh that history explicitly against the deal in front of you — a newer manufacturer can absolutely make good hardware, but the risk profile around long-term support is different than buying from a company that has shipped ASICs for a decade.",
        ],
      },
      {
        h2: "Specs to Confirm Before You Pay",
        paras: [
          "Get rated hashrate, wall watts, inlet temperature window and required flow rate in writing directly from the seller, then calculate joules per terahash yourself rather than trusting a headline efficiency figure. As with any hydro unit, confirm firmware version and whether the specific unit has run overclocked.",
          "Because this is newer, lower-volume hardware compared to Bitmain or MicroBT's mainstream lines, ask specifically what happens if a hashboard or the pump fails — parts availability and repair turnaround matter more here than on an established, high-volume model.",
        ],
      },
      {
        h2: "Hydro Infrastructure Requirements",
        paras: [
          "Like any hydro-cooled ASIC, the A2 Pro Hydro needs a closed loop with a manifold, quick-disconnect couplings, a pump with redundancy, a dry cooler sized to your total kilowatts, and treated coolant — this is infrastructure cost on top of the machine itself, not a plug-and-play unit.",
          "If you don't already have a hydro loop built, budget that cost alongside the hardware and don't judge the machine's price in isolation from the infrastructure it requires.",
        ],
      },
      {
        h2: "Pricing Against Bitmain and MicroBT Hydro",
        paras: [
          "Price the A2 Pro Hydro on delivered dollars per terahash and compare directly against current Bitmain S21-class and MicroBT M-series hydro units at the same efficiency tier. A newer manufacturer sometimes prices somewhat below the established names to compensate for the shorter track record — treat that discount as fair compensation for the added uncertainty, not as free value.",
          "If the discount doesn't feel large enough to offset the support and resale risk versus an established name, that's a legitimate reason to choose the established option instead, even at a higher sticker price.",
        ],
      },
      {
        h2: "Resale and Long-Term Support Considerations",
        paras: [
          "Newer manufacturer hardware typically has a thinner resale market than Bitmain or MicroBT equivalents, simply because fewer units are in circulation and buyers are less familiar with the brand. Factor that into your exit planning if you intend to sell the hardware in a few years rather than run it to end of life.",
          "Ask directly about firmware update cadence and whether spare hashboards or pumps are stocked for this specific model — a newer manufacturer with a thin parts pipeline can turn a routine repair into a long wait.",
        ],
      },
      {
        h2: "Who Should Consider This Machine",
        paras: [
          "The A2 Pro Hydro suits a buyer who has done the diligence above, is comfortable with a shorter manufacturer track record in exchange for the pricing or specific specs on offer, and already has (or is building) proper hydro infrastructure to run it in.",
          "If you'd rather not carry that manufacturer-risk question at all, an equivalent Bitmain or MicroBT hydro unit is the lower-uncertainty choice at a similar efficiency tier. We carry hydro hardware across established and newer manufacturers, bench-tested and condition-graded the same way regardless of brand, and we'll tell you plainly where a newer name is a reasonable bet versus where it isn't.",
        ],
      },
    ],
    faqs: [
      { q: "Is Bitdeer a hardware manufacturer or a mining operator?", a: "Primarily a large mining and hosting operator that has expanded into designing and selling its own ASIC hardware, a shorter track record than Bitmain or MicroBT." },
      { q: "Does the SealMiner A2 Pro Hydro need special infrastructure?", a: "Yes — a full hydro loop with a manifold, pump redundancy and a properly sized dry cooler, the same as any hydro-cooled ASIC." },
      { q: "Is it cheaper than equivalent Bitmain or MicroBT hydro units?", a: "Often somewhat, to compensate for the shorter manufacturer track record — compare on delivered dollars per terahash and judge whether the discount offsets the added uncertainty for you." },
      { q: "What's the biggest risk with a newer manufacturer's hardware?", a: "Thinner parts and resale markets — ask specifically about spare-part availability and repair turnaround before buying." },
      { q: "Who should choose an established brand instead?", a: "Buyers who want the lowest possible uncertainty around long-term support and resale value, even at a higher purchase price." },
    ],
    readMinutes: 7,
  },
  {
    slug: "hydrominer-guide-water-cooled-asic-mining-explained",
    metaTitle: "Water-Cooled ASIC Mining Explained | BMD",
    description:
      "How water-cooled (hydro) ASIC mining actually works, what infrastructure it requires, and when the efficiency gain is worth the added complexity over air cooling.",
    keywords: ["hydrominer guide", "water cooled asic mining", "hydro miner explained", "asic hydro cooling", "water cooling bitcoin miner"],
    intro: [
      "Water-cooled — or \"hydro\" — ASIC mining runs coolant directly through the miner's cold plates instead of blowing air across a heatsink, letting the chips run at a clock and voltage combination that would overheat an air-cooled board. It's not a different kind of miner so much as a different, more capable cooling method wrapped around similar underlying silicon.",
      "This guide is brand-agnostic: how hydro cooling actually works, what it requires beyond the miner itself, and the honest trade-off against air cooling that determines whether it's worth the added complexity for your specific site.",
    ],
    sections: [
      {
        h2: "How Hydro Cooling Actually Works",
        paras: [
          "Instead of fins and fans, a hydro miner's chips sit against a cold plate with channels that coolant flows directly through, carrying heat away far more efficiently than air can. That efficiency lets manufacturers run the same or similar silicon at a higher clock and voltage than an air-cooled version of the same chip could sustain without overheating.",
          "The miner itself is only half the system — it needs an external loop with a pump, a dry cooler or heat exchanger to actually reject the heat outdoors, and plumbing to connect them, none of which comes built into the machine.",
        ],
      },
      {
        h2: "The Infrastructure a Hydro Loop Actually Requires",
        paras: [
          "At minimum: a manifold to distribute coolant across multiple machines, quick-disconnect couplings at each unit, a pump with redundancy (a stopped pump can damage chips within minutes), a dry cooler or heat exchanger sized to your total kilowatts, treated coolant, and a leak-detection plan.",
          "This is genuine infrastructure cost and complexity on top of the miners themselves — budget it as its own line item, not an afterthought, and expect real commissioning time before the loop is dialled in.",
        ],
      },
      {
        h2: "Why Inlet Temperature Is the Number That Matters Most",
        paras: [
          "A hydro miner's performance depends heavily on the coolant's inlet temperature — keep it within the manufacturer's stated window and the machine holds full clock; let it drift upward and you lose hashrate or trip thermal protection. In hot climates, the dry cooler's capacity, not the miner itself, becomes the limiting factor during summer.",
          "Size the dry cooler for your worst expected week, not the annual average — undersized heat rejection is the single most common reason a hydro deployment underperforms its modelled hashrate.",
        ],
      },
      {
        h2: "Efficiency and Density Gains Over Air",
        paras: [
          "Hydro units typically achieve meaningfully better joules per terahash than an air-cooled version of similar-generation silicon, and pack more hashrate into the same rack footprint since there's no need for the airflow clearance air cooling demands. Both gains compound at scale — a hydro rack can out-hash an equivalent air-cooled footprint by a wide margin.",
          "These gains come specifically from running the chips harder within a thermal envelope water can sustain but air can't — it's a real physical advantage, not a marketing claim.",
        ],
      },
      {
        h2: "When Hydro's Extra Cost Is Actually Worth It",
        paras: [
          "Hydro wins when electricity is expensive enough that the efficiency gap compounds meaningfully over the machine's life, when rack space is genuinely constrained, or when the waste heat has a second use — district heating, greenhouses, industrial process water. Below those thresholds, air cooling's lower complexity usually wins on total cost.",
          "Run the comparison including loop capital and pump power, not just the miner's price — hydro's headline efficiency advantage can evaporate once the full infrastructure cost is amortised across too few machines.",
        ],
      },
      {
        h2: "Running a Hydro Loop Day to Day",
        paras: [
          "Monitor coolant temperature and flow rate as first-class metrics alongside hashrate — a slowly failing pump shows up as a gradual temperature climb long before the miner itself throws an error. Keep spares for the parts that fail in loops rather than in miners: pumps, seals, couplings and filters.",
          "We carry hydro hardware across multiple manufacturers, bench-tested before shipping, and can talk through whether your specific site and power rate actually justify a hydro build versus staying on air.",
        ],
      },
    ],
    faqs: [
      { q: "Is a hydro miner just an air miner with water added?", a: "Not quite — the cold-plate design lets the same or similar silicon run at a higher clock and voltage than air cooling could sustain, so it's a genuinely different thermal envelope, not just a different radiator." },
      { q: "What's the biggest infrastructure cost people underestimate?", a: "The dry cooler or heat exchanger, sized for the hottest week of the year rather than the average — undersizing it is the most common reason hydro deployments underperform." },
      { q: "Does hydro cooling always pay for itself?", a: "No — it depends on your electricity rate, space constraints, and whether you can use the waste heat. Below certain power rates, air cooling's simplicity usually wins on total cost." },
      { q: "What fails most often in a hydro loop?", a: "Pumps, seals, couplings and filters — not the miner's chips themselves. Keep spares for loop components specifically." },
      { q: "Can I run just one hydro machine at home?", a: "Technically yes with a small loop and an outdoor radiator, but the loop cost per machine only makes sense at multiple units or where heat reuse offsets it." },
    ],
    readMinutes: 7,
  },
  {
    slug: "antminer-l11-scrypt-hashrate-power-and-litecoin-roi",
    metaTitle: "Antminer L11 ROI: Hashrate, Power, Payback | BMD",
    description:
      "The Antminer L11's actual return-on-investment math: hashrate and power figures to confirm, Litecoin/Dogecoin merged-mining payback at real power rates, and the break-even case.",
    keywords: ["antminer l11 roi", "antminer l11 payback", "antminer l11 hashrate", "antminer l11 litecoin", "antminer l11 profitability"],
    intro: [
      "Specs and reviews tell you what the Antminer L11 is; this guide is specifically about whether it pays back, and how fast, once you run its Scrypt merged-mining revenue against a real electricity rate. If you've already read the model overview and comparison content and want the payback math specifically, this is that piece.",
      "Every figure below is a method, not a fixed promise — Litecoin and Dogecoin price and difficulty both move, so plug in current numbers and your own power rate rather than trusting a snapshot.",
    ],
    sections: [
      {
        h2: "The Numbers the ROI Calculation Needs",
        paras: [
          "Confirm rated hashrate in gigahash per second and wall watts in writing from the seller, then compute joules per gigahash yourself — the Scrypt equivalent of joules per terahash — rather than trusting a headline efficiency claim. This single number drives the entire running-cost side of the payback calculation.",
          "Also confirm firmware version and whether the specific unit has run overclocked, since that affects both current output and how much useful life is left on the hardware.",
        ],
      },
      {
        h2: "Why Litecoin and Dogecoin Both Count",
        paras: [
          "Scrypt merged mining pays the L11 in both Litecoin and Dogecoin simultaneously from the same hashrate, so the revenue side of the ROI calculation has to add both coins' expected output at current price, not just one. Skipping either coin understates revenue and makes the payback period look longer than it actually is.",
          "Pull current price and difficulty for both coins from a live source before modelling — this pairing has historically moved somewhat differently than bitcoin, so don't substitute bitcoin-market assumptions here.",
        ],
      },
      {
        h2: "The Payback Formula Applied to the L11",
        paras: [
          "Daily revenue comes from a mining calculator fed the L11's real gigahash rating against current Litecoin and Dogecoin difficulty and price. Daily cost is wall watts ÷ 1000 × 24 × your electricity rate. Subtract cost and pool fees from revenue for daily net, then divide the delivered machine price by daily net for payback in days.",
          "Run this at your own delivered rate, not a generic assumption — the L11's payback period changes meaningfully between a four-cent and a twelve-cent kilowatt-hour rate, the same as any ASIC.",
        ],
      },
      {
        h2: "Where the L11 Sits on Efficiency",
        paras: [
          "As a newer-generation Scrypt unit, the L11 generally improves on joules per gigahash versus older Antminer L-series machines, which directly shortens payback at any given power rate compared to those predecessors. Compare its actual measured efficiency against the specific older unit you'd otherwise buy before assuming the newer model automatically wins on ROI.",
          "A cheaper older L-series unit can still out-pay-back the L11 at very low power rates, where the L11's efficiency advantage matters less against a large price gap — run both scenarios rather than assuming newer always wins.",
        ],
      },
      {
        h2: "Sensitivity: What Actually Moves the Payback Period",
        paras: [
          "Electricity rate moves payback the most of any single variable — a few cents per kilowatt-hour shift changes the outcome more than most people expect. Litecoin and Dogecoin price movement is the second-biggest factor, and it's the one you can't control or predict, which is why conservative price assumptions produce more trustworthy payback estimates than optimistic ones.",
          "Re-run the model whenever your power rate changes or after a significant move in either coin's price, rather than trusting a payback figure calculated months earlier.",
        ],
      },
      {
        h2: "Buying for ROI, Not Just Specs",
        paras: [
          "Price the L11 on delivered dollars per gigahash including freight, and insist on a load test showing stable hashrate on both merged coins before finalising a used purchase. A machine priced slightly higher but properly tested and warrantied often beats a cheaper, unverified unit on realised ROI once you account for the risk of a dead-on-arrival board.",
          "We bench-test every L11 we ship and can model expected payback for your specific power rate before you order, so the ROI number you're deciding on is based on your real numbers, not a generic example.",
        ],
      },
    ],
    faqs: [
      { q: "Does the Antminer L11 mine one coin or two?", a: "Two, simultaneously, through Scrypt merged mining — Litecoin and Dogecoin from the same hashrate, both counted in the revenue side of an ROI calculation." },
      { q: "What's the single biggest factor in the L11's payback period?", a: "Your electricity rate. A swing of a few cents per kilowatt-hour changes payback more than almost any other input." },
      { q: "Is the L11 always a better ROI than an older L-series unit?", a: "Not automatically — at very low power rates, a cheaper older unit's price advantage can outweigh the L11's better efficiency. Run both scenarios." },
      { q: "How often should I recompute the L11's expected payback?", a: "Whenever your power rate changes or Litecoin/Dogecoin price moves significantly — treat any single calculation as a snapshot, not a permanent figure." },
      { q: "What should I check before buying a used L11?", a: "A load test showing stable hashrate on both merged coins, confirmed firmware version, and overclock history, priced on delivered dollars per gigahash." },
    ],
    readMinutes: 7,
  },
  {
    slug: "antminer-al1-alephium-miner-specs-price-and-payback",
    metaTitle: "Antminer AL1 Buying Guide: Specs & Price | BMD",
    description:
      "What to verify before buying an Antminer AL1 Alephium miner: real specs to confirm, fair pricing, and the buying checklist — for the profitability math, see our AL1 economics guide.",
    keywords: ["antminer al1 specs", "antminer al1 price", "antminer al1 buying guide", "alephium miner specs", "buy antminer al1"],
    intro: [
      "The Antminer AL1 mines Alephium, a smaller-cap coin with a thinner hardware and secondary market than mainstream SHA-256 or Scrypt ASICs — which makes the buying process, not just the profitability math, worth getting right. This guide is the buying-side companion to our AL1 profitability analysis: what to verify, what a fair price looks like, and the checklist before you pay.",
      "If you've already decided Alephium's economics work for you and just need to buy safely, this is the piece to read. If you haven't run the profitability numbers yet, start with our dedicated AL1 economics guide first.",
    ],
    sections: [
      {
        h2: "Specs to Confirm, Not Assume",
        paras: [
          "Get the AL1's rated hashrate and wall watts in writing directly from the seller, and calculate joules per unit of hashrate yourself rather than trusting a headline efficiency figure — this is worth doing for any ASIC, but especially so for a lower-volume model where spec sheets circulate less scrutinised than a mainstream Bitmain S-series unit.",
          "Confirm the exact firmware version installed and whether the unit has ever run overclocked. For a niche coin like Alephium, firmware compatibility with your intended pool matters more than it does for a mainstream, well-supported coin.",
        ],
      },
      {
        h2: "Why the Secondary Market Is Thinner Here",
        paras: [
          "Because Alephium is a smaller-cap coin, fewer AL1 units circulate on the used market than mainstream Bitmain hardware, which means fewer comparison listings to price against and a genuinely thinner resale market if you decide to exit later. Factor that illiquidity into your decision, not just the purchase price.",
          "This isn't a reason to avoid the AL1 if Alephium's economics work for you — it's a reason to be more conservative about exit planning than you might be with a mainstream SHA-256 machine.",
        ],
      },
      {
        h2: "Pricing an AL1 Fairly",
        paras: [
          "Price on delivered dollars per unit of hashrate including freight, and expect a wider price spread between sellers than you'd see on a mainstream model, simply because there are fewer active listings to anchor a market price. Get multiple quotes before assuming any single one is representative.",
          "Discount a used unit for age and unknown run history the same way you would any ASIC, and budget for the fact that niche-hardware repairs can take longer to source parts for than a mainstream Bitmain repair.",
        ],
      },
      {
        h2: "Pool and Firmware Compatibility Before You Buy",
        paras: [
          "Confirm your intended Alephium pool explicitly supports the AL1's exact firmware and stratum requirements before buying — this is a smaller ecosystem than Bitcoin's pool landscape, and not every pool supports every device revision identically.",
          "If you can't get a straight answer from a pool about AL1 compatibility before buying, treat that as a real warning sign rather than something to sort out after the hardware arrives.",
        ],
      },
      {
        h2: "Buying Checklist",
        paras: [
          "Insist on a load test showing stable hashrate and normal temperatures for at least an hour, confirm firmware and overclock history, and get warranty terms in writing including who pays return freight. Given the thinner support ecosystem, ask specifically what happens if a board fails — repair turnaround matters more here than on mainstream hardware.",
          "Photograph and document everything on arrival regardless of new or used, since a niche model's support channel may take longer to respond to a dispute than a mainstream manufacturer's.",
        ],
      },
      {
        h2: "Where We Fit In",
        paras: [
          "We bench-test AL1 units the same way we test every other ASIC we carry, and quote delivered pricing from Hong Kong with freight and customs paperwork included. Ask us directly about current Alephium pool compatibility and realistic repair turnaround before you buy, since those specifics matter more for a niche coin than for mainstream hardware.",
          "For the actual profitability question — whether Alephium mining economics work at your power rate — see our dedicated AL1 economics guide, which covers that math directly.",
        ],
      },
    ],
    faqs: [
      { q: "Is the Antminer AL1 harder to buy safely than a mainstream Antminer?", a: "The verification steps are the same, but the secondary market is thinner, so expect fewer comparison listings and a wider price spread between sellers." },
      { q: "Where can I find AL1 profitability numbers?", a: "See our dedicated AL1 profitability and economics guide — this piece focuses on buying safely, not the earnings math." },
      { q: "Should I confirm pool support before buying?", a: "Yes, explicitly. Alephium's pool ecosystem is smaller than Bitcoin's, and not every pool supports every AL1 firmware revision identically." },
      { q: "Is a used AL1 riskier than a used mainstream ASIC?", a: "Somewhat, mainly due to thinner resale liquidity and potentially slower parts sourcing for repairs, not because the hardware itself is inherently less reliable." },
      { q: "What's the minimum test before buying a used AL1?", a: "A load test of at least an hour showing stable hashrate and normal temperatures, plus confirmed firmware and overclock history." },
    ],
    readMinutes: 7,
  },
  {
    slug: "bitcoin-mining-training-skills-every-operator-needs",
    metaTitle: "Bitcoin Mining Skills Every Operator Needs | BMD",
    description:
      "The practical skill set a bitcoin mining operator actually needs — electrical safety, networking, firmware, monitoring and troubleshooting — and why each one matters.",
    keywords: ["bitcoin mining skills", "bitcoin mining training", "skills for mining operators", "bitcoin mining competencies", "learn to run asic miners"],
    intro: [
      "Running bitcoin mining hardware well isn't one skill — it's a small set of practical competencies that each prevent a specific, common failure. This guide breaks down what those skills actually are and why each one earns its place, as a checklist for what to get comfortable with before you're managing hardware at any real scale.",
      "It's organised by competency rather than by schedule, since different people arrive with different starting knowledge — an electrician needs less help with circuits and more with firmware; a software person is often the reverse.",
    ],
    sections: [
      {
        h2: "Electrical Safety and Circuit Basics",
        paras: [
          "You need to understand what a dedicated 200-240 volt circuit actually requires, how to read a breaker's rating against continuous load with proper headroom, and why daisy-chaining PDUs is a fire risk rather than a convenience. You don't need to be a licensed electrician, but you need to know enough to have an informed conversation with one and to recognise when something looks wrong.",
          "This is the skill where ignorance is most expensive — electrical mistakes cause fires and equipment damage, not just downtime, and it's the one area where guessing is genuinely dangerous rather than just costly.",
        ],
      },
      {
        h2: "Basic Networking",
        paras: [
          "Miners need a wired Ethernet connection, a static or reserved IP (or at least a reliable way to find their DHCP-assigned address), and — for a fleet — a subnet you can scan and manage. You need to understand enough networking to diagnose 'the miner isn't connecting to the pool' as either a local network problem or a pool-side problem, since the fix is completely different depending on which it is.",
          "This doesn't require deep IT expertise, but it does require comfort with a router's admin interface and, for anything beyond a couple of machines, a basic understanding of how to organise a subnet so machines don't collide on IP addresses.",
        ],
      },
      {
        h2: "Firmware Management",
        paras: [
          "You need to know where official firmware comes from, why an unofficial image is a warranty and security risk, and how to flash a machine without bricking it — back up configuration first, never interrupt a flash, and test one unit before rolling a change across a fleet. This is the skill most likely to cause an expensive mistake if skipped.",
          "You also need enough judgment to decide when NOT to update — a stable machine hitting rated hashrate doesn't need the newest firmware just because it exists.",
        ],
      },
      {
        h2: "Monitoring and Alerting",
        paras: [
          "Beyond a machine or two, you need some system — even a simple one — that tells you when a machine drops offline or underperforms, rather than discovering it days later during a routine check. The specific tool matters less than having one at all; a manufacturer's own interface is enough for a single unit, but a fleet needs aggregated alerting.",
          "The core skill here isn't technical sophistication, it's discipline: actually checking the dashboard or acting on the alert, rather than setting it up once and ignoring it.",
        ],
      },
      {
        h2: "Basic Diagnostic Sequence",
        paras: [
          "When a machine underperforms, the diagnostic sequence is nearly always the same: check hashboards online, check per-board temperatures, check pool connection status, check for recent firmware or configuration changes, in that order. Learning this sequence turns a confusing problem into a five-minute checklist.",
          "You don't need to know how to repair a hashboard yourself, but you do need to be able to correctly identify WHICH subsystem is failing, since that determines whether you're calling a repair centre, checking your network, or just waiting out a temporary pool issue.",
        ],
      },
      {
        h2: "Buying and Vendor Judgment",
        paras: [
          "The last skill isn't technical at all: knowing how to vet a seller, price hardware fairly on delivered dollars per terahash, and recognise the specific red flags — no company registration, pressure to pay immediately, prices far below market — that predict a bad transaction.",
          "This skill compounds with the others: a well-run electrical and monitoring setup is wasted if the hardware itself was a bad purchase to begin with. We built our own process — bench-testing, condition grading, written warranty terms — around exactly the standard this skill teaches you to demand from any supplier, including us.",
        ],
      },
    ],
    faqs: [
      { q: "Which skill matters most for a first-time operator?", a: "Electrical safety — it's the one area where a mistake causes real damage or danger, not just downtime, so it deserves the most caution even if you're not doing the wiring yourself." },
      { q: "Do I need to be able to repair hardware myself?", a: "No — you need to correctly diagnose WHICH subsystem is failing, so you know whether to call a repair centre, check your network, or wait out a pool issue. Repair is a separate, optional skill." },
      { q: "How much networking knowledge is actually required?", a: "Enough to use your router's admin interface and understand IP basics — not deep IT expertise, but more than zero if you're running more than one machine." },
      { q: "What's the biggest firmware-related mistake to avoid?", a: "Flashing unofficial images, or updating firmware for no specific reason on a machine that's already stable and hitting rated hashrate." },
      { q: "Is vendor vetting really a 'skill'?", a: "Yes — it's learnable and specific: company registration, written quotes, test evidence and clear warranty terms are checkable in minutes once you know to look for them." },
    ],
    readMinutes: 7,
  },
];

function assertUnique() {
  const redirectSlugs = new Set(Object.keys(REDIRECTS));
  const rewriteSlugs = new Set(REWRITES.map((r) => r.slug));
  for (const s of redirectSlugs) if (rewriteSlugs.has(s)) throw new Error("slug in both REDIRECTS and REWRITES: " + s);
}
assertUnique();

// --- Build the new BLOG_POSTS array ---
const rewriteMap = new Map(REWRITES.map((r) => [r.slug, r]));
const newPosts: BlogPost[] = [];
for (const post of BLOG_POSTS) {
  if (REDIRECTS[post.slug]) continue; // dropped, replaced by a 301
  const rw = rewriteMap.get(post.slug);
  if (!rw) {
    newPosts.push(post);
    continue;
  }
  newPosts.push({
    ...post,
    date: DATE,
    description: rw.description,
    keywords: rw.keywords,
    intro: rw.intro,
    sections: rw.sections,
    faqs: rw.faqs,
    readMinutes: rw.readMinutes,
  });
}
const foundRewriteSlugs = new Set(BLOG_POSTS.filter((p) => rewriteMap.has(p.slug)).map((p) => p.slug));
for (const rw of REWRITES) if (!foundRewriteSlugs.has(rw.slug)) throw new Error("rewrite slug not found in BLOG_POSTS: " + rw.slug);
const foundRedirectSlugs = new Set(BLOG_POSTS.filter((p) => REDIRECTS[p.slug]).map((p) => p.slug));
for (const s of Object.keys(REDIRECTS)) if (!foundRedirectSlugs.has(s)) throw new Error("redirect slug not found in BLOG_POSTS: " + s);
for (const target of Object.values(REDIRECTS)) if (!BLOG_POSTS.some((p) => p.slug === target)) throw new Error("redirect target not found: " + target);

console.log(`BLOG_POSTS: ${BLOG_POSTS.length} -> ${newPosts.length} (removed ${Object.keys(REDIRECTS).length}, rewrote ${REWRITES.length})`);

const blogPath = "src/lib/blog.ts";
let blog = readFileSync(blogPath, "utf8");
const blogArrayRe = /export const BLOG_POSTS: BlogPost\[\] = \[[\s\S]*?\r?\n\];/;
if (!blogArrayRe.test(blog)) throw new Error("BLOG_POSTS array literal not found");
const blogBody = newPosts.map((p) => JSON.stringify(p, null, 2)).join(",\n");
blog = blog.replace(blogArrayRe, `export const BLOG_POSTS: BlogPost[] = [\n${blogBody}\n];`);
writeFileSync(blogPath, blog);

// --- Build the new BLOG_INDEX array ---
const newIndex: BlogIndexEntry[] = [];
for (const entry of BLOG_INDEX) {
  if (REDIRECTS[entry.slug]) continue;
  const rw = rewriteMap.get(entry.slug);
  if (!rw) {
    newIndex.push(entry);
    continue;
  }
  newIndex.push({
    ...entry,
    metaTitle: rw.metaTitle,
    date: DATE,
    description: rw.description,
    keywords: rw.keywords,
    readMinutes: rw.readMinutes,
  });
}
console.log(`BLOG_INDEX: ${BLOG_INDEX.length} -> ${newIndex.length}`);

const idxPath = "src/lib/blog-index.ts";
let idx = readFileSync(idxPath, "utf8");
const idxArrayRe = /export const BLOG_INDEX: BlogIndexEntry\[\] = \[[\s\S]*?\r?\n\];/;
if (!idxArrayRe.test(idx)) throw new Error("BLOG_INDEX array literal not found");
const idxBody = newIndex.map((p) => JSON.stringify(p, null, 2)).join(",\n");
idx = idx.replace(idxArrayRe, `export const BLOG_INDEX: BlogIndexEntry[] = [\n${idxBody}\n];`);
writeFileSync(idxPath, idx);

// --- sitemap-blog.xml: drop redirected slugs, bump lastmod for rewritten ones ---
const smPath = "public/sitemap-blog.xml";
let sm = readFileSync(smPath, "utf8");
for (const slug of Object.keys(REDIRECTS)) {
  const lineRe = new RegExp(`[ \\t]*<url><loc>https://bitcoinminingdepot\\.net/blog/${slug}</loc>[^\\n]*</url>\\r?\\n?`);
  if (!lineRe.test(sm)) throw new Error("sitemap entry not found for redirected slug: " + slug);
  sm = sm.replace(lineRe, "");
}
for (const rw of REWRITES) {
  const lineRe = new RegExp(`(<loc>https://bitcoinminingdepot\\.net/blog/${rw.slug}</loc><lastmod>)[^<]+(</lastmod>)`);
  if (!lineRe.test(sm)) throw new Error("sitemap entry not found for rewritten slug: " + rw.slug);
  sm = sm.replace(lineRe, `$1${DATE}$2`);
}
writeFileSync(smPath, sm);

console.log("done.");
console.log("\nRedirect map (add to server.ts):");
console.log(JSON.stringify(REDIRECTS, null, 2));
