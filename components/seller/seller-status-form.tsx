"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { changeSellerAssetStatusAction } from "@/features/seller/actions";
import { assetStatusOptions } from "@/features/seller/asset-validation";
import { initialSellerAssetFormState } from "@/features/seller/seller-types";

import type { AssetStatus } from "@/generated/prisma/client";

type SellerStatusFormProps = Readonly<{
  assetId: string;
  status: AssetStatus;
}>;

export function SellerStatusForm({ assetId, status }: SellerStatusFormProps) {
  const t = useTranslations("seller");
  const [state, action, isPending] = useActionState(changeSellerAssetStatusAction, initialSellerAssetFormState);

  return (
    <form action={action} className="seller-status-form">
      <input name="assetId" type="hidden" value={assetId} />
      <label>
        <span className="sr-only">{t("listingStatus")}</span>
        <select defaultValue={status} name="status">
          {assetStatusOptions.map((option) => (
            <option key={option} value={option}>{t(option === "DRAFT" ? "draft" : option === "PUBLISHED" ? "published" : "archived")}</option>
          ))}
        </select>
      </label>
      <button disabled={isPending} type="submit">{isPending ? t("updating") : t("saveStatus")}</button>
      {state.message !== null ? <span className="seller-status-form__error" role="alert">{state.message}</span> : null}
    </form>
  );
}
