"use client";

import { ContactMessageForm } from "@/components/messages/contact-message-form";
import { sendBuyerMessageAction } from "@/features/messages/actions";

type ContactSellerFormProps = Readonly<{
  assetId: string;
}>;

export function ContactSellerForm({ assetId }: ContactSellerFormProps) {
  return (
    <ContactMessageForm
      action={sendBuyerMessageAction}
      fieldName="assetId"
      label="Message the seller"
      recipientId={assetId}
      submitLabel="Contact seller"
    />
  );
}
