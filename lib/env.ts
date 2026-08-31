import { z } from "zod";

export const databaseEnvironmentSchema = z.object({
  DATABASE_URL: z.url(),
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvironmentSchema>;

export function readDatabaseEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): DatabaseEnvironment {
  return databaseEnvironmentSchema.parse(environment);
}
