import { AssetStatus, Prisma, UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { requireActiveRole } from "@/features/auth/authorization";
import { getAssetTranslationMap, getBuyerProfileTranslation } from "@/features/i18n/content-repository";
import { mergeBuyerProfileTranslation } from "@/features/i18n/content-utils";
import { calculateAssetMatch } from "@/features/matching/matching-service";
import { defaultLocale, type Locale } from "@/i18n/config";

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

const buyerProfileSelection = {
  id: true,
  budgetMax: true,
  budgetMin: true,
  companyName: true,
  currency: true,
  industries: true,
  interests: true,
  preferredLocations: true,
} satisfies Prisma.BuyerProfileSelect;

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

function toBuyerProfile(
  profile: {
  readonly budgetMax: { toString(): string } | null;
  readonly budgetMin: { toString(): string } | null;
  readonly companyName: string | null;
  readonly currency: string;
  readonly industries: readonly string[];
  readonly interests: string;
  readonly preferredLocations: readonly string[];
  },
  translation: Readonly<{
    readonly industries: readonly string[];
    readonly interests: string;
    readonly preferredLocations: readonly string[];
  }> | null,
): BuyerProfile {
  const content = mergeBuyerProfileTranslation(
    {
      industries: profile.industries,
      interests: profile.interests,
      preferredLocations: profile.preferredLocations,
    },
    translation,
  );

  return {
    budgetMax: profile.budgetMax?.toString() ?? null,
    budgetMin: profile.budgetMin?.toString() ?? null,
    companyName: profile.companyName,
    currency: profile.currency,
    industries: content.industries,
    interests: content.interests,
    preferredLocations: content.preferredLocations,
  };
}

async function getCoreBuyerProfile(): Promise<Prisma.BuyerProfileGetPayload<{ select: typeof buyerProfileSelection }> | null> {
  const buyer = await getDemoBuyer();
  return prisma.buyerProfile.findUnique({ select: buyerProfileSelection, where: { userId: buyer.id } });
}

export async function getBuyerProfile(locale: Locale = defaultLocale): Promise<BuyerProfile | null> {
  const profile = await getCoreBuyerProfile();
  if (profile === null) {
    return null;
  }

  const translation = await getBuyerProfileTranslation(profile.id, locale);
  return toBuyerProfile(profile, translation);
}

export async function saveBuyerProfile(input: BuyerProfileFormValues, locale: Locale = defaultLocale): Promise<void> {
  const buyer = await getDemoBuyer();
  const profile = await prisma.buyerProfile.upsert({
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
      ...(locale === defaultLocale
        ? {
          industries: input.industries,
          interests: input.interests,
          preferredLocations: input.preferredLocations,
        }
        : {}),
    },
    where: { userId: buyer.id },
  });

  await prisma.buyerProfileTranslation.upsert({
    where: { buyerProfileId_locale: { buyerProfileId: profile.id, locale } },
    update: {
      industries: input.industries,
      interests: input.interests,
      preferredLocations: input.preferredLocations,
    },
    create: {
      buyerProfileId: profile.id,
      industries: input.industries,
      interests: input.interests,
      locale,
      preferredLocations: input.preferredLocations,
    },
  });
}

export async function getBuyerRecommendations(locale: Locale = defaultLocale): Promise<readonly BuyerRecommendation[]> {
  const profile = await getCoreBuyerProfile();
  if (profile === null) {
    return [];
  }

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    select: recommendationAssetSelection,
    where: { status: AssetStatus.PUBLISHED },
  });
  const translations = await getAssetTranslationMap(assets.map((asset) => asset.id), locale);

  return assets
    .map((asset) => {
      const match = calculateAssetMatch(
        {
          budgetMax: profile.budgetMax === null ? null : Number(profile.budgetMax),
          budgetMin: profile.budgetMin === null ? null : Number(profile.budgetMin),
          currency: profile.currency,
          industries: profile.industries,
          interests: profile.interests,
          preferredLocations: profile.preferredLocations,
        },
        {
          currency: asset.currency,
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
          title: translations.get(asset.id)?.title ?? asset.title,
          description: translations.get(asset.id)?.description ?? asset.description,
          industry: translations.get(asset.id)?.industry ?? asset.industry,
          valuation: asset.valuation.toString(),
          currency: asset.currency,
          location: translations.get(asset.id)?.location ?? asset.location,
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
