"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";

import { saveSellerAssetAction } from "@/features/seller/actions";
import { assetFormSchema } from "@/features/seller/asset-validation";
import { initialSellerAssetFormState } from "@/features/seller/seller-types";

import type { AssetFormInput, AssetFormValues } from "@/features/seller/asset-validation";

type AssetFormProps = Readonly<{
  assetId?: string;
  initialValues?: AssetFormValues;
}>;

const defaultValues: AssetFormValues = {
  currency: "USD",
  description: "",
  industry: "",
  location: "",
  revenue: undefined,
  status: "DRAFT",
  title: "",
  valuation: 0,
};

function toFormData(values: AssetFormValues, assetId: string | undefined): FormData {
  const formData = new FormData();
  formData.set("currency", values.currency);
  formData.set("description", values.description);
  formData.set("industry", values.industry);
  formData.set("location", values.location);
  formData.set("revenue", values.revenue === undefined ? "" : values.revenue.toString());
  formData.set("status", values.status);
  formData.set("title", values.title);
  formData.set("valuation", values.valuation.toString());

  if (assetId !== undefined) {
    formData.set("assetId", assetId);
  }

  return formData;
}

export function AssetForm({ assetId, initialValues = defaultValues }: AssetFormProps) {
  const [state, submitAction, isPending] = useActionState(saveSellerAssetAction, initialSellerAssetFormState);
  const form = useForm<AssetFormInput, unknown, AssetFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(assetFormSchema),
  });

  const submit = form.handleSubmit((values) => {
    startTransition(() => {
      submitAction(toFormData(values, assetId));
    });
  });

  const titleError = form.formState.errors.title?.message ?? state.fieldErrors.title;
  const descriptionError = form.formState.errors.description?.message ?? state.fieldErrors.description;
  const industryError = form.formState.errors.industry?.message ?? state.fieldErrors.industry;
  const valuationError = form.formState.errors.valuation?.message ?? state.fieldErrors.valuation;
  const currencyError = form.formState.errors.currency?.message ?? state.fieldErrors.currency;
  const locationError = form.formState.errors.location?.message ?? state.fieldErrors.location;
  const revenueError = form.formState.errors.revenue?.message ?? state.fieldErrors.revenue;

  return (
    <form className="seller-form" noValidate onSubmit={submit}>
      {state.message !== null ? <p className="seller-form__message" role="alert">{state.message}</p> : null}
      <div className="seller-form__grid">
        <label className="seller-form__field seller-form__field--wide">
          <span>Asset title</span>
          <input aria-invalid={titleError !== undefined} {...form.register("title")} />
          {titleError !== undefined ? <small>{titleError}</small> : null}
        </label>
        <label className="seller-form__field seller-form__field--wide">
          <span>Overview</span>
          <textarea aria-invalid={descriptionError !== undefined} rows={6} {...form.register("description")} />
          {descriptionError !== undefined ? <small>{descriptionError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Industry</span>
          <input aria-invalid={industryError !== undefined} {...form.register("industry")} />
          {industryError !== undefined ? <small>{industryError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Location</span>
          <input aria-invalid={locationError !== undefined} {...form.register("location")} />
          {locationError !== undefined ? <small>{locationError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Indicative valuation</span>
          <input aria-invalid={valuationError !== undefined} inputMode="decimal" type="number" {...form.register("valuation", { valueAsNumber: true })} />
          {valuationError !== undefined ? <small>{valuationError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Currency</span>
          <select aria-invalid={currencyError !== undefined} {...form.register("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {currencyError !== undefined ? <small>{currencyError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Annual revenue (optional)</span>
          <input aria-invalid={revenueError !== undefined} inputMode="decimal" type="number" {...form.register("revenue", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {revenueError !== undefined ? <small>{revenueError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Listing status</span>
          <select {...form.register("status")}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
      </div>
      <div className="seller-form__actions">
        <button className="seller-button" disabled={isPending} type="submit">
          {isPending ? "Saving…" : assetId === undefined ? "Create asset" : "Save changes"}
        </button>
        <Link className="text-link" href="/seller/dashboard">Cancel</Link>
      </div>
    </form>
  );
}
