# New keyword-targeted blog posts (model & brand terms)

## Goal
Turn the supplied keyword list into new long-form guides in the existing blog library, skipping any keyword whose post title already exists. Current library: 219 posts.

## Keyword handling rules
1. Normalise each keyword (lowercase, strip extra spacing) and de-duplicate — the WhatsMiner block is repeated verbatim in the list, so those are counted once.
2. Merge near-identical variants into a single post so no two posts fight for the same title, e.g.
   - `ant miner` / `antiminer` / `ant iner` / `anteminer` / `antminer 21` → one Antminer-buying explainer that names the misspellings in body copy.
   - `antminer s9` / `ant miner s9` / `s9 miner` / `s9 antminer` / `antminer s9 price` / `antminer s9 price used 2025` / `antminder s9` / `buy bitmain s9` / `bitmain s9 for sale` → one S9 pricing/buying guide.
   - `s21 xp` / `antminer s21 xp` / `bitmain antminer s21 xp hydro` / `s21 xp hydro` / `antminer s21 xp hydro` / `bitmain antminer s21 xp hyd` / `bitmain antminer s21 xp+ hyd` → S21 XP family guide plus a separate hydro-specific guide.
   - Same collapsing for S23 / S23 Hyd 3U, S19 XP / S19 XP Hyd 255T, S17 / S17 Pro / S17 hosting, L3+ / L3 / L7 / L9 / L11, KS5 Pro / KS7, D3 / D9 / Z11 / Z15, WhatsMiner M30S / M30S++ / M50 / M50S / M60S / M63S / M63 Hydro, Elphapex DG1 / DG2 / DG2+ / DG2 Mini / DG Home 1, Goldshell Mini Doge III / E-AE1M / AE Max / Byte / XT card.
3. Skip keywords that are not usable search intents (part numbers and noise with no product meaning): `elg-200-24da`, `dxaepip2w`, `d2ehpa`, `danigrex2n`, `elflorex2`, `gxepd2`, `elvax plus`, `combustible goldshell`, `science miner`, `蚂蚁矿机`, plus `bitmain coupon` and `find my goldshell` (no matching inventory intent). These are listed as skipped in the summary.
4. Before writing, compare every candidate title against the 219 existing titles and slugs; matches are skipped (expected overlap: S21/S23/used-miner terms already covered by earlier batches).

Estimated new posts after de-duplication and skips: roughly 55-70 guides.

## Post structure (matches existing library)
Each post reuses the `BlogPost` shape already in `src/lib/blog.ts`:
- unique slug + title (< 60 chars where possible), 150-char description
- keyword array from the source terms
- 2-paragraph intro, 5-7 `h2` sections of original operator-voice copy (specs, J/TH, price per TH, hosting/noise, buying checks)
- 4-6 FAQs (feeds the existing FAQPage JSON-LD)
- `match` block (brands / terms / condition / maxPrice) so each post pulls real in-stock miners into its "Recommended miners" grid
- category assigned from existing `BLOG_CATEGORIES` (rank, buy, brand, profit, setup, used)

## Technical steps
1. Generate the posts with a one-off script that reads the current `BLOG_POSTS` titles/slugs for de-duplication, then appends the new objects to `src/lib/blog.ts`.
2. Set `match.brands` to real brand values in the catalog (Bitmain, MicroBT, Goldshell, Elphapex, etc.) so product recommendations are never empty.
3. Append every new `/blog/<slug>` URL to `public/sitemap-blog.xml` with today's `lastmod`.
4. Verify: typecheck, post count, zero duplicate titles/slugs, and spot-check 3 new post pages return 200 with H1, FAQ schema and product picks rendering.

No route, layout or design changes — the existing `/blog` index and `/blog/$slug` template render the new posts automatically.
