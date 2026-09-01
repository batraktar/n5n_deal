import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AssetForm } from "@/components/seller/asset-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default async function NewSellerAssetPage() {
  const t = await getTranslations("seller");

  return (
    <>
      <SiteHeader />
      <main className="seller-editor container">
        <Link className="back-link" href="/seller/dashboard">← {t("assetBack")}</Link>
        <p className="eyebrow">{t("newOpportunity")}</p>
        <h1>{t("createTitle")}</h1>
        <p className="seller-editor__intro">{t("newIntro")}</p>
        <AssetForm />
      </main>
      <SiteFooter />
    </>
  );
}
