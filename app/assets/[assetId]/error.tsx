"use client";

import { DataErrorState } from "@/components/layout/data-error-state";

type AssetDetailsErrorProps = Readonly<{
  reset: () => void;
}>;

export default function AssetDetailsError({ reset }: AssetDetailsErrorProps) {
  return <DataErrorState reset={reset} />;
}
