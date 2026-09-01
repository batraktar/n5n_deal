"use client";

import { useActionState } from "react";

import { changeSellerAssetStatusAction } from "@/features/seller/actions";
import { assetStatusOptions } from "@/features/seller/asset-validation";
import { initialSellerAssetFormState } from "@/features/seller/seller-types";

import type { AssetStatus } from "@/generated/prisma/client";

type SellerStatusFormProps = Readonly<{
  assetId: string;
  status: AssetStatus;
}>;

function statusLabel(status: AssetStatus): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PUBLISHED":
      return "Published";
    case "ARCHIVED":
      return "Archived";
  }
}

export function SellerStatusForm({ assetId, status }: SellerStatusFormProps) {
  const [state, action, isPending] = useActionState(changeSellerAssetStatusAction, initialSellerAssetFormState);

  return (
    <form action={action} className="seller-status-form">
      <input name="assetId" type="hidden" value={assetId} />
      <label>
        <span className="sr-only">Listing status</span>
        <select defaultValue={status} name="status">
          {assetStatusOptions.map((option) => (
            <option key={option} value={option}>{statusLabel(option)}</option>
          ))}
        </select>
      </label>
      <button disabled={isPending} type="submit">{isPending ? "Updating…" : "Update"}</button>
      {state.message !== null ? <span className="seller-status-form__error" role="alert">{state.message}</span> : null}
    </form>
  );
}
