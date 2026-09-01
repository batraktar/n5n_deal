import { AssetStatus, Prisma, UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { calculateAssetMatch } from "@/features/matching/matching-service";

import { getDemoSeller } from "./seller-repository";

import type { MatchAsset, MatchBuyerProfile } from "@/features/matching/matching-service";
import type { SellerBuyer, SellerBuyerFilterOptions } from "./seller-types";
import type { SellerBuyerBudgetFilter, SellerBuyerSearch } from "./buyer-search";

const buyerSelection = {
  buyerProfile: {
    select: {
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

function buildBuyerWhere(search: SellerBuyerSearch): Prisma.UserWhereInput {
  const profileWhere: Prisma.BuyerProfileWhereInput = {};

  if (search.industry !== undefined) {
    profileWhere.industries = { has: search.industry };
  }

  if (search.location !== undefined) {
    profileWhere.preferredLocations = { has: search.location };
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

function matchesQuery(buyer: BuyerRecord, query: string | undefined): boolean {
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
    profile.interests,
    ...profile.industries,
    ...profile.preferredLocations,
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

function toSellerBuyer(buyer: BuyerRecord, match: ReturnType<typeof bestMatch>): SellerBuyer {
  if (buyer.buyerProfile === null) {
    throw new Error("A buyer profile is required for the directory.");
  }

  return {
    budgetMax: buyer.buyerProfile.budgetMax?.toString() ?? null,
    budgetMin: buyer.buyerProfile.budgetMin?.toString() ?? null,
    companyName: buyer.buyerProfile.companyName,
    currency: buyer.buyerProfile.currency,
    id: buyer.id,
    industries: buyer.buyerProfile.industries,
    interests: buyer.buyerProfile.interests,
    matchReasons: match?.reasons ?? [],
    matchScore: match?.score ?? null,
    name: buyer.name,
    preferredLocations: buyer.buyerProfile.preferredLocations,
  };
}

export async function getSellerBuyers(search: SellerBuyerSearch): Promise<readonly SellerBuyer[]> {
  const seller = await getDemoSeller();
  const [buyers, assets] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: buyerSelection, where: buildBuyerWhere(search) }),
    prisma.asset.findMany({
      orderBy: { updatedAt: "desc" },
      select: matchingAssetSelection,
      where: { sellerId: seller.id, status: AssetStatus.PUBLISHED },
    }),
  ]);

  return buyers
    .filter((buyer) => matchesQuery(buyer, search.query))
    .map((buyer) => ({ buyer, match: bestMatch(buyer, assets) }))
    .filter(({ match }) => matchesBudgetFilter(match, search.budget))
    .map(({ buyer, match }) => toSellerBuyer(buyer, match));
}

export async function getSellerBuyerFilterOptions(): Promise<SellerBuyerFilterOptions> {
  await getDemoSeller();
  const profiles = await prisma.buyerProfile.findMany({
    select: { industries: true, preferredLocations: true },
    where: { user: { role: UserRole.BUYER, status: UserStatus.ACTIVE } },
  });

  return {
    industries: uniqueSorted(profiles.flatMap((profile) => profile.industries)),
    locations: uniqueSorted(profiles.flatMap((profile) => profile.preferredLocations)),
  };
}
