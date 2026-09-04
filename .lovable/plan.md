# IndexNow + inbound links from mining directories

Two goals from Bing Webmaster Tools: get new and updated pages submitted instantly, and earn links from real industry sites.

## 1. Instant indexing (IndexNow)

Bing, Yandex and others accept an "IndexNow" ping so pages get crawled in minutes instead of days.

- Generate one API key and publish it as a key file at the site root, so Bing can verify ownership.
- Add a small admin-only button ("Ping search engines") that submits the site's URLs to IndexNow in batches and shows how many were accepted.
- Add an automatic ping whenever a product is created or updated in the admin panel, plus a scheduled-safe endpoint that resubmits the full sitemap on demand.
- Report the submission result back in plain language (accepted / rejected, with the reason).

Note: IndexNow speeds up crawling for Bing and partner engines. Google does not use it, so the existing sitemaps stay in place for Google.

## 2. Inbound links from mining directories and marketplaces

Verified targets that publicly accept vendor submissions:

- CanYouMineIt — ASIC vendor directory, open application form
- MinerCompare — vendor/marketplace listing
- Ziven.io — bitcoin mining company directory (distributors category)
- BitcoinMiningCost — vendor and hosting marketplace

For each one I will prepare a ready-to-submit listing pack: company name, one-line and long descriptions written around your target keywords, categories, Hong Kong location, shipping coverage, contact details, logo and preview image, and the exact page each listing should link to (home, used ASIC miners, or the marketplace hub). Delivered as a single page you can copy from.

Submissions themselves are external forms, so you send them; I cannot submit on your behalf. I will list them in order of expected value with what each one asks for.

## Technical notes

- Key file in `public/` plus a public API route under `src/routes/api/public/` that forwards URL batches to `api.indexnow.org`, reading the key from a project secret.
- URL list built from the existing static sitemaps so all product, blog and marketplace pages are covered.
- Admin trigger added to the existing admin dashboard; no changes to storefront pages or styling.
