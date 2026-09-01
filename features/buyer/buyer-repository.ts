import { AssetStatus, Prisma, UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { requireActiveRole } from "@/features/auth/authorization";
import { calculateAssetMatch } from "@/features/matching/matching-service";

import type { BuyerProfileFormValues } from "./buyer-profile-validation";
import type { BuyerProfile, BuyerRecommendation } from "./buyer-types";

const demoBuyerEmail = "buyer@n5deal.demo";

const recommendationAssetSelection = {
  id: true,
  title: true,
  description: true,
  industry: true,
  valuation: true,
  currency: true,
  location: true,
  revenue: true,
  seller: { select: { email: true, name: true } },
} satisfies Prisma.AssetSelect;

export class DemoBuyerUnavailableError extends Error {
  override readonly name = "DemoBuyerUnavailableError";

  constructor() {
    super("The demo buyer account is unavailable. Seed the database and try again.");
  }
}

export async function getDemoBuyer(): Promise<Readonly<{ id: string }>> {
  const buyer = await prisma.user.findFirst({
    select: { id: true, role: true, status: true },
    where: { email: demoBuyerEmail },
  });

  if (buyer === null) {
    throw new DemoBuyerUnavailableError();
  }

  requireActiveRole(buyer, UserRole.BUYER);
  return { id: buyer.id };
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

export async function getBuyerRecommendations(): Promise<readonly BuyerRecommendation[]> {
  const profile = await getBuyerProfile();
  if (profile === null) {
    return [];
  }

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    select: recommendationAssetSelection,
    where: { status: AssetStatus.PUBLISHED },
  });

  return assets
    .map((asset) => {
      const match = calculateAssetMatch(
        {
          budgetMax: profile.budgetMax === null ? null : Number(profile.budgetMax),
          budgetMin: profile.budgetMin === null ? null : Number(profile.budgetMin),
          industries: profile.industries,
          interests: profile.interests,
          preferredLocations: profile.preferredLocations,
        },
        {
          description: asset.description,
          industry: asset.industry,
          location: asset.location,
          title: asset.title,
          valuation: Number(asset.valuation),
        },
      );

      return {
        asset: {
          id: asset.id,
          title: asset.title,
          description: asset.description,
          industry: asset.industry,
          valuation: asset.valuation.toString(),
          currency: asset.currency,
          location: asset.location,
          revenue: asset.revenue?.toString() ?? null,
          sellerName: asset.seller.name,
          sellerEmail: asset.seller.email,
        },
        reasons: match.reasons,
        score: match.score,
      };
    })
    .filter((recommendation) => recommendation.score > 0)
    .sort((left, right) => right.score - left.score);
}
