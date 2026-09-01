"use server";

import { getTranslations } from "next-intl/server";

import { createBuyerMessage } from "./buyer-message-service";
import { createSellerMessage } from "./seller-message-service";
import { parseBuyerMessageFormData, parseSellerMessageFormData } from "./message-validation";

import type { BuyerMessageActionState } from "./message-validation";

function readAssetId(formData: FormData): string | undefined {
  const value = formData.get("assetId");
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function validationError(message: string): BuyerMessageActionState {
  return { kind: "validation_error", message };
}

function translateResult(
  result: BuyerMessageActionState,
  translate: (key: string) => string,
): BuyerMessageActionState {
  return result.message === null ? result : { ...result, message: translate(result.message) };
}

export async function sendBuyerMessageAction(
  _previousState: BuyerMessageActionState,
  formData: FormData,
): Promise<BuyerMessageActionState> {
  const t = await getTranslations("messages");
  const assetId = readAssetId(formData);
  const parsed = parseBuyerMessageFormData(formData);

  if (assetId === undefined || !parsed.success) {
    return validationError(t("writeMessage"));
  }

  try {
    return translateResult(await createBuyerMessage(assetId, parsed.data.content), t);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: t("sendError") };
    }

    throw error;
  }
}

export async function sendSellerMessageAction(
  _previousState: BuyerMessageActionState,
  formData: FormData,
): Promise<BuyerMessageActionState> {
  const t = await getTranslations("messages");
  const parsed = parseSellerMessageFormData(formData);

  if (!parsed.success) {
    return validationError(t("writeMessage"));
  }

  try {
    return translateResult(await createSellerMessage(parsed.data.buyerId, parsed.data.content), t);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: t("sendError") };
    }

    throw error;
  }
}
