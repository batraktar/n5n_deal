import { describe, expect, it } from "vitest";

import packageManifest from "../package.json";

describe("Prisma client lifecycle", () => {
  it("uses the checked-in Prisma config to generate the client in every lifecycle", () => {
    const generateClient = "prisma generate --config ./prisma.config.ts";

    expect(packageManifest.scripts.postinstall).toBe(generateClient);
    expect(packageManifest.scripts.predev).toBe(generateClient);
    expect(packageManifest.scripts.prestart).toBe(generateClient);
    expect(packageManifest.scripts.prebuild).toBe(generateClient);
    expect(packageManifest.scripts["db:generate"]).toBe(generateClient);
  });

  it("provides a non-interactive production migration command", () => {
    expect(packageManifest.scripts["db:deploy"]).toBe("prisma migrate deploy --config ./prisma.config.ts");
  });
});
