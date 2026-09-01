import { AssetStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { getDemoBuyer } from "@/features/buyer/buyer-repository";
import { canBuyerContactSeller } from "./message-validation";

export type BuyerMessageActionState = Readonly<{
  kind: "idle" | "validation_error" | "error" | "success";
  message: string | null;
}>;

export const initialBuyerMessageActionState: BuyerMessageActionState = {
  kind: "idle",
  message: null,
};

export async function createBuyerMessage(assetId: string, content: string): Promise<BuyerMessageActionState> {
  const buyer = await getDemoBuyer();
  const asset = await prisma.asset.findFirst({
    select: { sellerId: true },
    where: { id: assetId, status: AssetStatus.PUBLISHED },
  });

  if (asset === null) {
    return { kind: "error", message: "This opportunity is no longer available." };
  }

  if (!canBuyerContactSeller(buyer.id, asset.sellerId)) {
    return { kind: "error", message: "You cannot contact your own listing." };
  }

  await prisma.message.create({
    data: {
      assetId,
      content,
      receiverId: asset.sellerId,
      senderId: buyer.id,
    },
  });

  return { kind: "success", message: "Message sent to the seller." };
}
