import { prisma } from "@/lib/prisma";
import { requireBrokerUser } from "@/lib/ai/session";
import { sendBrokerMessage } from "@/lib/ai/broker-communications";

export async function createInquiry(propertyId: string, message: string) {
  const user = await requireBrokerUser();
  const trimmedMessage = message.trim();

  if (trimmedMessage.length < 5 || trimmedMessage.length > 2000) {
    throw new Error("Your inquiry must be between 5 and 2,000 characters.");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      status: "PUBLISHED",
    },
    select: { id: true, title: true, ownerId: true },
  });

  if (!property) {
    throw new Error("Property not found or not available.");
  }

  if (property.ownerId === user.id) {
    throw new Error("You cannot send an inquiry about your own property.");
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      propertyId: property.id,
      buyerId: user.id,
      message: trimmedMessage,
      status: "OPEN",
    },
  });

  const contact = await sendBrokerMessage({
    propertyId: property.id,
    buyerId: user.id,
    message: trimmedMessage,
    inquiryId: inquiry.id,
  });

  return {
    inquiryId: inquiry.id,
    status: inquiry.status,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
    property: {
      id: property.id,
      title: property.title,
    },
    chatId: contact.chatId,
    recipient: contact.recipient,
  };
}
