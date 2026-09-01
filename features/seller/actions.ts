"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { parseAssetFormData, parseAssetStatusFormData, readAssetId } from "./asset-validation";
import { createSellerAsset, updateSellerAsset, updateSellerAssetStatus } from "./seller-repository";
import type { SellerAssetFormState } from "./seller-types";

function databaseFailureState(error: unknown, translate: (key: string) => string): SellerAssetFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      fieldErrors: { title: translate("duplicateAsset") },
      kind: "validation_error",
      message: translate("chooseDifferentTitle"),
    };
  }

  return {
    fieldErrors: {},
    kind: "error",
    message: translate("saveAsset"),
  };
}

function validationFailureState(
  fieldErrors: Readonly<Record<string, readonly string[] | undefined>>,
  message: string,
): SellerAssetFormState {
  return {
    fieldErrors: {
      currency: fieldErrors["currency"]?.[0],
      description: fieldErrors["description"]?.[0],
      industry: fieldErrors["industry"]?.[0],
      location: fieldErrors["location"]?.[0],
      revenue: fieldErrors["revenue"]?.[0],
      status: fieldErrors["status"]?.[0],
      title: fieldErrors["title"]?.[0],
      valuation: fieldErrors["valuation"]?.[0],
    },
    kind: "validation_error",
    message,
  };
}

function refreshAssetPaths(assetId: string): void {
  revalidatePath("/marketplace");
  revalidatePath("/seller/dashboard");
  revalidatePath(`/assets/${assetId}`);
  revalidatePath(`/seller/assets/${assetId}/edit`);
}

export async function saveSellerAssetAction(
  _previousState: SellerAssetFormState,
  formData: FormData,
): Promise<SellerAssetFormState> {
  const errorsT = await getTranslations("errors");
  const validationT = await getTranslations("validation");
  const parsed = parseAssetFormData(formData);
  if (!parsed.success) {
    return validationFailureState(parsed.error.flatten().fieldErrors, validationT("reviewFields"));
  }

  const assetId = readAssetId(formData);
  let destination: string;

  try {
    if (assetId === undefined) {
      const asset = await createSellerAsset(parsed.data);
      refreshAssetPaths(asset.id);
      destination = "/seller/dashboard?notice=created";
    } else {
      const updated = await updateSellerAsset(assetId, parsed.data);
      if (!updated) {
        return {
          fieldErrors: {},
          kind: "error",
          message: errorsT("assetUnavailable"),
        };
      }

      refreshAssetPaths(assetId);
      destination = "/seller/dashboard?notice=updated";
    }
  } catch (error: unknown) {
    return databaseFailureState(error, errorsT);
  }

  redirect(destination);
}

export async function changeSellerAssetStatusAction(
  previousState: SellerAssetFormState,
  formData: FormData,
): Promise<SellerAssetFormState> {
  const errorsT = await getTranslations("errors");
  void previousState;
  const assetId = readAssetId(formData);
  const parsed = parseAssetStatusFormData(formData);

  if (assetId === undefined || !parsed.success) {
    return {
      fieldErrors: parsed.success ? {} : validationFailureState(parsed.error.flatten().fieldErrors, errorsT("validAssetStatus")).fieldErrors,
      kind: "validation_error",
      message: errorsT("validAssetStatus"),
    };
  }

  try {
    const updated = await updateSellerAssetStatus(assetId, parsed.data.status);
    if (!updated) {
      return {
        fieldErrors: {},
        kind: "error",
        message: errorsT("assetUnavailable"),
      };
    }

    refreshAssetPaths(assetId);
  } catch (error: unknown) {
    return databaseFailureState(error, errorsT);
  }

  redirect("/seller/dashboard?notice=status-updated");
}
