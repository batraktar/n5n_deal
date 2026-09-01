import Link from "next/link";

import { BuyerProfileForm } from "@/components/buyer/buyer-profile-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getBuyerProfile } from "@/features/buyer/buyer-repository";

type BuyerProfilePageProps = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

function isSavedNotice(value: string | readonly string[] | undefined): boolean {
  return value === "saved";
}

export default async function BuyerProfilePage({ searchParams }: BuyerProfilePageProps) {
  const [profile, parameters] = await Promise.all([getBuyerProfile(), searchParams]);

  return (
    <>
      <SiteHeader />
      <main className="seller-editor buyer-profile container">
        <Link className="back-link" href="/buyer/dashboard">← Buyer dashboard</Link>
        <p className="eyebrow">Investment profile</p>
        <h1>What are you looking for?</h1>
        <p className="seller-editor__intro">Your preferences guide the recommendations shown in your buyer workspace.</p>
        {isSavedNotice(parameters["notice"]) ? <p className="seller-notice" role="status">Investment preferences saved.</p> : null}
        <BuyerProfileForm
          initialValues={{
            budgetMax: profile?.budgetMax === null || profile === null ? undefined : Number(profile.budgetMax),
            budgetMin: profile?.budgetMin === null || profile === null ? undefined : Number(profile.budgetMin),
            companyName: profile?.companyName ?? "",
            currency: profile?.currency ?? "USD",
            industries: profile?.industries.join(", ") ?? "",
            interests: profile?.interests ?? "",
            preferredLocations: profile?.preferredLocations.join(", ") ?? "",
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
