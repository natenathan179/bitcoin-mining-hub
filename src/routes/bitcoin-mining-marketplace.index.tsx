import { createFileRoute } from "@tanstack/react-router";

import MarketplaceDirectory from "@/components/site/MarketplaceDirectory";
import { SITE } from "@/lib/site";
import { indexVariantMeta, parseIndexSearch, type IndexSearch } from "@/lib/search-meta";

const BASE = {
  title: "Bitcoin Mining Marketplace | Buy ASIC Miners Near You",
  description:
    "Buy ASIC miners, the Bitmain Antminer S23 and Antminer Z15 Pro in 1,000+ cities and states across the USA, Canada, UK, Europe and Australia — shipped worldwide from Hong Kong.",
};

export const Route = createFileRoute("/bitcoin-mining-marketplace/")({
  validateSearch: parseIndexSearch,
  loaderDeps: ({ search }: { search: IndexSearch }) => search,
  loader: ({ deps }) => deps,
  head: ({ loaderData }) => {
    const variant = indexVariantMeta(BASE, loaderData);
    return {
    meta: [
      { title: variant?.title ?? BASE.title },
      {
        name: "description",
        content: variant?.description ?? BASE.description,
      },
      ...(variant ? [{ name: "robots", content: variant.robots }] : []),
      { property: "og:title", content: "Bitcoin Mining Marketplace | Bitcoin Mining Depot" },
      {
        property: "og:description",
        content:
          "Location-by-location buying guides with live pricing, shipping lanes, duty guidance and in-stock ASIC mining hardware for your city or state.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE.url}/bitcoin-mining-marketplace` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/bitcoin-mining-marketplace` }],
  }),
  component: MarketplaceDirectory,
});

