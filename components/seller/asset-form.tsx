"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { saveSellerAssetAction } from "@/features/seller/actions";
import { assetFormSchema } from "@/features/seller/asset-validation";
import { initialSellerAssetFormState } from "@/features/seller/seller-types";
import { translateValidationMessage } from "@/lib/i18n/validation";

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
  const t = useTranslations("seller");
  const validationT = useTranslations("validation");
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

  const titleError = translateValidationMessage(validationT, form.formState.errors.title?.message ?? state.fieldErrors.title);
  const descriptionError = translateValidationMessage(validationT, form.formState.errors.description?.message ?? state.fieldErrors.description);
  const industryError = translateValidationMessage(validationT, form.formState.errors.industry?.message ?? state.fieldErrors.industry);
  const valuationError = translateValidationMessage(validationT, form.formState.errors.valuation?.message ?? state.fieldErrors.valuation);
  const currencyError = translateValidationMessage(validationT, form.formState.errors.currency?.message ?? state.fieldErrors.currency);
  const locationError = translateValidationMessage(validationT, form.formState.errors.location?.message ?? state.fieldErrors.location);
  const revenueError = translateValidationMessage(validationT, form.formState.errors.revenue?.message ?? state.fieldErrors.revenue);

  return (
    <form className="seller-form" noValidate onSubmit={submit}>
      {state.message !== null ? <p className="seller-form__message" role="alert">{state.message}</p> : null}
      <div className="seller-form__grid">
        <label className="seller-form__field seller-form__field--wide">
          <span>{t("assetTitle")}</span>
          <input aria-invalid={titleError !== undefined} {...form.register("title")} />
          {titleError !== undefined ? <small>{titleError}</small> : null}
        </label>
        <label className="seller-form__field seller-form__field--wide">
          <span>{t("overview")}</span>
          <textarea aria-invalid={descriptionError !== undefined} rows={6} {...form.register("description")} />
          {descriptionError !== undefined ? <small>{descriptionError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("industry")}</span>
          <input aria-invalid={industryError !== undefined} {...form.register("industry")} />
          {industryError !== undefined ? <small>{industryError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("location")}</span>
          <input aria-invalid={locationError !== undefined} {...form.register("location")} />
          {locationError !== undefined ? <small>{locationError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("valuation")}</span>
          <input aria-invalid={valuationError !== undefined} inputMode="decimal" type="number" {...form.register("valuation", { valueAsNumber: true })} />
          {valuationError !== undefined ? <small>{valuationError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("currency")}</span>
          <select aria-invalid={currencyError !== undefined} {...form.register("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {currencyError !== undefined ? <small>{currencyError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("revenue")}</span>
          <input aria-invalid={revenueError !== undefined} inputMode="decimal" type="number" {...form.register("revenue", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {revenueError !== undefined ? <small>{revenueError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("listingStatus")}</span>
          <select {...form.register("status")}>
            <option value="DRAFT">{t("draft")}</option>
            <option value="PUBLISHED">{t("published")}</option>
            <option value="ARCHIVED">{t("archived")}</option>
          </select>
        </label>
      </div>
      <div className="seller-form__actions">
        <button className="seller-button" disabled={isPending} type="submit">
          {isPending ? t("saving") : assetId === undefined ? t("createAsset") : t("saveChanges")}
        </button>
        <Link className="text-link" href="/seller/dashboard">{t("cancel")}</Link>
      </div>
    </form>
  );
}
