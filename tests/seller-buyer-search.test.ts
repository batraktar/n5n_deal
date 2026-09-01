import { describe, expect, it } from "vitest";

import { parseSellerBuyerSearchParameters } from "@/features/seller/buyer-search";

describe("parseSellerBuyerSearchParameters", () => {
  it("keeps valid buyer directory filters", () => {
    const search = parseSellerBuyerSearchParameters({
      budget: "COMPATIBLE",
      industry: "Software",
      location: "United Kingdom",
      query: "recurring revenue",
    });

    expect(search).toEqual({
      budget: "COMPATIBLE",
      industry: "Software",
      location: "United Kingdom",
      query: "recurring revenue",
    });
  });

  it("drops malformed values and defaults budget compatibility", () => {
    const search = parseSellerBuyerSearchParameters({
      budget: "unknown",
      industry: ["Software", "Consumer"],
      query: " ",
    });

    expect(search).toEqual({ budget: "ALL", industry: "Software" });
  });
});
