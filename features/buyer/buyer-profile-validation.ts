import { z } from "zod";

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === undefined ? undefined : value),
  z.coerce.number().positive("budgetPositive").max(100_000_000_000).optional(),
);

function toPreferenceList(value: string): string[] {
  return [...new Set(value.split(",").map((item) => item.trim()).filter((item) => item.length > 0))];
}

export const buyerProfileFormSchema = z.object({
  companyName: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().min(2).max(120).optional(),
  ),
  interests: z.string().trim().min(20, "interestsMin").max(2_000, "interestsMax"),
  industries: z.string().trim().min(2, "industryList").transform(toPreferenceList).pipe(z.array(z.string()).min(1, "industryList")),
  preferredLocations: z.string().trim().min(2, "locationList").transform(toPreferenceList).pipe(z.array(z.string()).min(1, "locationList")),
  budgetMin: optionalPositiveNumber,
  budgetMax: optionalPositiveNumber,
  currency: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
    z.string().length(3).regex(/^[A-Z]{3}$/, "currencyCode").default("USD"),
  ),
}).superRefine((data, context) => {
  if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMin > data.budgetMax) {
    context.addIssue({
      code: "custom",
      message: "budgetOrder",
      path: ["budgetMax"],
    });
  }
});

export type BuyerProfileFormInput = z.input<typeof buyerProfileFormSchema>;
export type BuyerProfileFormValues = z.infer<typeof buyerProfileFormSchema>;

function readFormField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function parseBuyerProfileFormData(formData: FormData) {
  return buyerProfileFormSchema.safeParse({
    budgetMax: readFormField(formData, "budgetMax"),
    budgetMin: readFormField(formData, "budgetMin"),
    companyName: readFormField(formData, "companyName"),
    currency: readFormField(formData, "currency"),
    industries: readFormField(formData, "industries"),
    interests: readFormField(formData, "interests"),
    preferredLocations: readFormField(formData, "preferredLocations"),
  });
}
