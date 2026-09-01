import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { RecommendationCard } from "@/components/buyer/recommendation-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getBuyerProfile, getBuyerRecommendations } from "@/features/buyer/buyer-repository";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const t = await getTranslations("buyer");
  const [profile, recommendations] = await Promise.all([getBuyerProfile(), getBuyerRecommendations()]);

  return (
    <>
      <SiteHeader />
      <main className="buyer-dashboard container">
        <div className="buyer-dashboard__heading">
          <div>
            <p className="eyebrow">{t("workspaceEyebrow")}</p>
            <h1>{t("dashboardTitle")}</h1>
            <p>{t("dashboardDescription")}</p>
          </div>
          <Link className="link-button link-button--secondary" href="/buyer/profile">{t("editProfile")}</Link>
        </div>
        {profile === null ? (
          <section className="empty-state">
            <h2>{t("completeTitle")}</h2>
            <p>{t("completeDescription")}</p>
            <Link href="/buyer/profile">{t("createProfile")}</Link>
          </section>
        ) : recommendations.length === 0 ? (
          <section className="empty-state">
            <h2>{t("noneTitle")}</h2>
            <p>{t("noneDescription")}</p>
            <Link href="/buyer/profile">{t("adjustPreferences")}</Link>
          </section>
        ) : <div className="recommendation-grid">{recommendations.map((recommendation) => <RecommendationCard key={recommendation.asset.id} recommendation={recommendation} />)}</div>}
      </main>
      <SiteFooter />
    </>
  );
}
