import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactSellerForm } from "@/components/buyer/contact-seller-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedAssetById } from "@/features/assets/asset-repository";
import { resolveLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";

type AssetDetailsPageProps = Readonly<{
  params: Promise<Readonly<{ assetId: string }>>;
}>;

function formatCurrency(value: string, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export default async function AssetDetailsPage({ params }: AssetDetailsPageProps) {
  const t = await getTranslations("asset");
  const locale = resolveLocale(await getLocale());
  const { assetId } = await params;
  const asset = await getPublishedAssetById(assetId, locale);

  if (asset === null) {
    notFound();
  }

  return (
    <div>
      <SiteHeader />
      <main className="asset-details container">
        <Link className="back-link" href="/marketplace">
          {t("backMarketplace")}
        </Link>
        <div className="asset-details__layout">
          <article className="asset-details__content">
            <p className="eyebrow">{asset.industry}</p>
            <h1>{asset.title}</h1>
            <p className="asset-details__location">{asset.location}</p>
            <div className="asset-details__description">
              <h2>{t("companyOverview")}</h2>
              <p>{asset.description}</p>
            </div>
          </article>
          <aside className="asset-details__panel">
            <dl>
              <div>
                <dt>{t("askingValuation")}</dt>
                <dd>{formatCurrency(asset.valuation, asset.currency, locale)}</dd>
              </div>
              <div>
                <dt>{t("annualRevenue")}</dt>
                <dd>{asset.revenue === null ? t("notDisclosed") : formatCurrency(asset.revenue, asset.currency, locale)}</dd>
              </div>
              <div>
                <dt>{t("listedBy")}</dt>
                <dd>{asset.sellerName}</dd>
              </div>
            </dl>
            <ContactSellerForm assetId={asset.id} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
