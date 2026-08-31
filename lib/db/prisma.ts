import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { readDatabaseEnvironment } from "@/lib/env";

declare global {
  var n5dealPrisma: PrismaClient | undefined;
}

const databaseEnvironment = readDatabaseEnvironment(process.env);
const adapter = new PrismaPg({ connectionString: databaseEnvironment.DATABASE_URL });

export const prisma = globalThis.n5dealPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.n5dealPrisma = prisma;
}
