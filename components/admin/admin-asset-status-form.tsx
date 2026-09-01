"use client";

import { useActionState } from "react";

import { updateAdminAssetStatusAction } from "@/features/admin/actions";
import { adminAssetStatusOptions, initialAdminActionState } from "@/features/admin/admin-validation";

import type { AssetStatus } from "@/generated/prisma/client";

type AdminAssetStatusFormProps = Readonly<{
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

export function AdminAssetStatusForm({ assetId, status }: AdminAssetStatusFormProps) {
  const [state, action, isPending] = useActionState(updateAdminAssetStatusAction, initialAdminActionState);

  return (
    <form action={action} className="admin-status-form">
      <input name="assetId" type="hidden" value={assetId} />
      <select defaultValue={status} name="status">
        {adminAssetStatusOptions.map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}
      </select>
      <button disabled={isPending} type="submit">{isPending ? "Saving…" : "Save"}</button>
      {state.message !== null ? <span role={state.kind === "success" ? "status" : "alert"}>{state.message}</span> : null}
    </form>
  );
}
