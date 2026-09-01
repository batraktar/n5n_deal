import { ContactMessageForm } from "@/components/messages/contact-message-form";
import { sendSellerMessageAction } from "@/features/messages/actions";
import { getTranslations } from "next-intl/server";

type ContactBuyerFormProps = Readonly<{
  buyerId: string;
}>;

export async function ContactBuyerForm({ buyerId }: ContactBuyerFormProps) {
  const t = await getTranslations("messages");

  return (
    <ContactMessageForm
      action={sendSellerMessageAction}
      fieldName="buyerId"
      label={t("messageBuyer")}
      recipientId={buyerId}
      submitLabel={t("contactBuyer")}
    />
  );
}
