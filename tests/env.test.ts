import { describe, expect, it } from "vitest";

import { readDatabaseEnvironment } from "@/lib/env";

describe("readDatabaseEnvironment", () => {
  it("returns a typed database URL when the environment is valid", () => {
    const environment = readDatabaseEnvironment({
      DATABASE_URL: "postgresql://n5deal:n5deal@localhost:5432/n5deal?schema=public",
    });

    expect(environment.DATABASE_URL).toBe(
      "postgresql://n5deal:n5deal@localhost:5432/n5deal?schema=public",
    );
  });

  it("rejects a missing database URL", () => {
    expect(() => readDatabaseEnvironment({})).toThrow();
  });
});
