"use server";

import { createBuyerMessage } from "./buyer-message-service";
import { parseBuyerMessageFormData } from "./message-validation";

import type { BuyerMessageActionState } from "./message-validation";

function readAssetId(formData: FormData): string | undefined {
  const value = formData.get("assetId");
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function sendBuyerMessageAction(
  _previousState: BuyerMessageActionState,
  formData: FormData,
): Promise<BuyerMessageActionState> {
  const assetId = readAssetId(formData);
  const parsed = parseBuyerMessageFormData(formData);

  if (assetId === undefined || !parsed.success) {
    return { kind: "validation_error", message: "Write a message before sending it." };
  }

  try {
    return await createBuyerMessage(assetId, parsed.data.content);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: "We could not send your message. Please try again." };
    }

    throw error;
  }
}
