import { requireBrokerUser } from "@/lib/ai/session";
import { sendBrokerMessage } from "@/lib/ai/broker-communications";

const DEFAULT_CONTACT_MESSAGE =
  "Hello, I am interested in this property. Could you please share its availability and next steps?";

export async function contactPropertyOwner(
  propertyId: string,
  message = DEFAULT_CONTACT_MESSAGE,
) {
  const user = await requireBrokerUser();
  const trimmedMessage = message.trim() || DEFAULT_CONTACT_MESSAGE;

  if (trimmedMessage.length > 2000) {
    throw new Error("Your message must be 2,000 characters or fewer.");
  }

  return sendBrokerMessage({
    propertyId,
    buyerId: user.id,
    message: trimmedMessage,
  });
}
