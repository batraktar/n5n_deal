"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseBuyerProfileFormData } from "./buyer-profile-validation";
import { saveBuyerProfile } from "./buyer-repository";

import type { BuyerProfileFormState } from "./buyer-types";

function validationFailureState(fieldErrors: Readonly<Record<string, readonly string[] | undefined>>): BuyerProfileFormState {
  return {
    fieldErrors: {
      budgetMax: fieldErrors["budgetMax"]?.[0],
      budgetMin: fieldErrors["budgetMin"]?.[0],
      companyName: fieldErrors["companyName"]?.[0],
      currency: fieldErrors["currency"]?.[0],
      industries: fieldErrors["industries"]?.[0],
      interests: fieldErrors["interests"]?.[0],
      preferredLocations: fieldErrors["preferredLocations"]?.[0],
    },
    kind: "validation_error",
    message: "Review the highlighted fields.",
  };
}

export async function saveBuyerProfileAction(
  _previousState: BuyerProfileFormState,
  formData: FormData,
): Promise<BuyerProfileFormState> {
  const parsed = parseBuyerProfileFormData(formData);
  if (!parsed.success) {
    return validationFailureState(parsed.error.flatten().fieldErrors);
  }

  try {
    await saveBuyerProfile(parsed.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { fieldErrors: {}, kind: "error", message: "We could not save your preferences. Please try again." };
    }

    throw error;
  }

  revalidatePath("/buyer/dashboard");
  revalidatePath("/buyer/profile");
  redirect("/buyer/profile?notice=saved");
}
