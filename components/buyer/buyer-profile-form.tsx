"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { saveBuyerProfileAction } from "@/features/buyer/actions";
import { buyerProfileFormSchema } from "@/features/buyer/buyer-profile-validation";
import { initialBuyerProfileFormState } from "@/features/buyer/buyer-types";

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

  const companyNameError = form.formState.errors.companyName?.message ?? state.fieldErrors.companyName;
  const interestsError = form.formState.errors.interests?.message ?? state.fieldErrors.interests;
  const industriesError = form.formState.errors.industries?.message ?? state.fieldErrors.industries;
  const locationsError = form.formState.errors.preferredLocations?.message ?? state.fieldErrors.preferredLocations;
  const budgetMinError = form.formState.errors.budgetMin?.message ?? state.fieldErrors.budgetMin;
  const budgetMaxError = form.formState.errors.budgetMax?.message ?? state.fieldErrors.budgetMax;

  return (
    <form className="seller-form buyer-form" noValidate onSubmit={submit}>
      {state.message !== null ? <p className="seller-form__message" role="alert">{state.message}</p> : null}
      <div className="seller-form__grid">
        <label className="seller-form__field seller-form__field--wide">
          <span>Company name</span>
          <input aria-invalid={companyNameError !== undefined} {...form.register("companyName")} />
          {companyNameError !== undefined ? <small>{companyNameError}</small> : null}
        </label>
        <label className="seller-form__field seller-form__field--wide">
          <span>Acquisition interests</span>
          <textarea aria-invalid={interestsError !== undefined} rows={5} {...form.register("interests")} />
          {interestsError !== undefined ? <small>{interestsError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Interested industries</span>
          <input aria-invalid={industriesError !== undefined} {...form.register("industries")} />
          {industriesError !== undefined ? <small>{industriesError}</small> : <small>Separate industries with commas.</small>}
        </label>
        <label className="seller-form__field">
          <span>Preferred locations</span>
          <input aria-invalid={locationsError !== undefined} {...form.register("preferredLocations")} />
          {locationsError !== undefined ? <small>{locationsError}</small> : <small>Separate locations with commas.</small>}
        </label>
        <label className="seller-form__field">
          <span>Minimum budget</span>
          <input aria-invalid={budgetMinError !== undefined} inputMode="decimal" type="number" {...form.register("budgetMin", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {budgetMinError !== undefined ? <small>{budgetMinError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Maximum budget</span>
          <input aria-invalid={budgetMaxError !== undefined} inputMode="decimal" type="number" {...form.register("budgetMax", { setValueAs: (value: string) => value === "" ? undefined : Number(value) })} />
          {budgetMaxError !== undefined ? <small>{budgetMaxError}</small> : null}
        </label>
        <label className="seller-form__field">
          <span>Currency</span>
          <select {...form.register("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </div>
      <div className="seller-form__actions">
        <button className="seller-button" disabled={isPending} type="submit">{isPending ? "Saving…" : "Save preferences"}</button>
        <Link className="text-link" href="/buyer/dashboard">View recommendations</Link>
      </div>
    </form>
  );
}
