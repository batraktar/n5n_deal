import { describe, expect, it } from "vitest";

import { parseSellerMessageFormData } from "@/features/messages/message-validation";

describe("seller message validation", () => {
  it("accepts a buyer recipient and a message", () => {
    const formData = new FormData();
    formData.set("buyerId", "cmtestbuyer0000000000000000");
    formData.set("content", "I would like to discuss how your acquisition criteria fit this opportunity.");

    expect(parseSellerMessageFormData(formData).success).toBe(true);
  });

  it("rejects a message without a buyer recipient", () => {
    const formData = new FormData();
    formData.set("content", "I would like to discuss this opportunity with your team.");

    expect(parseSellerMessageFormData(formData).success).toBe(false);
  });
});
