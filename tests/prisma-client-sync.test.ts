import { describe, expect, it } from "vitest";

import packageManifest from "../package.json";

describe("Prisma client lifecycle", () => {
  it("regenerates the client before dev, start, and production builds", () => {
    expect(packageManifest.scripts.predev).toBe("prisma generate");
    expect(packageManifest.scripts.prestart).toBe("prisma generate");
    expect(packageManifest.scripts.prebuild).toBe("prisma generate");
  });
});
