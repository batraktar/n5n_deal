import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import type { BuyerRecommendation } from "@/features/buyer/buyer-types";

type RecommendationCardProps = Readonly<{
  recommendation: BuyerRecommendation;
}>;

function formatCurrency(value: string, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

export async function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const t = await getTranslations("buyer");
  const assetT = await getTranslations("asset");
  const matchingT = await getTranslations("matching");
  const locale = await getLocale();
  const { asset, reasons, score } = recommendation;
  const translatedReasons = reasons.map((reason) => {
    switch (reason) {
      case "Same industry": return matchingT("sameIndustry");
      case "Budget compatible": return matchingT("budgetCompatible");
      case "Preferred location": return matchingT("preferredLocation");
      case "Matches acquisition interests": return matchingT("interests");
      default: return reason;
    }
  });

  return (
    <article className="recommendation-card">
      <div className="recommendation-card__header">
        <p>{asset.industry} · {asset.location}</p>
        <strong>{matchingT("match", { score })}</strong>
      </div>
      <h2>{asset.title}</h2>
      <p className="recommendation-card__copy">{asset.description}</p>
      <dl>
        <div><dt>{t("valuation")}</dt><dd>{formatCurrency(asset.valuation, asset.currency, locale)}</dd></div>
      </dl>
      <div className="recommendation-card__footer">
        <ul aria-label={matchingT("matchReasons")}>{translatedReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
        <Link className="text-link" href={`/assets/${asset.id}`}>{assetT("viewOpportunity")}</Link>
      </div>
    </article>
  );
}
