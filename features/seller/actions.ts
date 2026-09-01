"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseAssetFormData, parseAssetStatusFormData, readAssetId } from "./asset-validation";
import { createSellerAsset, updateSellerAsset, updateSellerAssetStatus } from "./seller-repository";
import type { SellerAssetFormState } from "./seller-types";

function databaseFailureState(error: unknown): SellerAssetFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      fieldErrors: { title: "You already have an asset with this title." },
      kind: "validation_error",
      message: "Choose a different title.",
    };
  }

  return {
    fieldErrors: {},
    kind: "error",
    message: "We could not save this asset. Please try again.",
  };
}

function validationFailureState(fieldErrors: Readonly<Record<string, readonly string[] | undefined>>): SellerAssetFormState {
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
    message: "Review the highlighted fields.",
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
  const parsed = parseAssetFormData(formData);
  if (!parsed.success) {
    return validationFailureState(parsed.error.flatten().fieldErrors);
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
          message: "This asset is unavailable or does not belong to the current seller.",
        };
      }

      refreshAssetPaths(assetId);
      destination = "/seller/dashboard?notice=updated";
    }
  } catch (error: unknown) {
    return databaseFailureState(error);
  }

  redirect(destination);
}

export async function changeSellerAssetStatusAction(
  previousState: SellerAssetFormState,
  formData: FormData,
): Promise<SellerAssetFormState> {
  void previousState;
  const assetId = readAssetId(formData);
  const parsed = parseAssetStatusFormData(formData);

  if (assetId === undefined || !parsed.success) {
    return {
      fieldErrors: parsed.success ? {} : validationFailureState(parsed.error.flatten().fieldErrors).fieldErrors,
      kind: "validation_error",
      message: "Choose a valid asset status.",
    };
  }

  try {
    const updated = await updateSellerAssetStatus(assetId, parsed.data.status);
    if (!updated) {
      return {
        fieldErrors: {},
        kind: "error",
        message: "This asset is unavailable or does not belong to the current seller.",
      };
    }

    refreshAssetPaths(assetId);
  } catch (error: unknown) {
    return databaseFailureState(error);
  }

  redirect("/seller/dashboard?notice=status-updated");
}
