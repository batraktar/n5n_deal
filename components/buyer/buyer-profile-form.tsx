"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { saveBuyerProfileAction } from "@/features/buyer/actions";
import { buyerProfileFormSchema } from "@/features/buyer/buyer-profile-validation";
import { initialBuyerProfileFormState } from "@/features/buyer/buyer-types";
import { translateValidationMessage } from "@/lib/i18n/validation";

import type { BuyerProfileFormInput, BuyerProfileFormValues } from "@/features/buyer/buyer-profile-validation";

type BuyerProfileInitialValues = Readonly<{
  budgetMax: number | undefined;
  budgetMin: number | undefined;
  companyName: string;
  currency: string;
  industries: string;
  interests: string;
  preferredLocations: string;
}>;

type BuyerProfileFormProps = Readonly<{
  initialValues: BuyerProfileInitialValues;
}>;

function toFormData(values: BuyerProfileFormValues): FormData {
  const formData = new FormData();
  formData.set("budgetMax", values.budgetMax === undefined ? "" : values.budgetMax.toString());
  formData.set("budgetMin", values.budgetMin === undefined ? "" : values.budgetMin.toString());
  formData.set("companyName", values.companyName ?? "");
  formData.set("currency", values.currency);
  formData.set("industries", values.industries.join(", "));
  formData.set("interests", values.interests);
  formData.set("preferredLocations", values.preferredLocations.join(", "));
  return formData;
}

export function BuyerProfileForm({ initialValues }: BuyerProfileFormProps) {
  const t = useTranslations("buyer");
  const validationT = useTranslations("validation");
  const [state, submitAction, isPending] = useActionState(saveBuyerProfileAction, initialBuyerProfileFormState);
  const form = useForm<BuyerProfileFormInput, unknown, BuyerProfileFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(buyerProfileFormSchema),
  });

  const submit = form.handleSubmit((values) => {
    startTransition(() => {
      submitAction(toFormData(values));
    });
  });

  const companyNameError = translateValidationMessage(validationT, form.formState.errors.companyName?.message ?? state.fieldErrors.companyName);
  const interestsError = translateValidationMessage(validationT, form.formState.errors.interests?.message ?? state.fieldErrors.interests);
  const industriesError = translateValidationMessage(validationT, form.formState.errors.industries?.message ?? state.fieldErrors.industries);
  const locationsError = translateValidationMessage(validationT, form.formState.errors.preferredLocations?.message ?? state.fieldErrors.preferredLocations);
  const budgetMinError = translateValidationMessage(validationT, form.formState.errors.budgetMin?.message ?? state.fieldErrors.budgetMin);
  const budgetMaxError = translateValidationMessage(validationT, form.formState.errors.budgetMax?.message ?? state.fieldErrors.budgetMax);

  return (
    <form className="seller-form buyer-form" noValidate onSubmit={submit}>
      {state.message !== null ? <p className="seller-form__message" role="alert">{state.message}</p> : null}
      <div className="seller-form__grid">
        <label className="seller-form__field seller-form__field--wide">
          <span>{t("companyName")}</span>
          <input aria-invalid={companyNameError !== undefined} {...form.register("companyName")} />
          {companyNameError !== undefined ? <small>{companyNameError}</small> : null}
        </label>
        <label className="seller-form__field seller-form__field--wide">
          <span>{t("interests")}</span>
          <textarea aria-invalid={interestsError !== undefined} rows={5} {...form.register("interests")} />
          {interestsError !== undefined ? <small>{interestsError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("industries")}</span>
          <input aria-invalid={industriesError !== undefined} {...form.register("industries")} />
          {industriesError !== undefined ? <small>{industriesError}</small> : <small>{t("listHint")}</small>}
        </label>
        <label className="seller-form__field">
          <span>{t("locations")}</span>
          <input aria-invalid={locationsError !== undefined} {...form.register("preferredLocations")} />
          {locationsError !== undefined ? <small>{locationsError}</small> : <small>{t("listHint")}</small>}
        </label>
        <label className="seller-form__field">
          <span>{t("minimumBudget")}</span>
          <input aria-invalid={budgetMinError !== undefined} inputMode="decimal" type="number" {...form.register("budgetMin", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {budgetMinError !== undefined ? <small>{budgetMinError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("maximumBudget")}</span>
          <input aria-invalid={budgetMaxError !== undefined} inputMode="decimal" type="number" {...form.register("budgetMax", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {budgetMaxError !== undefined ? <small>{budgetMaxError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>{t("currency")}</span>
          <select {...form.register("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </div>
      <div className="seller-form__actions">
        <button className="seller-button" disabled={isPending} type="submit">{isPending ? t("saving") : t("savePreferences")}</button>
        <Link className="text-link" href="/buyer/dashboard">{t("viewRecommendations")}</Link>
      </div>
    </form>
  );
}
