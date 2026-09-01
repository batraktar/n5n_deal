import { z } from "zod";

export const buyerMessageFormSchema = z.object({
  content: z.string().trim().min(10, "Write at least 10 characters.").max(1_000),
});

export type BuyerMessageFormValues = z.infer<typeof buyerMessageFormSchema>;

function readFormField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function parseBuyerMessageFormData(formData: FormData) {
  return buyerMessageFormSchema.safeParse({ content: readFormField(formData, "content") });
}

export function canBuyerContactSeller(buyerId: string, sellerId: string): boolean {
  return buyerId !== sellerId;
}
