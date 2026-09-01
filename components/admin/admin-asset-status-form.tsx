"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { updateAdminAssetStatusAction } from "@/features/admin/actions";
import { adminAssetStatusOptions, initialAdminActionState } from "@/features/admin/admin-validation";

import type { AssetStatus } from "@/generated/prisma/client";

type AdminAssetStatusFormProps = Readonly<{
  assetId: string;
  status: AssetStatus;
}>;

export function AdminAssetStatusForm({ assetId, status }: AdminAssetStatusFormProps) {
  const t = useTranslations("admin");
  const [state, action, isPending] = useActionState(updateAdminAssetStatusAction, initialAdminActionState);

  return (
    <form action={action} className="admin-status-form">
      <input name="assetId" type="hidden" value={assetId} />
      <select defaultValue={status} name="status">
        {adminAssetStatusOptions.map((option) => <option key={option} value={option}>{option === "DRAFT" ? t("draft") : option === "PUBLISHED" ? t("published") : t("archived")}</option>)}
      </select>
      <button disabled={isPending} type="submit">{isPending ? t("saving") : t("save")}</button>
      {state.message !== null ? <span role={state.kind === "success" ? "status" : "alert"}>{state.message}</span> : null}
    </form>
  );
}
