"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { updateAdminUserStatusAction } from "@/features/admin/actions";
import { adminUserStatusOptions, initialAdminActionState } from "@/features/admin/admin-validation";

import type { UserStatus } from "@/generated/prisma/client";

type AdminUserStatusFormProps = Readonly<{
  status: UserStatus;
  userId: string;
}>;

export function AdminUserStatusForm({ status, userId }: AdminUserStatusFormProps) {
  const t = useTranslations("admin");
  const [state, action, isPending] = useActionState(updateAdminUserStatusAction, initialAdminActionState);

  return (
    <form action={action} className="admin-status-form">
      <input name="userId" type="hidden" value={userId} />
      <select defaultValue={status} name="status">
        {adminUserStatusOptions.map((option) => <option key={option} value={option}>{option === "ACTIVE" ? t("active") : t("suspended")}</option>)}
      </select>
      <button disabled={isPending} type="submit">{isPending ? t("saving") : t("save")}</button>
      {state.message !== null ? <span role={state.kind === "success" ? "status" : "alert"}>{state.message}</span> : null}
    </form>
  );
}
