import { ContactBuyerForm } from "./contact-buyer-form";
import { getLocale, getTranslations } from "next-intl/server";

import type { SellerBuyer } from "@/features/seller/seller-types";

type SellerBuyerCardProps = Readonly<{
  buyer: SellerBuyer;
}>;

function formatBudget(value: string | null, currency: string, locale: string, flexible: string): string {
  if (value === null) {
    return flexible;
  }

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value));
}

function budgetLabel(
  buyer: SellerBuyer,
  locale: string,
  flexible: string,
  flexibleBudget: string,
  upTo: (value: string) => string,
): string {
  const minimum = formatBudget(buyer.budgetMin, buyer.currency, locale, flexible);
  const maximum = formatBudget(buyer.budgetMax, buyer.currency, locale, flexible);

  if (buyer.budgetMin === null && buyer.budgetMax === null) {
    return flexibleBudget;
  }

  if (buyer.budgetMin === null) {
    return upTo(maximum);
  }

  if (buyer.budgetMax === null) {
    return `${minimum}+`;
  }

  return `${minimum} – ${maximum}`;
}

export async function SellerBuyerCard({ buyer }: SellerBuyerCardProps) {
  const t = await getTranslations("seller");
  const matchingT = await getTranslations("matching");
  const locale = await getLocale();
  const matchReasons = buyer.matchReasons.map((reason) => {
    switch (reason) {
      case "Same industry": return matchingT("sameIndustry");
      case "Budget compatible": return matchingT("budgetCompatible");
      case "Preferred location": return matchingT("preferredLocation");
      case "Matches acquisition interests": return matchingT("interests");
      default: return reason;
    }
  });

  return (
    <article className="seller-buyer-card">
      <header className="seller-buyer-card__header">
        <div>
          <p>{t("buyerProfile")}</p>
          <h2>{buyer.companyName ?? buyer.name}</h2>
          {buyer.companyName !== null && buyer.companyName !== buyer.name ? <span>{buyer.name}</span> : null}
        </div>
        {buyer.matchScore === null ? <span className="seller-buyer-card__score">{t("publishToMatch")}</span> : (
          <strong className="seller-buyer-card__score">{matchingT("match", { score: buyer.matchScore })}</strong>
        )}
      </header>
      <p className="seller-buyer-card__interests">{buyer.interests}</p>
      <dl className="seller-buyer-card__facts">
        <div><dt>{t("budget")}</dt><dd>{budgetLabel(buyer, locale, t("flexible"), t("flexibleBudget"), (value) => t("upTo", { value }))}</dd></div>
        <div><dt>{t("industries")}</dt><dd>{buyer.industries.join(", ")}</dd></div>
        <div><dt>{t("locations")}</dt><dd>{buyer.preferredLocations.join(", ")}</dd></div>
      </dl>
      {buyer.matchReasons.length > 0 ? (
        <ul aria-label={matchingT("matchReasons")} className="seller-buyer-card__reasons">
          {matchReasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      ) : null}
      <ContactBuyerForm buyerId={buyer.id} />
    </article>
  );
}
