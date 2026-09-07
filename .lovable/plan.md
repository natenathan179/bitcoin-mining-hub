# New guides for the Antminer / WhatsMiner keyword batch

## What the check found
The library holds 299 guides. Checking your list against existing titles, nearly every cluster is already covered by a live guide, so per your rule those keywords are skipped — including all S9, S17, S19 XP, S21 (air/Pro/XP/Hyd, February 2026 pricing), S23 Hyd/Hydro, L3+/L7/L9/L11, KS5 Pro, KS7, D3/D9/Z11, S15, Scrypt miners, 120V, mining rigs for sale, ASIC miners for sale, purchase ASIC miner, crypto mining rig for sale, parallel miner, WhatsMiner M30S/M50S/M60S/M63 Hydro, WhatsMiner Tool and firmware guides.

Skipped as noise with no buying intent: `bitmain coupon`, `ks5pro scooter`, `science miner`, `蚂蚁矿机`, plus misspellings (`ant iner`, `anteminer`, `antiminer`, `antminder s9`, `whattsminer`) which are folded into existing guide copy rather than given their own pages.

## The 8 new guides to write
Each targets an intent no existing title serves.

1. **Antminer U3S23H: Specs, Hashrate and Who It Suits** (`antminer-u3s23h-specs-hashrate-and-who-it-suits`)
2. **WhatsMiner M79S: Hydro Specs, Efficiency and Payback** (`whatsminer-m79s-hydro-specs-efficiency-and-payback`)
3. **WhatsMiner M61 Review: Hydro Hashrate and Site Fit** (`whatsminer-m61-review-hydro-hashrate-and-site-fit`)
4. **WhatsMiner M20S in 2026: Is the Old Workhorse Worth It** (`whatsminer-m20s-in-2026-is-the-old-workhorse-worth-it`)
5. **WhatsMiner Firmware Download: Versions, Safety, Rollback** (`whatsminer-firmware-download-versions-safety-rollback`)
6. **1000 TH/s Bitcoin Mining: What One Petahash Really Costs** (`1000-th-s-bitcoin-mining-what-one-petahash-really-costs`)
7. **BitForge Nano and Small Home Miners Compared** (`bitforge-nano-and-small-home-miners-compared`)
8. **Speed Miner, Power Miner and Monzbit Brands Explained** (`speed-miner-power-miner-and-monzbit-brands-explained`)

## Structure (matches the existing library)
Per post, in `src/lib/blog.ts` using the current `BlogPost` shape:
- unique slug and title, 150-char description, keyword array drawn from your list
- 2-paragraph intro, 6-7 `h2` sections in operator voice (specs, J/TH, price per TH, power and noise, buying checks)
- 5 FAQs feeding the existing FAQPage structured data
- `match` block using real catalog brands so the recommended-miners grid is never empty
- category from existing categories (rank / brand / buy / profit / setup)

Where a claim can't be verified for the newer or obscure models (U3S23H, M79S, M61, BitForge Nano, Monzbit), the copy describes ranges, how to verify specs on arrival and what to ask the seller, instead of inventing figures.

## Technical steps
1. Append the 8 posts to `BLOG_POSTS` in `src/lib/blog.ts` and regenerate `src/lib/blog-index.ts`.
2. Add the 8 `/blog/<slug>` URLs to `public/sitemap-blog.xml` with today's date.
3. Update the guide counts shown on `src/routes/blog.index.tsx` from 299 to 307.
4. Verify: typecheck, no duplicate titles or slugs, and load each new page to confirm heading, FAQ data and product picks render.

No route, layout or design changes — `/blog` and the article template pick the new posts up automatically.
