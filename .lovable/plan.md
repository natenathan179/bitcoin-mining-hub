# Publish every URL to IndexNow

Bing wants all 1,528 of your pages pushed to IndexNow, not just a few. The submit tool already exists at Search engines in the admin area; this makes it complete, automatic and repeatable.

## What you get

1. **One-click full submission** — a primary "Submit all 1,528 pages" button that sends every page from all sitemaps (25 main pages, 137 products, 291 guides, 1,075 location pages) in one run, with a clear count of how many were accepted.
2. **A record of submissions** — after each run the page shows when it last ran, which group was sent, how many were accepted or rejected, and the reason for any rejection, so you can answer Bing's report with facts.
3. **Automatic pings on every change** — product saves already ping; this extends it to product deletes, review changes and category changes, so anything you touch in the admin is announced immediately.
4. **A daily refresh endpoint** — a single URL an external scheduler can call once a day to resubmit everything, so newly added guides and locations never wait. I'll give you the URL and the setup steps.
5. **Safety rails** — a per-run cap and duplicate filtering so the same URL isn't hammered, and only pages that actually exist on your domain get sent.

## Technical notes

- Extend the existing `src/routes/api/public/indexnow.ts`: keep scope handling, add a shared-secret-protected `GET`/`POST` cron path for scheduled full submissions, and split into 10,000-URL batches (currently one batch covers everything).
- Persist run history in a new `indexnow_submissions` table (scope, url_count, accepted, failed, message, created_at) with RLS restricted to admins plus service_role grants; the admin page reads the latest rows.
- Rework `/admin/indexing` around a prominent "Submit everything" action, keep the per-group buttons as secondary, and render the history table.
- Add best-effort `pingIndexNowUrls` calls to admin delete/review/category mutations, reusing the existing helper in `src/lib/indexnow.ts`.
- No storefront or styling changes.
