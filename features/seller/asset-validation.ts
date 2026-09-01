import { z } from "zod";

export const assetStatusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z.coerce.number().positive("revenuePositive").max(100_000_000_000).optional(),
);

export const assetFormSchema = z.object({
  title: z.string().trim().min(3, "assetTitleMin").max(140, "assetTitleMax"),
  description: z.string().trim().min(30, "descriptionMin").max(4_000, "descriptionMax"),
  industry: z.string().trim().min(2, "industryRequired").max(80, "industryMax"),
  valuation: z.coerce.number().positive("valuationPositive").max(100_000_000_000),
  currency: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
    z.string().length(3).regex(/^[A-Z]{3}$/, "currencyCode").default("USD"),
  ),
  location: z.string().trim().min(2, "locationRequired").max(120, "locationMax"),
  revenue: optionalPositiveNumber,
  status: z.enum(assetStatusOptions),
});

export const assetStatusSchema = z.object({
  status: z.enum(assetStatusOptions),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
export type AssetFormInput = z.input<typeof assetFormSchema>;

function readFormField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function parseAssetFormData(formData: FormData) {
  return assetFormSchema.safeParse({
    currency: readFormField(formData, "currency"),
    description: readFormField(formData, "description"),
    industry: readFormField(formData, "industry"),
    location: readFormField(formData, "location"),
    revenue: readFormField(formData, "revenue"),
    status: readFormField(formData, "status"),
    title: readFormField(formData, "title"),
    valuation: readFormField(formData, "valuation"),
  });
}

export function parseAssetStatusFormData(formData: FormData) {
  return assetStatusSchema.safeParse({ status: readFormField(formData, "status") });
}

export function readAssetId(formData: FormData): string | undefined {
  return readFormField(formData, "assetId");
}
