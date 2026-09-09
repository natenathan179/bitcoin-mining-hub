import type { MarketplaceLocation } from "../marketplace-page";

export interface LocationEntry {
  loc: MarketplaceLocation;
  related: { slug: string; keyword: string }[];
}
