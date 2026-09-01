import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { type Locale } from "@/i18n/config";
import {
  localeCandidates,
  type AssetTranslationContent,
  type BuyerProfileTranslationContent,
  selectPreferredTranslation,
} from "./content-utils";

const assetTranslationSelection = {
  assetId: true,
  description: true,
  industry: true,
  locale: true,
  location: true,
  title: true,
} satisfies Prisma.AssetTranslationSelect;

const buyerProfileTranslationSelection = {
  buyerProfileId: true,
  industries: true,
  interests: true,
  locale: true,
  preferredLocations: true,
} satisfies Prisma.BuyerProfileTranslationSelect;

type AssetTranslationRecord = Prisma.AssetTranslationGetPayload<{
  select: typeof assetTranslationSelection;
}>;

type BuyerProfileTranslationRecord = Prisma.BuyerProfileTranslationGetPayload<{
  select: typeof buyerProfileTranslationSelection;
}>;

export async function getAssetTranslationMap(
  assetIds: readonly string[],
  locale: Locale,
): Promise<ReadonlyMap<string, AssetTranslationContent>> {
  if (assetIds.length === 0) {
    return new Map();
  }

  const translations = await prisma.assetTranslation.findMany({
    select: assetTranslationSelection,
    where: { assetId: { in: [...assetIds] }, locale: { in: [...localeCandidates(locale)] } },
  });
  const grouped = new Map<string, AssetTranslationRecord[]>();

  for (const translation of translations) {
    const current = grouped.get(translation.assetId) ?? [];
    current.push(translation);
    grouped.set(translation.assetId, current);
  }

  const selected = new Map<string, AssetTranslationContent>();
  for (const [assetId, records] of grouped) {
    const translation = selectPreferredTranslation(records, locale);
    if (translation !== null) {
      selected.set(assetId, {
        description: translation.description,
        industry: translation.industry,
        location: translation.location,
        title: translation.title,
      });
    }
  }

  return selected;
}

export async function getBuyerProfileTranslation(
  buyerProfileId: string,
  locale: Locale,
): Promise<BuyerProfileTranslationContent | null> {
  const translations = await prisma.buyerProfileTranslation.findMany({
    select: buyerProfileTranslationSelection,
    where: { buyerProfileId, locale: { in: [...localeCandidates(locale)] } },
  });
  const translation = selectPreferredTranslation(translations, locale);

  return translation === null
    ? null
    : {
      industries: translation.industries,
      interests: translation.interests,
      preferredLocations: translation.preferredLocations,
    };
}

export async function getBuyerProfileTranslationMap(
  buyerProfileIds: readonly string[],
  locale: Locale,
): Promise<ReadonlyMap<string, BuyerProfileTranslationContent>> {
  if (buyerProfileIds.length === 0) {
    return new Map();
  }

  const translations = await prisma.buyerProfileTranslation.findMany({
    select: buyerProfileTranslationSelection,
    where: { buyerProfileId: { in: [...buyerProfileIds] }, locale: { in: [...localeCandidates(locale)] } },
  });
  const grouped = new Map<string, BuyerProfileTranslationRecord[]>();

  for (const translation of translations) {
    const current = grouped.get(translation.buyerProfileId) ?? [];
    current.push(translation);
    grouped.set(translation.buyerProfileId, current);
  }

  const selected = new Map<string, BuyerProfileTranslationContent>();
  for (const [buyerProfileId, records] of grouped) {
    const translation = selectPreferredTranslation(records, locale);
    if (translation !== null) {
      selected.set(buyerProfileId, {
        industries: translation.industries,
        interests: translation.interests,
        preferredLocations: translation.preferredLocations,
      });
    }
  }

  return selected;
}
