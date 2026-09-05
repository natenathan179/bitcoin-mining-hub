import { createServerFn } from "@tanstack/react-start";

import type { MarketplacePage } from "./marketplace";

export interface MarketplacePageData {
  page: MarketplacePage;
  related: { slug: string; keyword: string }[];
}

/**
 * Build one location page on the server.
 *
 * The location database is ~170 KB, so resolving the page here keeps it out of
 * every visitor's first download while the HTML still contains full content.
 */
export const getMarketplacePageFn = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data?.slug ?? "") }))
  .handler(async ({ data }): Promise<MarketplacePageData | null> => {
    const { getLocation, buildPage, relatedLocations } = await import("./marketplace");
    const loc = getLocation(data.slug);
    if (!loc) return null;
    return {
      page: buildPage(loc),
      related: relatedLocations(loc, 12).map((r) => ({ slug: r.slug, keyword: r.keyword })),
    };
  });
