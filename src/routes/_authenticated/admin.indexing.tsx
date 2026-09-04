import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Radar } from "lucide-react";
import { toast } from "sonner";

import {
  INDEXNOW_KEY_LOCATION,
  pingIndexNow,
  type IndexNowResult,
  type IndexNowScope,
} from "@/lib/indexnow";

export const Route = createFileRoute("/_authenticated/admin/indexing")({
  component: AdminIndexing,
});

const SCOPES: { scope: IndexNowScope; label: string; hint: string }[] = [
  { scope: "all", label: "Everything", hint: "Every page in all sitemaps" },
  { scope: "pages", label: "Main pages", hint: "Home, categories and service pages" },
  { scope: "products", label: "Products", hint: "All product pages" },
  { scope: "blog", label: "Guides", hint: "All blog guides" },
  { scope: "marketplace", label: "Locations", hint: "City and state landing pages" },
];

function AdminIndexing() {
  const ping = useMutation<IndexNowResult, Error, IndexNowScope>({
    mutationFn: pingIndexNow,
    onSuccess: (r) =>
      toast.success(
        r.failed
          ? `${r.submitted} of ${r.urls} pages accepted — ${r.failed} rejected`
          : `${r.submitted} pages sent to Bing successfully`,
      ),
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-charcoal">
        Search engines
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Send your pages straight to Bing, Yandex and other IndexNow search engines so new products
        and guides get crawled within minutes instead of days. Google is not part of IndexNow — it
        keeps using the sitemaps.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCOPES.map(({ scope, label, hint }) => (
          <button
            key={scope}
            type="button"
            disabled={ping.isPending}
            onClick={() => ping.mutate(scope)}
            className="rounded-md border border-border bg-card p-4 text-left transition-colors hover:border-primary disabled:opacity-60"
          >
            <span className="flex items-center gap-2 font-semibold text-charcoal">
              <Radar className="h-4 w-4 text-primary" aria-hidden="true" />
              {label}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
          </button>
        ))}
      </div>

      {ping.isPending && (
        <p className="mt-6 text-sm text-muted-foreground">Submitting pages…</p>
      )}

      {ping.data && (
        <div className="mt-6 rounded-md border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-charcoal">
            {ping.data.submitted} of {ping.data.urls} pages accepted
          </p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {ping.data.batches.map((b, i) => (
              <li key={i}>
                {b.count} pages — {b.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Ownership key file:{" "}
        <a href={INDEXNOW_KEY_LOCATION} className="text-primary hover:underline">
          {INDEXNOW_KEY_LOCATION}
        </a>
      </p>
    </div>
  );
}
