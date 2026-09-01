import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

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
  const t = await getTranslations("admin");
  const filterT = await getTranslations("filters");
  const locale = await getLocale();
  const parameters = await searchParams;
  const search = parseAdminAssetSearch(parameters);
  const assets = await getAdminAssets(search);

  return (
    <>
      <SiteHeader />
      <main className="admin-management container">
        <Link className="back-link" href="/admin">← {t("back")}</Link>
        <p className="eyebrow">{t("assetsEyebrow")}</p>
        <h1>{t("assetsTitle")}</h1>
        <form className="admin-filter-form admin-filter-form--assets" method="get">
          <label><span>{filterT("search")}</span><input defaultValue={search.query} name="query" placeholder={filterT("assetPlaceholder")} /></label>
          <label><span>{filterT("status")}</span><select defaultValue={search.status} name="status"><option value="ALL">{filterT("allStatuses")}</option>{adminAssetStatusOptions.map((status) => <option key={status} value={status}>{status === "DRAFT" ? t("draft") : status === "PUBLISHED" ? t("published") : t("archived")}</option>)}</select></label>
          <button type="submit">{filterT("applyShort")}</button>
        </form>
        {assets.length === 0 ? <section className="empty-state"><h2>{t("noAssets")}</h2><p>{t("noAssetsDescription")}</p></section> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>{t("asset")}</th><th>{t("seller")}</th><th>{t("status")}</th><th>{t("listed")}</th><th>{t("moderation")}</th></tr></thead>
              <tbody>{assets.map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.title}</strong><span>{asset.industry} · {asset.location}</span></td>
                  <td>{asset.sellerName}</td>
                  <td><span className={`admin-status admin-status--${asset.status.toLowerCase()}`}>{asset.status === "DRAFT" ? t("draft") : asset.status === "PUBLISHED" ? t("published") : t("archived")}</span></td>
                  <td>{asset.createdAt.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</td>
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
