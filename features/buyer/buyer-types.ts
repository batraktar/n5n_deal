import type { BuyerProfileFormValues } from "./buyer-profile-validation";
import type { AssetPreview } from "@/features/assets/asset-types";

export type BuyerProfile = Readonly<{
  budgetMax: string | null;
  budgetMin: string | null;
  companyName: string | null;
  currency: string;
  industries: readonly string[];
  interests: string;
  preferredLocations: readonly string[];
}>;

export type BuyerProfileFormState = Readonly<{
  fieldErrors: Readonly<Partial<Record<keyof BuyerProfileFormValues, string | undefined>>>;
  kind: "idle" | "validation_error" | "error";
  message: string | null;
}>;

export type BuyerRecommendation = Readonly<{
  asset: AssetPreview;
  reasons: readonly string[];
  score: number;
}>;

export const initialBuyerProfileFormState: BuyerProfileFormState = {
  fieldErrors: {},
  kind: "idle",
  message: null,
};
