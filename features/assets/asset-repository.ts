import { AssetStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

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

function toAssetPreview(asset: Prisma.AssetGetPayload<{ select: typeof assetSelection }>): AssetPreview {
  return {
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
  };
}

function buildWhere(search: AssetSearch): Prisma.AssetWhereInput {
  const where: Prisma.AssetWhereInput = { status: AssetStatus.PUBLISHED };

  if (search.industry !== undefined) {
    where.industry = search.industry;
  }

  if (search.location !== undefined) {
    where.location = search.location;
  }

  if (search.query !== undefined) {
    where.OR = [
      { title: { contains: search.query, mode: "insensitive" } },
      { description: { contains: search.query, mode: "insensitive" } },
      { industry: { contains: search.query, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getPublishedAssetListing(search: AssetSearch): Promise<AssetListing> {
  const where = buildWhere(search);
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

  return {
    assets: assets.map(toAssetPreview),
    page: search.page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    total,
  };
}

export async function getPublishedAssetById(assetId: string): Promise<AssetPreview | null> {
  const asset = await prisma.asset.findFirst({
    select: assetSelection,
    where: {
      id: assetId,
      status: AssetStatus.PUBLISHED,
    },
  });

  return asset === null ? null : toAssetPreview(asset);
}

export async function getAssetFilterOptions(): Promise<AssetFilterOptions> {
  const [industries, locations] = await Promise.all([
    prisma.asset.findMany({
      distinct: ["industry"],
      orderBy: { industry: "asc" },
      select: { industry: true },
      where: { status: AssetStatus.PUBLISHED },
    }),
    prisma.asset.findMany({
      distinct: ["location"],
      orderBy: { location: "asc" },
      select: { location: true },
      where: { status: AssetStatus.PUBLISHED },
    }),
  ]);

  return {
    industries: industries.map((asset) => asset.industry),
    locations: locations.map((asset) => asset.location),
  };
}
