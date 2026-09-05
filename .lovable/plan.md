# Fix the Semrush report

Five issues, in the order they hurt rankings and speed.

## 1. Page weight — the biggest win (1,661 pages flagged)

The site footer pulls in the entire blog library (all 291 posts, over 2 MB of text) and the footer appears on every single page. So every page a visitor or crawler opens downloads the whole blog, even the contact page. Same story with the 1,075 marketplace locations on marketplace pages.

Fix:
- Give the footer a tiny hand-picked list of guide links instead of loading the full blog library.
- Load a blog post's content only on that post's own page, and the location list only where it is actually shown.
- Verify the drop by measuring what a plain page (home, contact, a product) downloads before and after.

Nothing visible changes — same links, same content, far less to download.

## 2. Duplicate title tags (17 pages)

Confirmed: 7 guide pages share three titles, because the title is built from the words before the colon and three groups of posts start identically:
- "Used ASIC Miner Buying Guide" (3 posts)
- "Antminer L7 9050 Profitability" (2 posts)
- "Antminer L5 Profitability" (2 posts)

Fix: make the title builder keep a distinguishing part of the post name when a shortened title would collide, then re-check that all 291 guide titles are unique.

The remaining flagged pages are almost certainly filtered shop URLs (for example the shop page with a category or search added to the address), which currently all carry the identical shop title. Fix by giving those filtered views their own title and description, and pointing them back at the main shop page as the preferred version.

## 3. Duplicate content in h1 and title (19 pages)

Confirmed: 19 product pages have a headline and a title that read exactly the same, because the product name alone is already long enough that the brand suffix is dropped.

Fix: for those products, build the title from a different angle (add the condition, hashrate, or "Buy … — In Stock") so the title and the on-page headline never match word for word, while staying under 60 characters.

## 4. Duplicate meta descriptions (2 pages)

Confirmed: `bitmain-antminer-t21-190th` and `used-bitmain-antminer-t21-190th` share the same description text. Fix by writing a distinct description for the used listing (used-specific wording: tested, graded, warranty terms), and add a safeguard so a product without its own description falls back to text that includes its condition and slug-specific detail.

## 5. Invalid structured data (316 pages)

The exact errors are not identified yet, so the first step is measurement, not editing: dump the structured data from one page of each template (home, static page, guide, product, marketplace location, category, shop) and check every block against the required and recommended fields for its type. Known suspects to confirm and fix:
- Product offer shipping block has delivery times but no shipping rate.
- Business block on the homepage has no image or price range.
- Question-and-answer blocks attached to templates that also carry another main type.

Only errors confirmed by that check get changed; the plan then re-runs the same check to prove each page type comes back clean.

## Verification

- All titles unique across guides, products, categories and locations; no title identical to its page headline; no repeated descriptions.
- Structured data check passes for every template.
- Page download size measured before/after on three page types.
- Every touched page still returns a normal 200 response with no console errors.

No copy rewrites, pricing changes or routing changes beyond the filtered shop URLs noted above.
