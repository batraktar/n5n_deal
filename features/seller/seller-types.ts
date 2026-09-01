import type { AssetStatus } from "@/generated/prisma/client";

export type SellerAsset = Readonly<{
  id: string;
  title: string;
  description: string;
  industry: string;
  valuation: string;
  currency: string;
  location: string;
  revenue: string | null;
  status: AssetStatus;
  updatedAt: Date;
}>;

export type SellerAssetFormState = Readonly<{
  kind: "idle" | "validation_error" | "error";
  message: string | null;
  fieldErrors: Readonly<Partial<Record<keyof import("./asset-validation").AssetFormValues, string | undefined>>>;
}>;

export type SellerBuyer = Readonly<{
  budgetMax: string | null;
  budgetMin: string | null;
  companyName: string | null;
  currency: string;
  id: string;
  industries: readonly string[];
  interests: string;
  matchReasons: readonly string[];
  matchScore: number | null;
  name: string;
  preferredLocations: readonly string[];
}>;

export type SellerBuyerFilterOptions = Readonly<{
  industries: readonly string[];
  locations: readonly string[];
}>;

export const initialSellerAssetFormState: SellerAssetFormState = {
  fieldErrors: {},
  kind: "idle",
  message: null,
};
