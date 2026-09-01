"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { buyerMessageFormSchema, initialBuyerMessageActionState } from "@/features/messages/message-validation";
import { translateValidationMessage } from "@/lib/i18n/validation";

import type { BuyerMessageActionState, BuyerMessageFormValues } from "@/features/messages/message-validation";

type ContactMessageAction = (
  previousState: BuyerMessageActionState,
  formData: FormData,
) => Promise<BuyerMessageActionState>;

type ContactMessageFormProps = Readonly<{
  action: ContactMessageAction;
  fieldName: "assetId" | "buyerId";
  label: string;
  recipientId: string;
  submitLabel: string;
}>;

export function ContactMessageForm({
  action,
  fieldName,
  label,
  recipientId,
  submitLabel,
}: ContactMessageFormProps) {
  const t = useTranslations("messages");
  const validationT = useTranslations("validation");
  const [state, submitAction, isPending] = useActionState(action, initialBuyerMessageActionState);
  const form = useForm<BuyerMessageFormValues>({ resolver: zodResolver(buyerMessageFormSchema) });
  const contentError = translateValidationMessage(validationT, form.formState.errors.content?.message);
  const messageId = `message-${fieldName}-${recipientId}`;
  const errorId = `${messageId}-error`;

  const submit = form.handleSubmit((values) => {
    const formData = new FormData();
    formData.set(fieldName, recipientId);
    formData.set("content", values.content);
    startTransition(() => {
      submitAction(formData);
    });
  });

  return (
    <form className="contact-message-form" noValidate onSubmit={submit}>
      <label>
        <span>{label}</span>
        <textarea
          aria-invalid={contentError !== undefined}
          aria-describedby={contentError === undefined ? undefined : errorId}
          id={messageId}
          placeholder={t("placeholder")}
          rows={4}
          {...form.register("content")}
        />
      </label>
      {contentError !== undefined ? <small id={errorId} role="alert">{contentError}</small> : null}
      {state.message !== null ? <p role={state.kind === "success" ? "status" : "alert"}>{state.message}</p> : null}
      <button className="link-button link-button--primary" disabled={isPending} type="submit">
        {isPending ? t("sending") : submitLabel}
      </button>
    </form>
  );
}
