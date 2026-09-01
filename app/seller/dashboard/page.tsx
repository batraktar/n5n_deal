import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { SellerAssetCard } from "@/components/seller/seller-asset-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSellerAssets } from "@/features/seller/seller-repository";
import { resolveLocale } from "@/i18n/config";

type SellerDashboardPageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

function getNotice(
  value: string | readonly string[] | undefined,
  translate: (key: "noticeCreated" | "noticeUpdated" | "noticeStatusUpdated") => string,
): string | null {
  switch (value) {
    case "created":
      return translate("noticeCreated");
    case "updated":
      return translate("noticeUpdated");
    case "status-updated":
      return translate("noticeStatusUpdated");
    default:
      return null;
  }
}

export default async function SellerDashboardPage({ searchParams }: SellerDashboardPageProps) {
  const t = await getTranslations("seller");
  const locale = resolveLocale(await getLocale());
  const [assets, parameters] = await Promise.all([getSellerAssets(locale), searchParams]);
  const notice = getNotice(parameters["notice"], t);

  return (
    <>
      <SiteHeader />
      <main className="seller-dashboard container">
        <div className="seller-dashboard__heading">
          <div>
            <p className="eyebrow">{t("workspaceEyebrow")}</p>
            <h1>{t("dashboardTitle")}</h1>
            <p>{t("dashboardDescription")}</p>
          </div>
          <Link className="link-button link-button--primary" href="/seller/assets/new">{t("createAsset")}</Link>
        </div>
        {notice !== null ? <p className="seller-notice" role="status">{notice}</p> : null}
        {assets.length === 0 ? (
          <section className="empty-state">
            <h2>{t("emptyTitle")}</h2>
            <p>{t("emptyDescription")}</p>
            <Link href="/seller/assets/new">{t("createAsset")}</Link>
          </section>
        ) : <div className="seller-asset-list">{assets.map((asset) => <SellerAssetCard asset={asset} key={asset.id} />)}</div>}
      </main>
      <SiteFooter />
    </>
  );
}
