import { AssetStatus, Prisma, UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { getBuyerProfileTranslationMap } from "@/features/i18n/content-repository";
import { calculateAssetMatch } from "@/features/matching/matching-service";
import { defaultLocale, type Locale } from "@/i18n/config";

import { getDemoSeller } from "./seller-repository";

import type { MatchAsset, MatchBuyerProfile } from "@/features/matching/matching-service";
import type { SellerBuyer, SellerBuyerFilterOptions } from "./seller-types";
import type { SellerBuyerBudgetFilter, SellerBuyerSearch } from "./buyer-search";

const buyerSelection = {
  buyerProfile: {
    select: {
      id: true,
      budgetMax: true,
      budgetMin: true,
      companyName: true,
      currency: true,
      industries: true,
      interests: true,
      preferredLocations: true,
    },
  },
  id: true,
  name: true,
} satisfies Prisma.UserSelect;

const matchingAssetSelection = {
  currency: true,
  description: true,
  industry: true,
  location: true,
  title: true,
  valuation: true,
} satisfies Prisma.AssetSelect;

type BuyerRecord = Prisma.UserGetPayload<{ select: typeof buyerSelection }>;
type MatchingAssetRecord = Prisma.AssetGetPayload<{ select: typeof matchingAssetSelection }>;

function buildBuyerWhere(search: SellerBuyerSearch, locale: Locale): Prisma.UserWhereInput {
  const profileWhere: Prisma.BuyerProfileWhereInput = {};
  const locales = locale === defaultLocale ? [defaultLocale] : [locale, defaultLocale];

  if (search.industry !== undefined) {
    profileWhere.OR = [
      { industries: { has: search.industry } },
      { translations: { some: { industries: { has: search.industry }, locale: { in: locales } } } },
    ];
  }

  if (search.location !== undefined) {
    const locationFilter = {
      OR: [
        { preferredLocations: { has: search.location } },
        { translations: { some: { locale: { in: locales }, preferredLocations: { has: search.location } } } },
      ],
    } satisfies Prisma.BuyerProfileWhereInput;
    if (profileWhere.OR === undefined) {
      profileWhere.OR = locationFilter.OR;
    } else {
      profileWhere.AND = [{ OR: profileWhere.OR }, locationFilter];
      delete profileWhere.OR;
    }
  }

  return {
    buyerProfile: { is: profileWhere },
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
  };
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function matchesQuery(
  buyer: BuyerRecord,
  query: string | undefined,
  translation: Readonly<{
    readonly industries: readonly string[];
    readonly interests: string;
    readonly preferredLocations: readonly string[];
  }> | undefined,
): boolean {
  if (query === undefined) {
    return true;
  }

  const profile = buyer.buyerProfile;
  if (profile === null) {
    return false;
  }

  const normalizedQuery = normalize(query);
  const searchableValues = [
    buyer.name,
    profile.companyName ?? "",
    translation?.interests ?? profile.interests,
    ...(translation?.industries ?? profile.industries),
    ...(translation?.preferredLocations ?? profile.preferredLocations),
  ];

  return searchableValues.some((value) => normalize(value).includes(normalizedQuery));
}

function toMatchBuyerProfile(buyer: BuyerRecord): MatchBuyerProfile {
  if (buyer.buyerProfile === null) {
    throw new Error("A buyer profile is required for matching.");
  }

  return {
    budgetMax: buyer.buyerProfile.budgetMax === null ? null : Number(buyer.buyerProfile.budgetMax),
    budgetMin: buyer.buyerProfile.budgetMin === null ? null : Number(buyer.buyerProfile.budgetMin),
    currency: buyer.buyerProfile.currency,
    industries: buyer.buyerProfile.industries,
    interests: buyer.buyerProfile.interests,
    preferredLocations: buyer.buyerProfile.preferredLocations,
  };
}

function toMatchAsset(asset: MatchingAssetRecord): MatchAsset {
  return {
    currency: asset.currency,
    description: asset.description,
    industry: asset.industry,
    location: asset.location,
    title: asset.title,
    valuation: Number(asset.valuation),
  };
}

function bestMatch(buyer: BuyerRecord, assets: readonly MatchingAssetRecord[]) {
  if (assets.length === 0) {
    return null;
  }

  const profile = toMatchBuyerProfile(buyer);
  return assets
    .map((asset) => calculateAssetMatch(profile, toMatchAsset(asset)))
    .reduce((best, current) => (current.score > best.score ? current : best));
}

function matchesBudgetFilter(
  match: ReturnType<typeof bestMatch>,
  budget: SellerBuyerBudgetFilter,
): boolean {
  if (budget === "ALL") {
    return true;
  }

  if (match === null) {
    return false;
  }

  const budgetCompatible = match.reasons.includes("Budget compatible");
  return budget === "COMPATIBLE" ? budgetCompatible : !budgetCompatible;
}

function toSellerBuyer(
  buyer: BuyerRecord,
  match: ReturnType<typeof bestMatch>,
  translation: Readonly<{
    readonly industries: readonly string[];
    readonly interests: string;
    readonly preferredLocations: readonly string[];
  }> | undefined,
): SellerBuyer {
  if (buyer.buyerProfile === null) {
    throw new Error("A buyer profile is required for the directory.");
  }

  return {
    budgetMax: buyer.buyerProfile.budgetMax?.toString() ?? null,
    budgetMin: buyer.buyerProfile.budgetMin?.toString() ?? null,
    companyName: buyer.buyerProfile.companyName,
    currency: buyer.buyerProfile.currency,
    id: buyer.id,
    industries: translation?.industries ?? buyer.buyerProfile.industries,
    interests: translation?.interests ?? buyer.buyerProfile.interests,
    matchReasons: match?.reasons ?? [],
    matchScore: match?.score ?? null,
    name: buyer.name,
    preferredLocations: translation?.preferredLocations ?? buyer.buyerProfile.preferredLocations,
  };
}

export async function getSellerBuyers(
  search: SellerBuyerSearch,
  locale: Locale = defaultLocale,
): Promise<readonly SellerBuyer[]> {
  const seller = await getDemoSeller();
  const [buyers, assets] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: buyerSelection, where: buildBuyerWhere(search, locale) }),
    prisma.asset.findMany({
      orderBy: { updatedAt: "desc" },
      select: matchingAssetSelection,
      where: { sellerId: seller.id, status: AssetStatus.PUBLISHED },
    }),
  ]);

  const translations = await getBuyerProfileTranslationMap(
    buyers.flatMap((buyer) => buyer.buyerProfile === null ? [] : [buyer.buyerProfile.id]),
    locale,
  );

  return buyers
    .filter((buyer) => matchesQuery(
      buyer,
      search.query,
      buyer.buyerProfile === null ? undefined : translations.get(buyer.buyerProfile.id),
    ))
    .map((buyer) => ({
      buyer,
      match: bestMatch(buyer, assets),
      translation: buyer.buyerProfile === null ? undefined : translations.get(buyer.buyerProfile.id),
    }))
    .filter(({ match }) => matchesBudgetFilter(match, search.budget))
    .map(({ buyer, match, translation }) => toSellerBuyer(buyer, match, translation));
}

export async function getSellerBuyerFilterOptions(locale: Locale = defaultLocale): Promise<SellerBuyerFilterOptions> {
  await getDemoSeller();
  const profiles = await prisma.buyerProfile.findMany({
    select: { id: true, industries: true, preferredLocations: true },
    where: { user: { role: UserRole.BUYER, status: UserStatus.ACTIVE } },
  });

  const translations = await getBuyerProfileTranslationMap(profiles.map((profile) => profile.id), locale);

  return {
    industries: uniqueSorted(profiles.flatMap((profile) => translations.get(profile.id)?.industries ?? profile.industries)),
    locations: uniqueSorted(profiles.flatMap((profile) => translations.get(profile.id)?.preferredLocations ?? profile.preferredLocations)),
  };
}
