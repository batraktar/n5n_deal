import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { SellerStatusForm } from "./seller-status-form";

import type { SellerAsset } from "@/features/seller/seller-types";

type SellerAssetCardProps = Readonly<{
  asset: SellerAsset;
}>;

function formatMoney(value: string, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export async function SellerAssetCard({ asset }: SellerAssetCardProps) {
  const t = await getTranslations("seller");
  const locale = await getLocale();

  return (
    <article className="seller-asset-card">
      <div className="seller-asset-card__heading">
        <div>
          <p>{asset.industry} · {asset.location}</p>
          <h2>{asset.title}</h2>
        </div>
        <span className={`asset-status asset-status--${asset.status.toLowerCase()}`}>
          {asset.status === "DRAFT" ? t("draft") : asset.status === "PUBLISHED" ? t("published") : t("archived")}
        </span>
      </div>
      <dl className="seller-asset-card__facts">
        <div><dt>{t("valuation")}</dt><dd>{formatMoney(asset.valuation, asset.currency, locale)}</dd></div>
        <div><dt>{t("lastUpdated")}</dt><dd>{asset.updatedAt.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}</dd></div>
      </dl>
      <div className="seller-asset-card__footer">
        <Link className="text-link" href={`/seller/assets/${asset.id}/edit`}>{t("editAsset")}</Link>
        <SellerStatusForm assetId={asset.id} status={asset.status} />
      </div>
    </article>
  );
}
