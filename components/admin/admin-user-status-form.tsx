"use client";

import { useActionState } from "react";

import { updateAdminUserStatusAction } from "@/features/admin/actions";
import { adminUserStatusOptions, initialAdminActionState } from "@/features/admin/admin-validation";

import type { UserStatus } from "@/generated/prisma/client";

type AdminUserStatusFormProps = Readonly<{
  status: UserStatus;
  userId: string;
}>;

function statusLabel(status: UserStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "SUSPENDED":
      return "Suspended";
  }
}

export function AdminUserStatusForm({ status, userId }: AdminUserStatusFormProps) {
  const [state, action, isPending] = useActionState(updateAdminUserStatusAction, initialAdminActionState);

  return (
    <form action={action} className="admin-status-form">
      <input name="userId" type="hidden" value={userId} />
      <select defaultValue={status} name="status">
        {adminUserStatusOptions.map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}
      </select>
      <button disabled={isPending} type="submit">{isPending ? "Saving…" : "Save"}</button>
      {state.message !== null ? <span role={state.kind === "success" ? "status" : "alert"}>{state.message}</span> : null}
    </form>
  );
}
