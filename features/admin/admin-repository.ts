import { AssetStatus, UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { requireActiveRole } from "@/features/auth/authorization";

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
