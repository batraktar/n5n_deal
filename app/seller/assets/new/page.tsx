import Link from "next/link";

import { AssetForm } from "@/components/seller/asset-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NewSellerAssetPage() {
  return (
    <>
      <SiteHeader />
      <main className="seller-editor container">
        <Link className="back-link" href="/seller/dashboard">← Seller dashboard</Link>
        <p className="eyebrow">New opportunity</p>
        <h1>Create an asset</h1>
        <p className="seller-editor__intro">Share the essential details buyers need to decide whether to start a conversation.</p>
        <AssetForm />
      </main>
      <SiteFooter />
    </>
  );
}
