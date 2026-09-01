import { describe, expect, it } from "vitest";

import { parseBuyerProfileFormData } from "@/features/buyer/buyer-profile-validation";

describe("parseBuyerProfileFormData", () => {
  it("normalizes investment preferences for persistence", () => {
    const formData = new FormData();
    formData.set("companyName", " Northstar Growth Partners ");
    formData.set("interests", "Profitable B2B software companies with recurring revenue.");
    formData.set("industries", "Software, Fintech, Software");
    formData.set("preferredLocations", "Germany, United Kingdom");
    formData.set("budgetMin", "1000000");
    formData.set("budgetMax", "5000000");
    formData.set("currency", "usd");

    const result = parseBuyerProfileFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        budgetMax: 5_000_000,
        budgetMin: 1_000_000,
        companyName: "Northstar Growth Partners",
        currency: "USD",
        industries: ["Software", "Fintech"],
      });
    }
  });

  it("rejects a budget range with an invalid order", () => {
    const formData = new FormData();
    formData.set("interests", "Profitable B2B software companies with recurring revenue.");
    formData.set("industries", "Software");
    formData.set("preferredLocations", "Germany");
    formData.set("budgetMin", "5000000");
    formData.set("budgetMax", "1000000");
    formData.set("currency", "USD");

    const result = parseBuyerProfileFormData(formData);

    expect(result.success).toBe(false);
  });
});
