import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { getDemoSeller } from "@/features/seller/seller-repository";

import type { BuyerMessageActionState } from "./message-validation";

export async function createSellerMessage(
  buyerId: string,
  content: string,
): Promise<BuyerMessageActionState> {
  const seller = await getDemoSeller();
  const buyer = await prisma.user.findFirst({
    select: { id: true },
    where: {
      buyerProfile: { isNot: null },
      id: buyerId,
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
    },
  });

  if (buyer === null) {
    return { kind: "error", message: "This buyer is no longer available." };
  }

  await prisma.message.create({
    data: {
      content,
      receiverId: buyer.id,
      senderId: seller.id,
    },
  });

  return { kind: "success", message: "Message sent to the buyer." };
}
