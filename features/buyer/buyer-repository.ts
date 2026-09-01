import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import type { BuyerProfileFormValues } from "./buyer-profile-validation";
import type { BuyerProfile } from "./buyer-types";

const demoBuyerEmail = "buyer@n5deal.demo";

export class DemoBuyerUnavailableError extends Error {
  override readonly name = "DemoBuyerUnavailableError";

  constructor() {
    super("The demo buyer account is unavailable. Seed the database and try again.");
  }
}

export async function getDemoBuyer(): Promise<Readonly<{ id: string }>> {
  const buyer = await prisma.user.findFirst({
    select: { id: true },
    where: { email: demoBuyerEmail, role: UserRole.BUYER, status: UserStatus.ACTIVE },
  });

  if (buyer === null) {
    throw new DemoBuyerUnavailableError();
  }

  return buyer;
}

function toBuyerProfile(profile: {
  readonly budgetMax: { toString(): string } | null;
  readonly budgetMin: { toString(): string } | null;
  readonly companyName: string | null;
  readonly currency: string;
  readonly industries: readonly string[];
  readonly interests: string;
  readonly preferredLocations: readonly string[];
}): BuyerProfile {
  return {
    budgetMax: profile.budgetMax?.toString() ?? null,
    budgetMin: profile.budgetMin?.toString() ?? null,
    companyName: profile.companyName,
    currency: profile.currency,
    industries: profile.industries,
    interests: profile.interests,
    preferredLocations: profile.preferredLocations,
  };
}

export async function getBuyerProfile(): Promise<BuyerProfile | null> {
  const buyer = await getDemoBuyer();
  const profile = await prisma.buyerProfile.findUnique({ where: { userId: buyer.id } });
  return profile === null ? null : toBuyerProfile(profile);
}

export async function saveBuyerProfile(input: BuyerProfileFormValues): Promise<void> {
  const buyer = await getDemoBuyer();
  await prisma.buyerProfile.upsert({
    create: {
      budgetMax: input.budgetMax ?? null,
      budgetMin: input.budgetMin ?? null,
      companyName: input.companyName ?? null,
      currency: input.currency,
      industries: input.industries,
      interests: input.interests,
      preferredLocations: input.preferredLocations,
      userId: buyer.id,
    },
    update: {
      budgetMax: input.budgetMax ?? null,
      budgetMin: input.budgetMin ?? null,
      companyName: input.companyName ?? null,
      currency: input.currency,
      industries: input.industries,
      interests: input.interests,
      preferredLocations: input.preferredLocations,
    },
    where: { userId: buyer.id },
  });
}
