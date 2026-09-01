import { notFound } from "next/navigation";
import Link from "next/link";

import { AssetForm } from "@/components/seller/asset-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSellerAssetById } from "@/features/seller/seller-repository";

type EditSellerAssetPageProps = Readonly<{
  params: Promise<Readonly<{ assetId: string }>>;
}>;

export default async function EditSellerAssetPage({ params }: EditSellerAssetPageProps) {
  const { assetId } = await params;
  const asset = await getSellerAssetById(assetId);

  if (asset === null) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="seller-editor container">
        <Link className="back-link" href="/seller/dashboard">← Seller dashboard</Link>
        <p className="eyebrow">Edit opportunity</p>
        <h1>{asset.title}</h1>
        <p className="seller-editor__intro">Update the buyer-facing information or change the publication state of this asset.</p>
        <AssetForm
          assetId={asset.id}
          initialValues={{
            currency: asset.currency,
            description: asset.description,
            industry: asset.industry,
            location: asset.location,
            revenue: asset.revenue === null ? undefined : Number(asset.revenue),
            status: asset.status,
            title: asset.title,
            valuation: Number(asset.valuation),
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
