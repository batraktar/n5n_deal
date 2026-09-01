"use client";

import { ContactMessageForm } from "@/components/messages/contact-message-form";
import { sendBuyerMessageAction } from "@/features/messages/actions";
import { useTranslations } from "next-intl";

type ContactSellerFormProps = Readonly<{
  assetId: string;
}>;

export function ContactSellerForm({ assetId }: ContactSellerFormProps) {
  const t = useTranslations("messages");

  return (
    <ContactMessageForm
      action={sendBuyerMessageAction}
      fieldName="assetId"
      label={t("messageSeller")}
      recipientId={assetId}
      submitLabel={t("contactSeller")}
    />
  );
}
