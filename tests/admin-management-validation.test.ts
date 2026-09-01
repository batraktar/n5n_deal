import { describe, expect, it } from "vitest";

import { parseAdminAssetStatusFormData, parseAdminUserStatusFormData } from "@/features/admin/admin-validation";

describe("admin management validation", () => {
  it("accepts an admin request to suspend a user", () => {
    const formData = new FormData();
    formData.set("userId", "cmtestuser0000000000000000");
    formData.set("status", "SUSPENDED");

    const result = parseAdminUserStatusFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("SUSPENDED");
    }
  });

  it("accepts an admin request to archive an asset", () => {
    const formData = new FormData();
    formData.set("assetId", "cmtestasset000000000000000");
    formData.set("status", "ARCHIVED");

    const result = parseAdminAssetStatusFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("ARCHIVED");
    }
  });

  it("rejects an unknown moderation status", () => {
    const formData = new FormData();
    formData.set("assetId", "cmtestasset000000000000000");
    formData.set("status", "REMOVED");

    expect(parseAdminAssetStatusFormData(formData).success).toBe(false);
  });
});
