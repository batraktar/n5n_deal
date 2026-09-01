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

export const initialSellerAssetFormState: SellerAssetFormState = {
  fieldErrors: {},
  kind: "idle",
  message: null,
};
