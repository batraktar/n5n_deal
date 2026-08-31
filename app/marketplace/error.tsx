"use client";

import { DataErrorState } from "@/components/layout/data-error-state";

type MarketplaceErrorProps = Readonly<{
  reset: () => void;
}>;

export default function MarketplaceError({ reset }: MarketplaceErrorProps) {
  return <DataErrorState reset={reset} />;
}
