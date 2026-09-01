import type { AssetStatus, UserRole, UserStatus } from "@/generated/prisma/client";

export type AdminUser = Readonly<{
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}>;

export type AdminAsset = Readonly<{
  createdAt: Date;
  id: string;
  industry: string;
  location: string;
  sellerName: string;
  status: AssetStatus;
  title: string;
}>;
