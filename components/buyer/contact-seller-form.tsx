"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { sendBuyerMessageAction } from "@/features/messages/actions";
import { initialBuyerMessageActionState } from "@/features/messages/buyer-message-service";
import { buyerMessageFormSchema } from "@/features/messages/message-validation";

import type { BuyerMessageFormValues } from "@/features/messages/message-validation";

type ContactSellerFormProps = Readonly<{
  assetId: string;
}>;

export function ContactSellerForm({ assetId }: ContactSellerFormProps) {
  const [state, submitAction, isPending] = useActionState(sendBuyerMessageAction, initialBuyerMessageActionState);
  const form = useForm<BuyerMessageFormValues>({ resolver: zodResolver(buyerMessageFormSchema) });
  const contentError = form.formState.errors.content?.message;

  const submit = form.handleSubmit((values) => {
    const formData = new FormData();
    formData.set("assetId", assetId);
    formData.set("content", values.content);
    startTransition(() => {
      submitAction(formData);
    });
  });

  return (
    <form className="contact-seller-form" noValidate onSubmit={submit}>
      <label>
        <span>Message the seller</span>
        <textarea aria-invalid={contentError !== undefined} placeholder="Introduce your interest in this opportunity." rows={5} {...form.register("content")} />
      </label>
      {contentError !== undefined ? <small>{contentError}</small> : null}
      {state.message !== null ? <p role={state.kind === "success" ? "status" : "alert"}>{state.message}</p> : null}
      <button className="link-button link-button--primary" disabled={isPending} type="submit">{isPending ? "Sending…" : "Contact seller"}</button>
    </form>
  );
}
