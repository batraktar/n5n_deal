import { ContactMessageForm } from "@/components/messages/contact-message-form";
import { sendSellerMessageAction } from "@/features/messages/actions";

type ContactBuyerFormProps = Readonly<{
  buyerId: string;
}>;

export function ContactBuyerForm({ buyerId }: ContactBuyerFormProps) {
  return (
    <ContactMessageForm
      action={sendSellerMessageAction}
      fieldName="buyerId"
      label="Message this buyer"
      recipientId={buyerId}
      submitLabel="Contact buyer"
    />
  );
}
