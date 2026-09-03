# New posts for the "for sale / buy" keyword batch

## What the check found
The blog library currently holds 273 posts. Checking your 12 keywords against existing titles, 9 are already covered by a live guide, so per your rule they are skipped:

| Keyword | Existing post (skipped) |
| --- | --- |
| asic miners for sale | ASIC Miners For Sale: How to Buy Safely in 2026 |
| purchase asic miner | Purchase ASIC Miner: Step-by-Step Order Process |
| buy asic miner | How to Buy an ASIC Miner Without Getting Scammed |
| crypto miners for sale | Crypto Miners for Sale: How to Buy Without Getting Burned |
| crypto mining equipment for sale | Crypto Mining Equipment for Sale: Full Site Shopping List |
| cryptocurrency miners for sale | Cryptocurrency Miners for Sale: Coin-by-Coin Hardware Map |
| bitcoin miner for sale | Bitcoin Miner for Sale: Every Price Tier Explained |
| best deck for miners mine 2025 | Best Deck for Miners Mine 2025: Rack, Shelf and Airflow Layouts |
| 120v asic miner | 120V ASIC Miner Options: What Actually Runs on a Home Outlet |

## The 3 new posts to write
Each targets a distinct intent that no existing title serves, so they don't cannibalise the guides above.

1. **ASIC Miner for Sale: Single-Unit Buyer's Walkthrough** (`asic-miner-for-sale-single-unit-buyers-walkthrough`)
   Intent: one buyer, one machine. Picking a single model by power rate, what a single-unit order costs delivered, payment and warranty terms, first-week bring-up.

2. **ASIC Mining Buy Decision: Hardware, Hosting or Neither** (`asic-mining-buy-decision-hardware-hosting-or-neither`)
   Intent: pre-purchase decision. Own-and-host vs run at home vs skip mining, break-even math at 4/8/12/16 cents per kWh, capital and time commitments.

3. **Crypto Miner for Sale: Choosing One Machine by Coin** (`crypto-miner-for-sale-choosing-one-machine-by-coin`)
   Intent: single altcoin miner. SHA-256 vs Scrypt vs Kaspa vs Doge/LTC single-unit picks, price per unit of hashrate, noise and power fit.

## Structure (matches the existing library)
Per post, in `src/lib/blog.ts` using the current `BlogPost` shape:
- unique slug and title, 150-char description, keyword array from the source terms
- 2-paragraph intro, 6-7 `h2` sections of original operator-voice copy (specs, J/TH, price per TH, power/noise, buying checks)
- 5 FAQs feeding the existing FAQPage JSON-LD
- `match` block (brands / terms / condition / maxPrice) using real catalog brands so the "Recommended miners" grid is never empty
- category from existing `BLOG_CATEGORIES` (buy / profit)

## Technical steps
1. Append the 3 posts to `BLOG_POSTS` in `src/lib/blog.ts`.
2. Add the 3 `/blog/<slug>` URLs to `public/sitemap-blog.xml` with today's `lastmod`.
3. Update the post count shown on `src/routes/blog.index.tsx` from 273 to 276.
4. Verify: typecheck, zero duplicate titles/slugs, and load the 3 pages to confirm H1, FAQ schema and product picks render.

No route, layout or design changes — `/blog` and `/blog/$slug` pick the new posts up automatically.
