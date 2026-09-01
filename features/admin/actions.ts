"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { parseAdminAssetStatusFormData, parseAdminUserStatusFormData } from "./admin-validation";
import { updateAdminAssetStatus, updateAdminUserStatus } from "./admin-repository";

import type { AdminActionState } from "./admin-validation";

export async function updateAdminUserStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const errorsT = await getTranslations("errors");
  const adminT = await getTranslations("admin");
  const parsed = parseAdminUserStatusFormData(formData);
  if (!parsed.success) {
    return { kind: "validation_error", message: errorsT("validUserStatus") };
  }

  try {
    const updated = await updateAdminUserStatus(parsed.data.userId, parsed.data.status);
    if (!updated) {
      return { kind: "error", message: errorsT("userUnavailable") };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: errorsT("updateUser") };
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { kind: "success", message: adminT("userStatusUpdated") };
}

export async function updateAdminAssetStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const errorsT = await getTranslations("errors");
  const adminT = await getTranslations("admin");
  const parsed = parseAdminAssetStatusFormData(formData);
  if (!parsed.success) {
    return { kind: "validation_error", message: errorsT("validAssetStatusAdmin") };
  }

  try {
    const updated = await updateAdminAssetStatus(parsed.data.assetId, parsed.data.status);
    if (!updated) {
      return { kind: "error", message: errorsT("assetUnavailableAdmin") };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: errorsT("updateAsset") };
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/assets");
  revalidatePath("/marketplace");
  return { kind: "success", message: adminT("assetStatusUpdated") };
}
