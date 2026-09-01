# Performance & ARIA fixes

Targets the PageSpeed findings: render-blocking requests, LCP breakdown, critical request chains, cache lifetime, image download size, unused JavaScript, and prohibited ARIA attributes.

## 1. Prohibited ARIA attribute (accessibility)

`src/components/site/Stars.tsx` puts `aria-label` on a plain `<div>`. A generic div has no role, so `aria-label` is prohibited there and assistive tech may drop the rating. Fix by giving the wrapper `role="img"` (keeping the label), so the star group is announced as "5 out of 5 stars" with the decorative icons still `aria-hidden`.

## 2. LCP element: hero image

The homepage hero photo is the LCP element and is currently only discovered when the HTML `<img>` is parsed.

- Add a `<link rel="preload" as="image">` for the hero (with `imagesrcset`/`imagesizes` matching the existing srcset) in the homepage route `head()` so it starts downloading in parallel with CSS instead of after it.
- Add a small `640w` entry check and drop `decoding="async"` on the hero (async decode can delay paint for the LCP image); keep `fetchpriority="high"`.
- Compress the hero WebP variants further (target roughly 40–50% smaller at the same visual quality) to cut LCP load time. Same treatment for the secondary 3D miner image, which loads eagerly today.

## 3. Render-blocking / critical chains

- Keep the single stylesheet but stop preloading fonts that are not used above the fold; preload only the two faces the hero actually paints with, so font bytes don't compete with the LCP image.
- Below-the-fold, JS-only widgets (WhatsApp floating button, inquiry modal) are pulled into the initial bundle by the shared layout. Load them lazily after hydration so they leave the critical path.
- Product/article images below the fold get `loading="lazy"` and `decoding="async"` where any are still eager, so they don't chain behind the hero.

## 4. Cache lifetime

Static assets are served with no explicit cache policy. Add a `public/_headers` file (honoured by the hosting layer) that sets:

- `/assets/*` and `/fonts/*` → `Cache-Control: public, max-age=31536000, immutable` (hashed/stable filenames)
- images in `/` (favicon, og-preview) → `max-age=604800`
- sitemaps and feeds → `max-age=3600`
- HTML → `max-age=0, must-revalidate` so content updates stay instant

## 5. Unused JavaScript

- Route-level code splitting already applies; the remaining bulk is icon and UI imports pulled in eagerly. Trim unused shadcn/ui and lucide imports found in the homepage and layout chain, and lazy-load the heavier interactive sections (marketplace directory filter, admin-only chunks) so they aren't part of the first payload.
- Verify no admin route module is reachable from the public bundle graph.

## Verification

- Rebuild and confirm the homepage HTML contains the hero preload and no eager below-fold widget scripts.
- Re-crawl the homepage plus one product page and one blog page for 200s, correct head tags and no console errors.
- Confirm the Stars component renders with `role="img"` and a label.

No content, copy, pricing, schema or routing changes.
