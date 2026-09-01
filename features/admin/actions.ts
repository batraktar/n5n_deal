"use server";

import { revalidatePath } from "next/cache";

import { parseAdminAssetStatusFormData, parseAdminUserStatusFormData } from "./admin-validation";
import { updateAdminAssetStatus, updateAdminUserStatus } from "./admin-repository";

import type { AdminActionState } from "./admin-validation";

export async function updateAdminUserStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = parseAdminUserStatusFormData(formData);
  if (!parsed.success) {
    return { kind: "validation_error", message: "Choose a valid user status." };
  }

  try {
    const updated = await updateAdminUserStatus(parsed.data.userId, parsed.data.status);
    if (!updated) {
      return { kind: "error", message: "This user is unavailable or cannot be modified." };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: "We could not update this user. Please try again." };
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { kind: "success", message: "User status updated." };
}

export async function updateAdminAssetStatusAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = parseAdminAssetStatusFormData(formData);
  if (!parsed.success) {
    return { kind: "validation_error", message: "Choose a valid asset status." };
  }

  try {
    const updated = await updateAdminAssetStatus(parsed.data.assetId, parsed.data.status);
    if (!updated) {
      return { kind: "error", message: "This asset is unavailable." };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { kind: "error", message: "We could not update this asset. Please try again." };
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/assets");
  revalidatePath("/marketplace");
  return { kind: "success", message: "Asset status updated." };
}
