export type AssetPreview = Readonly<{
  id: string;
  title: string;
  description: string;
  industry: string;
  valuation: string;
  currency: string;
  location: string;
  revenue: string | null;
  sellerName: string;
  sellerEmail: string;
}>;

export type AssetListing = Readonly<{
  assets: readonly AssetPreview[];
  page: number;
  pageCount: number;
  total: number;
}>;

export type AssetFilterOptions = Readonly<{
  industries: readonly string[];
  locations: readonly string[];
}>;
