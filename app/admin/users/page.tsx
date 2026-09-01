import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { AdminUserStatusForm } from "@/components/admin/admin-user-status-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { adminRoleFilterOptions, adminUserStatusOptions, parseAdminUserSearch } from "@/features/admin/admin-validation";
import { getAdminUsers } from "@/features/admin/admin-repository";

type AdminUsersPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const t = await getTranslations("admin");
  const filterT = await getTranslations("filters");
  const locale = await getLocale();
  const parameters = await searchParams;
  const search = parseAdminUserSearch(parameters);
  const users = await getAdminUsers(search);

  return (
    <>
      <SiteHeader />
      <main className="admin-management container">
        <Link className="back-link" href="/admin">← {t("back")}</Link>
        <p className="eyebrow">{t("participants")}</p>
        <h1>{t("usersTitle")}</h1>
        <form className="admin-filter-form" method="get">
          <label><span>{filterT("search")}</span><input defaultValue={search.query} name="query" placeholder={filterT("nameEmailPlaceholder")} /></label>
          <label><span>{filterT("role")}</span><select defaultValue={search.role} name="role"><option value="ALL">{filterT("allRoles")}</option>{adminRoleFilterOptions.filter((role) => role !== "ALL").map((role) => <option key={role} value={role}>{role === "BUYER" ? t("buyerRole") : role === "SELLER" ? t("sellerRole") : t("adminRole")}</option>)}</select></label>
          <label><span>{filterT("status")}</span><select defaultValue={search.status} name="status"><option value="ALL">{filterT("allStatuses")}</option>{adminUserStatusOptions.map((status) => <option key={status} value={status}>{status === "ACTIVE" ? t("active") : t("suspended")}</option>)}</select></label>
          <button type="submit">{filterT("applyShort")}</button>
        </form>
        {users.length === 0 ? <section className="empty-state"><h2>{t("noUsers")}</h2><p>{t("noUsersDescription")}</p></section> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>{t("user")}</th><th>{t("role")}</th><th>{t("status")}</th><th>{t("joined")}</th><th>{t("action")}</th></tr></thead>
              <tbody>{users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong><span>{user.email}</span></td>
                  <td>{user.role === "BUYER" ? t("buyerRole") : user.role === "SELLER" ? t("sellerRole") : t("adminRole")}</td>
                  <td><span className={`admin-status admin-status--${user.status.toLowerCase()}`}>{user.status === "ACTIVE" ? t("active") : t("suspended")}</span></td>
                  <td>{user.createdAt.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td><AdminUserStatusForm status={user.status} userId={user.id} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
