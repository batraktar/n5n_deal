import { Prisma, UserRole } from "@/generated/prisma/client";
import type { AssetStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { requireActiveRole } from "@/features/auth/authorization";

import type { AssetFormValues } from "./asset-validation";
import type { SellerAsset } from "./seller-types";

const demoSellerEmail = "seller@n5deal.demo";

type SellerAssetWriteData = Readonly<{
  currency: string;
  description: string;
  industry: string;
  location: string;
  revenue: number | null;
  status: AssetStatus;
  title: string;
  valuation: number;
}>;

const sellerAssetSelection = {
  id: true,
  title: true,
  description: true,
  industry: true,
  valuation: true,
  currency: true,
  location: true,
  revenue: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.AssetSelect;

export class DemoSellerUnavailableError extends Error {
  override readonly name = "DemoSellerUnavailableError";

  constructor() {
    super("The demo seller account is unavailable. Seed the database and try again.");
  }
}

function toSellerAsset(asset: Prisma.AssetGetPayload<{ select: typeof sellerAssetSelection }>): SellerAsset {
  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    industry: asset.industry,
    valuation: asset.valuation.toString(),
    currency: asset.currency,
    location: asset.location,
    revenue: asset.revenue?.toString() ?? null,
    status: asset.status,
    updatedAt: asset.updatedAt,
  };
}

function toAssetData(input: AssetFormValues): SellerAssetWriteData {
  return {
    currency: input.currency,
    description: input.description,
    industry: input.industry,
    location: input.location,
    revenue: input.revenue ?? null,
    status: input.status,
    title: input.title,
    valuation: input.valuation,
  };
}

export async function getDemoSeller(): Promise<Readonly<{ id: string }>> {
  const seller = await prisma.user.findFirst({
    select: { id: true, role: true, status: true },
    where: {
      email: demoSellerEmail,
    },
  });

  if (seller === null) {
    throw new DemoSellerUnavailableError();
  }

  requireActiveRole(seller, UserRole.SELLER);
  return { id: seller.id };
}

export async function getSellerAssets(): Promise<readonly SellerAsset[]> {
  const seller = await getDemoSeller();
  const assets = await prisma.asset.findMany({
    orderBy: { updatedAt: "desc" },
    select: sellerAssetSelection,
    where: { sellerId: seller.id },
  });

  return assets.map(toSellerAsset);
}

export async function getSellerAssetById(assetId: string): Promise<SellerAsset | null> {
  const seller = await getDemoSeller();
  const asset = await prisma.asset.findFirst({
    select: sellerAssetSelection,
    where: { id: assetId, sellerId: seller.id },
  });

  return asset === null ? null : toSellerAsset(asset);
}

export async function createSellerAsset(input: AssetFormValues): Promise<Readonly<{ id: string }>> {
  const seller = await getDemoSeller();
  return prisma.asset.create({
    data: { ...toAssetData(input), sellerId: seller.id },
    select: { id: true },
  });
}

export async function updateSellerAsset(assetId: string, input: AssetFormValues): Promise<boolean> {
  const seller = await getDemoSeller();
  const updated = await prisma.asset.updateMany({
    data: toAssetData(input),
    where: { id: assetId, sellerId: seller.id },
  });

  return updated.count === 1;
}

export async function updateSellerAssetStatus(assetId: string, status: AssetFormValues["status"]): Promise<boolean> {
  const seller = await getDemoSeller();
  const updated = await prisma.asset.updateMany({
    data: { status },
    where: { id: assetId, sellerId: seller.id },
  });

  return updated.count === 1;
}
