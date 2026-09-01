import Link from "next/link";

import { RecommendationCard } from "@/components/buyer/recommendation-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getBuyerProfile, getBuyerRecommendations } from "@/features/buyer/buyer-repository";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const [profile, recommendations] = await Promise.all([getBuyerProfile(), getBuyerRecommendations()]);

  return (
    <>
      <SiteHeader />
      <main className="buyer-dashboard container">
        <div className="buyer-dashboard__heading">
          <div>
            <p className="eyebrow">Buyer workspace</p>
            <h1>Relevant opportunities, ranked.</h1>
            <p>Recommendations use your industry, location, budget, and acquisition-interest preferences.</p>
          </div>
          <Link className="link-button link-button--secondary" href="/buyer/profile">Edit profile</Link>
        </div>
        {profile === null ? (
          <section className="empty-state">
            <h2>Complete your investment profile</h2>
            <p>Add your preferences to receive relevant opportunity recommendations.</p>
            <Link href="/buyer/profile">Create profile</Link>
          </section>
        ) : recommendations.length === 0 ? (
          <section className="empty-state">
            <h2>No recommendations yet</h2>
            <p>Try broadening your locations, industries, or budget range to surface more opportunities.</p>
            <Link href="/buyer/profile">Adjust preferences</Link>
          </section>
        ) : <div className="recommendation-grid">{recommendations.map((recommendation) => <RecommendationCard key={recommendation.asset.id} recommendation={recommendation} />)}</div>}
      </main>
      <SiteFooter />
    </>
  );
}
