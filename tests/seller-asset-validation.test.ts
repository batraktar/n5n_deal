import { describe, expect, it } from "vitest";

import { parseAssetFormData } from "@/features/seller/asset-validation";

describe("parseAssetFormData", () => {
  it("accepts a complete seller asset submission", () => {
    const formData = new FormData();
    formData.set("title", "Atlas Advisory");
    formData.set("description", "A profitable advisory firm with recurring retainers.");
    formData.set("industry", "Professional services");
    formData.set("valuation", "2500000");
    formData.set("currency", "usd");
    formData.set("location", "Kyiv, Ukraine");
    formData.set("revenue", "720000");
    formData.set("status", "DRAFT");

    const result = parseAssetFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        currency: "USD",
        revenue: 720000,
        status: "DRAFT",
        valuation: 2500000,
      });
    }
  });

  it("rejects an invalid asset submission", () => {
    const formData = new FormData();
    formData.set("title", "A");
    formData.set("description", "Too short");
    formData.set("industry", "");
    formData.set("valuation", "0");
    formData.set("currency", "US");
    formData.set("location", "");
    formData.set("status", "INVALID");

    const result = parseAssetFormData(formData);

    expect(result.success).toBe(false);
  });
});
