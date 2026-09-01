import Link from "next/link";

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
  const parameters = await searchParams;
  const search = parseAdminUserSearch(parameters);
  const users = await getAdminUsers(search);

  return (
    <>
      <SiteHeader />
      <main className="admin-management container">
        <Link className="back-link" href="/admin">← Platform manager</Link>
        <p className="eyebrow">Participants</p>
        <h1>Manage users</h1>
        <form className="admin-filter-form" method="get">
          <label><span>Search</span><input defaultValue={search.query} name="query" placeholder="Name or email" /></label>
          <label><span>Role</span><select defaultValue={search.role} name="role">{adminRoleFilterOptions.map((role) => <option key={role} value={role}>{role === "ALL" ? "All roles" : role}</option>)}</select></label>
          <label><span>Status</span><select defaultValue={search.status} name="status"><option value="ALL">All statuses</option>{adminUserStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <button type="submit">Apply</button>
        </form>
        {users.length === 0 ? <section className="empty-state"><h2>No users found</h2><p>Change the search or filter values to review a wider set of participants.</p></section> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>{users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong><span>{user.email}</span></td>
                  <td>{user.role}</td>
                  <td><span className={`admin-status admin-status--${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td>{user.createdAt.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</td>
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
