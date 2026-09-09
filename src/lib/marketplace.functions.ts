import { createServerFn } from "@tanstack/react-start";

import type { MarketPage } from "./marketplace-page";

export interface MarketplacePageData {
  page: MarketPage;
  related: { slug: string; keyword: string }[];
}

/**
 * Build one location page on the server.
 *
 * Only the small shard containing this slug is loaded, so neither the 159 KB
 * location database nor a full-table neighbour scan runs per request.
 */
export const getMarketplacePageFn = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data?.slug ?? "") }))
  .handler(async ({ data }): Promise<MarketplacePageData | null> => {
    const [{ getLocationEntryAsync }, { buildPage }] = await Promise.all([
      import("./marketplace-shards"),
      import("./marketplace-page"),
    ]);
    const entry = await getLocationEntryAsync(data.slug);
    if (!entry) return null;
    return { page: buildPage(entry.loc), related: entry.related };
  });

