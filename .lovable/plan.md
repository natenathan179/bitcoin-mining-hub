# Daily automatic page submission to Bing

IndexNow already works on your site: the ownership key is live, the "Search engines" admin page can send every page, and product, review and category changes ping automatically. The missing piece is a hands-off daily run.

## What you get

1. **A scheduled daily run** — once a day, all 1,528 pages are announced to Bing and the other IndexNow engines automatically, with no clicking.
2. **Visible proof** — each daily run shows up in the submission history on the Search engines page, marked "Daily refresh", with how many pages were accepted or rejected.
3. **Nothing else changes** — the storefront, styling and the manual buttons stay exactly as they are.

## Technical notes

- Enable `pg_cron` and `pg_net`, then schedule a job (`indexnow-daily-full-submission`, `0 6 * * *` UTC) that POSTs to `https://project--4526ef82-6dd4-47e7-ab1f-a5dbe1f61c6e.lovable.app/api/public/indexnow?scope=all` with the `x-indexnow-secret` header set to the stored `INDEXNOW_CRON_SECRET`.
- The existing handler already recognises that secret via `cronAuthorized()` and logs the run to `indexnow_submissions` with `source: "cron"`, so no route changes are needed; verify the daily row appears.
- Schedule created with `run_sql` (contains the secret), not a migration. Once daily keeps costs minimal and matches how often new guides and locations appear.
