import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";

import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Stars } from "@/components/site/Stars";
import { reviewsQuery } from "@/lib/data";

export const Route = createFileRoute("/reviews")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(reviewsQuery());
  },
  head: () => ({
    meta: [
      { title: "Customer Reviews | Bitcoin Mining Depot" },
      {
        name: "description",
        content:
          "Read verified customer reviews of Bitcoin Mining Depot from miners in 100+ countries covering hardware quality, shipping speed, hosting and repair service.",
      },
      { property: "og:title", content: "Verified Customer Reviews | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "Verified buyer feedback on ASIC miners, hosting and repairs from customers worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data: reviews } = useSuspenseQuery(reviewsQuery());
  const avg = reviews.length
    ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length
    : 0;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Customer feedback"
        title="Reviews From Real Miners"
        subtitle="Every review below comes from a verified purchase — hardware, hosting or repair work. We publish the critical feedback alongside the praise because that is how you judge a hardware vendor."
      />

      <section className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-10 px-4 py-8 text-center">
          <div>
            <p className="font-display text-4xl font-bold text-charcoal">{avg.toFixed(1)}</p>
            <div className="mt-1 flex justify-center">
              <Stars rating={Math.round(avg)} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Average rating</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-charcoal">{reviews.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">Published reviews</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-charcoal">100+</p>
            <p className="mt-2 text-xs text-muted-foreground">Countries served</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <article
            key={r.id}
            className="flex flex-col rounded-md border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-3">
              <img
                src={r.avatar_url}
                alt={`${r.name} profile photo`}
                loading="lazy"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-charcoal">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.location}</p>
              </div>
            </div>
            <div className="mt-4">
              <Stars rating={r.rating} />
            </div>
            {r.title && (
              <h2 className="mt-3 font-display text-base font-semibold uppercase tracking-wide text-charcoal">
                {r.title}
              </h2>
            )}
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
              <span>{r.product_name}</span>
              {r.verified && (
                <span className="flex items-center gap-1 text-success">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified purchase
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}