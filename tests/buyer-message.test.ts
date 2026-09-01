import { describe, expect, it } from "vitest";

import { canBuyerContactSeller, parseBuyerMessageFormData } from "@/features/messages/message-validation";

describe("buyer messages", () => {
  it("accepts a valid message for persistence", () => {
    const formData = new FormData();
    formData.set("content", "Hello, I would like to learn more about customer retention and recurring revenue.");

    const result = parseBuyerMessageFormData(formData);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid message", () => {
    const formData = new FormData();
    formData.set("content", "Hi");

    const result = parseBuyerMessageFormData(formData);

    expect(result.success).toBe(false);
  });

  it("prevents a buyer from contacting their own listing", () => {
    expect(canBuyerContactSeller("buyer-1", "buyer-1")).toBe(false);
    expect(canBuyerContactSeller("buyer-1", "seller-1")).toBe(true);
  });
});
