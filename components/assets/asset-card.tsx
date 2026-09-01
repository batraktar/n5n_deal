import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import type { AssetPreview } from "@/features/assets/asset-types";

type AssetCardProps = Readonly<{
  asset: AssetPreview;
}>;

function formatCurrency(value: string, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export async function AssetCard({ asset }: AssetCardProps) {
  const t = await getTranslations("asset");
  const locale = await getLocale();

  return (
    <article className="asset-card">
      <div className="asset-card__meta">
        <span>{asset.industry}</span>
        <span>{asset.location}</span>
      </div>
      <h2>{asset.title}</h2>
      <p>{asset.description}</p>
      <dl className="asset-card__facts">
        <div>
          <dt>{t("askingValuation")}</dt>
          <dd>{formatCurrency(asset.valuation, asset.currency, locale)}</dd>
        </div>
        <div>
          <dt>{t("seller")}</dt>
          <dd>{asset.sellerName}</dd>
        </div>
      </dl>
      <Link className="asset-card__link" href={`/assets/${asset.id}`}>
        {t("viewOpportunity")}
      </Link>
    </article>
  );
}
