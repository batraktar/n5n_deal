import { z } from "zod";

export const buyerMessageFormSchema = z.object({
  content: z.string().trim().min(10, "Write at least 10 characters.").max(1_000),
});

const requiredBuyerId = z.string().trim().min(1, "A buyer is required.").max(64);

export const sellerMessageFormSchema = z.object({
  buyerId: requiredBuyerId,
  content: z.string().trim().min(10, "Write at least 10 characters.").max(1_000),
});

export type BuyerMessageFormValues = z.infer<typeof buyerMessageFormSchema>;

export type BuyerMessageActionState = Readonly<{
  kind: "idle" | "validation_error" | "error" | "success";
  message: string | null;
}>;

export const initialBuyerMessageActionState: BuyerMessageActionState = {
  kind: "idle",
  message: null,
};

function readFormField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function parseBuyerMessageFormData(formData: FormData) {
  return buyerMessageFormSchema.safeParse({ content: readFormField(formData, "content") });
}

export function parseSellerMessageFormData(formData: FormData) {
  return sellerMessageFormSchema.safeParse({
    buyerId: readFormField(formData, "buyerId"),
    content: readFormField(formData, "content"),
  });
}

export function canBuyerContactSeller(buyerId: string, sellerId: string): boolean {
  return buyerId !== sellerId;
}
