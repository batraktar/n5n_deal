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

  const buyerProfile = await prisma.buyerProfile.upsert({
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

  const secondAsset = await prisma.asset.upsert({
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

  const assetTranslations = [
    {
      assetId: asset.id,
      locale: "en",
      title: asset.title,
      description: "A profitable workflow platform used by mid-market finance teams across Europe.",
      industry: "Software",
      location: "London, United Kingdom",
    },
    {
      assetId: asset.id,
      locale: "uk",
      title: "Ledgerline — workflow-платформа для фінансових команд",
      description: "Прибуткова workflow-платформа, якою користуються фінансові команди середнього бізнесу по всій Європі.",
      industry: "Програмне забезпечення",
      location: "Лондон, Велика Британія",
    },
    {
      assetId: asset.id,
      locale: "pl",
      title: "Ledgerline — oprogramowanie workflow dla zespołów finansowych",
      description: "Dochodowa platforma workflow używana przez średniej wielkości zespoły finansowe w całej Europie.",
      industry: "Oprogramowanie",
      location: "Londyn, Wielka Brytania",
    },
    {
      assetId: asset.id,
      locale: "de",
      title: "Ledgerline — Workflow-Software für Finanzteams",
      description: "Profitables Workflow-Produkt, das von mittelständischen Finanzteams in ganz Europa genutzt wird.",
      industry: "Software",
      location: "London, Vereinigtes Königreich",
    },
    {
      assetId: asset.id,
      locale: "fr",
      title: "Ledgerline — logiciel de workflow pour les équipes financières",
      description: "Plateforme de workflow rentable utilisée par des équipes financières de taille intermédiaire dans toute l'Europe.",
      industry: "Logiciels",
      location: "Londres, Royaume-Uni",
    },
    {
      assetId: asset.id,
      locale: "es",
      title: "Ledgerline — software de workflow para equipos financieros",
      description: "Plataforma de workflow rentable utilizada por equipos financieros medianos de toda Europa.",
      industry: "Software",
      location: "Londres, Reino Unido",
    },
    {
      assetId: secondAsset.id,
      locale: "en",
      title: secondAsset.title,
      description: "Established specialty food distributor with loyal regional retail accounts.",
      industry: "Consumer",
      location: "Amsterdam, Netherlands",
    },
    {
      assetId: secondAsset.id,
      locale: "uk",
      title: "Harbor & Field — мережа дистрибуції спеціалізованих продуктів",
      description: "Постачальник спеціалізованих продуктів харчування зі стабільними регіональними роздрібними клієнтами.",
      industry: "Споживчі товари",
      location: "Амстердам, Нідерланди",
    },
    {
      assetId: secondAsset.id,
      locale: "pl",
      title: "Harbor & Field — sieć dystrybucji żywności specjalistycznej",
      description: "Ugruntowany dystrybutor żywności specjalistycznej z lojalnymi regionalnymi klientami detalicznymi.",
      industry: "Dobra konsumpcyjne",
      location: "Amsterdam, Niderlandy",
    },
    {
      assetId: secondAsset.id,
      locale: "de",
      title: "Harbor & Field — Vertriebsnetz für Speziallebensmittel",
      description: "Etablierter Speziallebensmittelvertrieb mit treuen regionalen Handelskunden.",
      industry: "Konsumgüter",
      location: "Amsterdam, Niederlande",
    },
    {
      assetId: secondAsset.id,
      locale: "fr",
      title: "Harbor & Field — réseau de distribution alimentaire spécialisée",
      description: "Distributeur établi de produits alimentaires spécialisés avec une clientèle régionale fidèle.",
      industry: "Biens de consommation",
      location: "Amsterdam, Pays-Bas",
    },
    {
      assetId: secondAsset.id,
      locale: "es",
      title: "Harbor & Field — red de distribución de alimentos especializados",
      description: "Distribuidor consolidado de alimentos especializados con clientes minoristas regionales fieles.",
      industry: "Bienes de consumo",
      location: "Ámsterdam, Países Bajos",
    },
  ] as const;

  for (const translation of assetTranslations) {
    await prisma.assetTranslation.upsert({
      where: { assetId_locale: { assetId: translation.assetId, locale: translation.locale } },
      update: {
        description: translation.description,
        industry: translation.industry,
        location: translation.location,
        title: translation.title,
      },
      create: translation,
    });
  }

  const buyerProfileTranslations = [
    {
      buyerProfileId: buyerProfile.id,
      locale: "en",
      interests: "Profitable B2B software companies with recurring revenue.",
      industries: ["Software", "Fintech"],
      preferredLocations: ["United Kingdom", "Germany", "Netherlands"],
    },
    {
      buyerProfileId: buyerProfile.id,
      locale: "uk",
      interests: "Прибуткові B2B-компанії у сфері програмного забезпечення зі стабільним повторюваним доходом.",
      industries: ["Програмне забезпечення", "Фінтех"],
      preferredLocations: ["Велика Британія", "Німеччина", "Нідерланди"],
    },
    {
      buyerProfileId: buyerProfile.id,
      locale: "pl",
      interests: "Dochodowe firmy B2B z branży oprogramowania i powtarzalnymi przychodami.",
      industries: ["Oprogramowanie", "Fintech"],
      preferredLocations: ["Wielka Brytania", "Niemcy", "Niderlandy"],
    },
    {
      buyerProfileId: buyerProfile.id,
      locale: "de",
      interests: "Profitables B2B-Softwaregeschäft mit wiederkehrenden Umsätzen.",
      industries: ["Software", "Fintech"],
      preferredLocations: ["Vereinigtes Königreich", "Deutschland", "Niederlande"],
    },
    {
      buyerProfileId: buyerProfile.id,
      locale: "fr",
      interests: "Entreprises B2B de logiciels rentables avec des revenus récurrents.",
      industries: ["Logiciels", "Fintech"],
      preferredLocations: ["Royaume-Uni", "Allemagne", "Pays-Bas"],
    },
    {
      buyerProfileId: buyerProfile.id,
      locale: "es",
      interests: "Empresas B2B de software rentables con ingresos recurrentes.",
      industries: ["Software", "Fintech"],
      preferredLocations: ["Reino Unido", "Alemania", "Países Bajos"],
    },
  ] as const;

  for (const translation of buyerProfileTranslations) {
    await prisma.buyerProfileTranslation.upsert({
      where: { buyerProfileId_locale: { buyerProfileId: translation.buyerProfileId, locale: translation.locale } },
      update: {
        industries: [...translation.industries],
        interests: translation.interests,
        preferredLocations: [...translation.preferredLocations],
      },
      create: {
        buyerProfileId: translation.buyerProfileId,
        industries: [...translation.industries],
        interests: translation.interests,
        locale: translation.locale,
        preferredLocations: [...translation.preferredLocations],
      },
    });
  }

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
