import { describe, expect, it } from "vitest";

import { calculateAssetMatch } from "@/features/matching/matching-service";

const buyer = {
  budgetMax: 3_000_000,
  budgetMin: 1_000_000,
  industries: ["Software", "Fintech"],
  interests: "Profitable B2B workflow software with recurring revenue.",
  preferredLocations: ["London, United Kingdom", "Berlin, Germany"],
} as const;

describe("calculateAssetMatch", () => {
  it("awards the full score when every buyer preference matches", () => {
    const result = calculateAssetMatch(buyer, {
      description: "A profitable B2B workflow software business with recurring revenue.",
      industry: "Software",
      location: "London, United Kingdom",
      title: "Ledgerline",
      valuation: 2_000_000,
    });

    expect(result).toEqual({
      reasons: ["Same industry", "Budget compatible", "Preferred location", "Matches acquisition interests"],
      score: 100,
    });
  });

  it("returns only the signals supported by the asset", () => {
    const result = calculateAssetMatch(buyer, {
      description: "A regional food distribution business.",
      industry: "Consumer",
      location: "Amsterdam, Netherlands",
      title: "Harbor & Field",
      valuation: 5_000_000,
    });

    expect(result).toEqual({ reasons: [], score: 0 });
  });

  it("matches case-insensitively and supports incomplete budget preferences", () => {
    const result = calculateAssetMatch(
      { ...buyer, budgetMax: null, industries: ["software"] },
      {
        description: "A workflow platform for finance teams.",
        industry: "Software",
        location: "Amsterdam, Netherlands",
        title: "OpsFlow",
        valuation: 1_500_000,
      },
    );

    expect(result).toEqual({ reasons: ["Same industry", "Budget compatible", "Matches acquisition interests"], score: 80 });
  });
});
