import { AssetStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { defaultLocale, type Locale } from "@/i18n/config";
import { getAssetTranslationMap } from "@/features/i18n/content-repository";
import { mergeAssetTranslation } from "@/features/i18n/content-utils";

import type { AssetFilterOptions, AssetListing, AssetPreview } from "./asset-types";
import type { AssetSearch } from "./asset-search";

const pageSize = 6;

const assetSelection = {
  id: true,
  title: true,
  description: true,
  industry: true,
  valuation: true,
  currency: true,
  location: true,
  revenue: true,
  seller: {
    select: {
      email: true,
      name: true,
    },
  },
} satisfies Prisma.AssetSelect;

function toAssetPreview(
  asset: Prisma.AssetGetPayload<{ select: typeof assetSelection }>,
  translation: Readonly<{
    description: string;
    industry: string;
    location: string;
    title: string;
  }> | undefined,
): AssetPreview {
  const content = mergeAssetTranslation(
    {
      description: asset.description,
      industry: asset.industry,
      location: asset.location,
      title: asset.title,
    },
    translation ?? null,
  );

  return {
    id: asset.id,
    title: content.title,
    description: content.description,
    industry: content.industry,
    valuation: asset.valuation.toString(),
    currency: asset.currency,
    location: content.location,
    revenue: asset.revenue?.toString() ?? null,
    sellerName: asset.seller.name,
    sellerEmail: asset.seller.email,
  };
}

function buildWhere(search: AssetSearch, locale: Locale): Prisma.AssetWhereInput {
  const locales = locale === defaultLocale ? [defaultLocale] : [locale, defaultLocale];
  const filters: Prisma.AssetWhereInput[] = [{ status: AssetStatus.PUBLISHED }];

  if (search.industry !== undefined) {
    filters.push({
      OR: [
        { industry: search.industry },
        { translations: { some: { industry: search.industry, locale: { in: locales } } } },
      ],
    });
  }

  if (search.location !== undefined) {
    filters.push({
      OR: [
        { location: search.location },
        { translations: { some: { locale: { in: locales }, location: search.location } } },
      ],
    });
  }

  if (search.query !== undefined) {
    filters.push({
      OR: [
        { title: { contains: search.query, mode: "insensitive" } },
        { description: { contains: search.query, mode: "insensitive" } },
        { industry: { contains: search.query, mode: "insensitive" } },
        { location: { contains: search.query, mode: "insensitive" } },
        {
          translations: {
            some: {
              locale: { in: locales },
              OR: [
                { title: { contains: search.query, mode: "insensitive" } },
                { description: { contains: search.query, mode: "insensitive" } },
                { industry: { contains: search.query, mode: "insensitive" } },
                { location: { contains: search.query, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    });
  }

  return { AND: filters };
}

export async function getPublishedAssetListing(
  search: AssetSearch,
  locale: Locale = defaultLocale,
): Promise<AssetListing> {
  const where = buildWhere(search, locale);
  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
      select: assetSelection,
      skip: (search.page - 1) * pageSize,
      take: pageSize,
      where,
    }),
    prisma.asset.count({ where }),
  ]);
  const translations = await getAssetTranslationMap(assets.map((asset) => asset.id), locale);

  return {
    assets: assets.map((asset) => toAssetPreview(asset, translations.get(asset.id))),
    page: search.page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    total,
  };
}

export async function getPublishedAssetById(
  assetId: string,
  locale: Locale = defaultLocale,
): Promise<AssetPreview | null> {
  const asset = await prisma.asset.findFirst({
    select: assetSelection,
    where: {
      id: assetId,
      status: AssetStatus.PUBLISHED,
    },
  });

  if (asset === null) {
    return null;
  }

  const translations = await getAssetTranslationMap([asset.id], locale);
  return toAssetPreview(asset, translations.get(asset.id));
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export async function getAssetFilterOptions(locale: Locale = defaultLocale): Promise<AssetFilterOptions> {
  const assets = await prisma.asset.findMany({
    select: { id: true, industry: true, location: true },
    where: { status: AssetStatus.PUBLISHED },
  });
  const translations = await getAssetTranslationMap(assets.map((asset) => asset.id), locale);

  return {
    industries: uniqueSorted(assets.map((asset) => translations.get(asset.id)?.industry ?? asset.industry)),
    locations: uniqueSorted(assets.map((asset) => translations.get(asset.id)?.location ?? asset.location)),
  };
}
