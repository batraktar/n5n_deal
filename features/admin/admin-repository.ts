import { AssetStatus, Prisma, UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { requireActiveRole } from "@/features/auth/authorization";

import type { AdminAssetSearch, AdminUserSearch } from "./admin-validation";
import type { AdminAsset, AdminUser } from "./admin-types";

const demoAdminEmail = "admin@n5deal.demo";

export class DemoAdminUnavailableError extends Error {
  override readonly name = "DemoAdminUnavailableError";

  constructor() {
    super("The demo admin account is unavailable. Seed the database and try again.");
  }
}

export type AdminStatistics = Readonly<{
  buyers: number;
  publishedAssets: number;
  sellers: number;
  suspendedAssets: number;
  suspendedUsers: number;
  totalUsers: number;
}>;

export async function getDemoAdmin(): Promise<Readonly<{ id: string }>> {
  const admin = await prisma.user.findUnique({
    select: { id: true, role: true, status: true },
    where: { email: demoAdminEmail },
  });

  if (admin === null) {
    throw new DemoAdminUnavailableError();
  }

  requireActiveRole(admin, UserRole.ADMIN);
  return { id: admin.id };
}

export async function getAdminStatistics(): Promise<AdminStatistics> {
  await getDemoAdmin();
  const [totalUsers, buyers, sellers, publishedAssets, suspendedUsers, suspendedAssets] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: UserRole.BUYER } }),
    prisma.user.count({ where: { role: UserRole.SELLER } }),
    prisma.asset.count({ where: { status: AssetStatus.PUBLISHED } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
    prisma.asset.count({ where: { status: AssetStatus.ARCHIVED } }),
  ]);

  return { buyers, publishedAssets, sellers, suspendedAssets, suspendedUsers, totalUsers };
}

function buildUserWhere(search: AdminUserSearch): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (search.role !== "ALL") {
    where.role = search.role;
  }

  if (search.status !== "ALL") {
    where.status = search.status;
  }

  if (search.query !== undefined && search.query.length > 0) {
    where.OR = [
      { email: { contains: search.query, mode: "insensitive" } },
      { name: { contains: search.query, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildAssetWhere(search: AdminAssetSearch): Prisma.AssetWhereInput {
  const where: Prisma.AssetWhereInput = {};

  if (search.status !== "ALL") {
    where.status = search.status;
  }

  if (search.query !== undefined && search.query.length > 0) {
    where.OR = [
      { title: { contains: search.query, mode: "insensitive" } },
      { industry: { contains: search.query, mode: "insensitive" } },
      { location: { contains: search.query, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getAdminUsers(search: AdminUserSearch): Promise<readonly AdminUser[]> {
  await getDemoAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, email: true, id: true, name: true, role: true, status: true },
    where: buildUserWhere(search),
  });
}

export async function getAdminAssets(search: AdminAssetSearch): Promise<readonly AdminAsset[]> {
  await getDemoAdmin();
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      id: true,
      industry: true,
      location: true,
      seller: { select: { name: true } },
      status: true,
      title: true,
    },
    where: buildAssetWhere(search),
  });

  return assets.map((asset) => ({
    createdAt: asset.createdAt,
    id: asset.id,
    industry: asset.industry,
    location: asset.location,
    sellerName: asset.seller.name,
    status: asset.status,
    title: asset.title,
  }));
}

export async function updateAdminUserStatus(userId: string, status: UserStatus): Promise<boolean> {
  const admin = await getDemoAdmin();
  const updated = await prisma.user.updateMany({
    data: { status },
    where: { id: userId, NOT: { id: admin.id } },
  });

  return updated.count === 1;
}

export async function updateAdminAssetStatus(assetId: string, status: AssetStatus): Promise<boolean> {
  await getDemoAdmin();
  const updated = await prisma.asset.updateMany({ data: { status }, where: { id: assetId } });
  return updated.count === 1;
}
