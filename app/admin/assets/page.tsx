import Link from "next/link";

import { AdminAssetStatusForm } from "@/components/admin/admin-asset-status-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { adminAssetStatusOptions, parseAdminAssetSearch } from "@/features/admin/admin-validation";
import { getAdminAssets } from "@/features/admin/admin-repository";

type AdminAssetsPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

export const dynamic = "force-dynamic";

export default async function AdminAssetsPage({ searchParams }: AdminAssetsPageProps) {
  const parameters = await searchParams;
  const search = parseAdminAssetSearch(parameters);
  const assets = await getAdminAssets(search);

  return (
    <>
      <SiteHeader />
      <main className="admin-management container">
        <Link className="back-link" href="/admin">← Platform manager</Link>
        <p className="eyebrow">Moderation</p>
        <h1>Review assets</h1>
        <form className="admin-filter-form admin-filter-form--assets" method="get">
          <label><span>Search</span><input defaultValue={search.query} name="query" placeholder="Title, industry, or location" /></label>
          <label><span>Status</span><select defaultValue={search.status} name="status"><option value="ALL">All statuses</option>{adminAssetStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <button type="submit">Apply</button>
        </form>
        {assets.length === 0 ? <section className="empty-state"><h2>No assets found</h2><p>Change the search or moderation status to review more opportunities.</p></section> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Asset</th><th>Seller</th><th>Status</th><th>Listed</th><th>Moderation</th></tr></thead>
              <tbody>{assets.map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.title}</strong><span>{asset.industry} · {asset.location}</span></td>
                  <td>{asset.sellerName}</td>
                  <td><span className={`admin-status admin-status--${asset.status.toLowerCase()}`}>{asset.status}</span></td>
                  <td>{asset.createdAt.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td><AdminAssetStatusForm assetId={asset.id} status={asset.status} /></td>
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
