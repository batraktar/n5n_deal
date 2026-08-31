import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  AssetStatus,
  Prisma,
  PrismaClient,
  UserRole,
} from "../generated/prisma/client";

class MissingDatabaseUrlError extends Error {
  override readonly name = "MissingDatabaseUrlError";

  constructor() {
    super("DATABASE_URL is required to seed the database.");
  }
}

const databaseUrl = process.env["DATABASE_URL"];

if (databaseUrl === undefined) {
  throw new MissingDatabaseUrlError();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function seed(): Promise<void> {
  await prisma.user.upsert({
    where: { email: "admin@n5deal.demo" },
    update: { name: "Avery Morgan", role: UserRole.ADMIN },
    create: {
      name: "Avery Morgan",
      email: "admin@n5deal.demo",
      role: UserRole.ADMIN,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@n5deal.demo" },
    update: { name: "Northstar Growth Partners", role: UserRole.BUYER },
    create: {
      name: "Northstar Growth Partners",
      email: "buyer@n5deal.demo",
      role: UserRole.BUYER,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@n5deal.demo" },
    update: { name: "Mira Chen", role: UserRole.SELLER },
    create: {
      name: "Mira Chen",
      email: "seller@n5deal.demo",
      role: UserRole.SELLER,
    },
  });

  await prisma.buyerProfile.upsert({
    where: { userId: buyer.id },
    update: {
      companyName: "Northstar Growth Partners",
      interests: "Profitable B2B software companies with recurring revenue.",
      industries: ["Software", "Fintech"],
      preferredLocations: ["United Kingdom", "Germany", "Netherlands"],
      budgetMin: new Prisma.Decimal("1000000"),
      budgetMax: new Prisma.Decimal("5000000"),
    },
    create: {
      userId: buyer.id,
      companyName: "Northstar Growth Partners",
      interests: "Profitable B2B software companies with recurring revenue.",
      industries: ["Software", "Fintech"],
      preferredLocations: ["United Kingdom", "Germany", "Netherlands"],
      budgetMin: new Prisma.Decimal("1000000"),
      budgetMax: new Prisma.Decimal("5000000"),
    },
  });

  const asset = await prisma.asset.upsert({
    where: {
      sellerId_title: {
        sellerId: seller.id,
        title: "Ledgerline — workflow software for finance teams",
      },
    },
    update: {
      description: "A profitable workflow platform used by mid-market finance teams across Europe.",
      industry: "Software",
      valuation: new Prisma.Decimal("3200000"),
      location: "London, United Kingdom",
      revenue: new Prisma.Decimal("850000"),
      status: AssetStatus.PUBLISHED,
    },
    create: {
      sellerId: seller.id,
      title: "Ledgerline — workflow software for finance teams",
      description: "A profitable workflow platform used by mid-market finance teams across Europe.",
      industry: "Software",
      valuation: new Prisma.Decimal("3200000"),
      location: "London, United Kingdom",
      revenue: new Prisma.Decimal("850000"),
      status: AssetStatus.PUBLISHED,
    },
  });

  await prisma.asset.upsert({
    where: {
      sellerId_title: {
        sellerId: seller.id,
        title: "Harbor & Field — specialty food distribution network",
      },
    },
    update: {
      description: "Established specialty food distributor with loyal regional retail accounts.",
      industry: "Consumer",
      valuation: new Prisma.Decimal("1800000"),
      location: "Amsterdam, Netherlands",
      revenue: new Prisma.Decimal("2400000"),
      status: AssetStatus.PUBLISHED,
    },
    create: {
      sellerId: seller.id,
      title: "Harbor & Field — specialty food distribution network",
      description: "Established specialty food distributor with loyal regional retail accounts.",
      industry: "Consumer",
      valuation: new Prisma.Decimal("1800000"),
      location: "Amsterdam, Netherlands",
      revenue: new Prisma.Decimal("2400000"),
      status: AssetStatus.PUBLISHED,
    },
  });

  await prisma.message.upsert({
    where: { seedKey: "buyer-introduction" },
    update: { content: "We would like to learn more about Ledgerline's customer retention profile." },
    create: {
      seedKey: "buyer-introduction",
      senderId: buyer.id,
      receiverId: seller.id,
      assetId: asset.id,
      content: "We would like to learn more about Ledgerline's customer retention profile.",
    },
  });

}

seed()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Database seed failed with an unknown error.");
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
