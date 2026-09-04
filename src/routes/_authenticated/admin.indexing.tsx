import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Radar, Rocket } from "lucide-react";
import { toast } from "sonner";

import {
  INDEXNOW_COUNTS,
  INDEXNOW_KEY_LOCATION,
  fetchIndexNowHistory,
  pingIndexNow,
  type IndexNowResult,
  type IndexNowScope,
} from "@/lib/indexnow";

export const Route = createFileRoute("/_authenticated/admin/indexing")({
  component: AdminIndexing,
});

const SCOPES: { scope: IndexNowScope; label: string; hint: string }[] = [
  { scope: "pages", label: "Main pages", hint: "Home, categories and service pages" },
  { scope: "products", label: "Products", hint: "All product pages" },
  { scope: "blog", label: "Guides", hint: "All blog guides" },
  { scope: "marketplace", label: "Locations", hint: "City and state landing pages" },
];

const SOURCE_LABEL: Record<string, string> = {
  admin: "Manual",
  auto: "Automatic",
  cron: "Daily refresh",
};

function AdminIndexing() {
  const queryClient = useQueryClient();

  const history = useQuery({
    queryKey: ["indexnow-history"],
    queryFn: () => fetchIndexNowHistory(15),
  });

  const ping = useMutation<IndexNowResult, Error, IndexNowScope>({
    mutationFn: pingIndexNow,
    onSuccess: (r) => {
      toast.success(
        r.failed
          ? `${r.submitted} of ${r.urls} pages accepted — ${r.failed} rejected`
          : `${r.submitted} pages sent to Bing successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["indexnow-history"] });
    },
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

      <button
        type="button"
        disabled={ping.isPending}
        onClick={() => ping.mutate("all")}
        className="mt-6 flex w-full items-center gap-3 rounded-md border border-primary bg-primary/5 p-5 text-left transition-colors hover:bg-primary/10 disabled:opacity-60"
      >
        <Rocket className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <span className="block font-display text-lg font-bold uppercase tracking-tight text-charcoal">
            Submit all {INDEXNOW_COUNTS.all.toLocaleString()} pages
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {INDEXNOW_COUNTS.pages} main pages · {INDEXNOW_COUNTS.products} products ·{" "}
            {INDEXNOW_COUNTS.blog} guides · {INDEXNOW_COUNTS.marketplace.toLocaleString()} location
            pages
          </span>
        </span>
      </button>

      <h2 className="mt-8 font-display text-sm font-bold uppercase tracking-wide text-charcoal">
        Or send one group
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              {label} ({INDEXNOW_COUNTS[scope].toLocaleString()})
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
          </button>
        ))}
      </div>

      {ping.isPending && <p className="mt-6 text-sm text-muted-foreground">Submitting pages…</p>}

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

      <h2 className="mt-10 font-display text-sm font-bold uppercase tracking-wide text-charcoal">
        Submission history
      </h2>
      {history.isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      ) : history.data?.length ? (
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Group</th>
                <th className="px-3 py-2">Trigger</th>
                <th className="px-3 py-2">Pages</th>
                <th className="px-3 py-2">Accepted</th>
                <th className="px-3 py-2">Rejected</th>
                <th className="px-3 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {history.data.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 capitalize">{r.scope}</td>
                  <td className="px-3 py-2">{SOURCE_LABEL[r.source] ?? r.source}</td>
                  <td className="px-3 py-2">{r.url_count.toLocaleString()}</td>
                  <td className="px-3 py-2 text-charcoal">{r.accepted.toLocaleString()}</td>
                  <td className="px-3 py-2">{r.failed.toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No submissions recorded yet — use the button above to send your first batch.
        </p>
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
