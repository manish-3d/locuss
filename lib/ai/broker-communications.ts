import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

type ContactInput = {
  propertyId: string;
  buyerId: string;
  message: string;
  inquiryId?: string;
};

export async function sendBrokerMessage({
  propertyId,
  buyerId,
  message,
  inquiryId,
}: ContactInput) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      ownerId: true,
      owner: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!property) {
    throw new Error("Property not found or not available.");
  }

  if (property.ownerId === buyerId) {
    throw new Error("You cannot contact yourself about your own property.");
  }

  const result = await prisma.$transaction(async (tx) => {
    let chat = await tx.chat.upsert({
      where: {
        propertyId_buyerId_sellerId: {
          propertyId,
          buyerId,
          sellerId: property.ownerId,
        },
      },
      create: {
        propertyId,
        buyerId,
        sellerId: property.ownerId,
        inquiryId,
      },
      update: {},
      select: { id: true, inquiryId: true },
    });

    if (inquiryId && !chat.inquiryId) {
      chat = await tx.chat.update({
        where: { id: chat.id },
        data: { inquiryId },
        select: { id: true, inquiryId: true },
      });
    }

    const chatMessage = await tx.chatMessage.create({
      data: {
        chatId: chat.id,
        senderId: buyerId,
        content: message,
      },
    });

    await tx.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    const notification = await tx.notification.create({
      data: {
        userId: property.ownerId,
        type: inquiryId ? "new_inquiry" : "new_message",
        content: inquiryId
          ? `New inquiry about ${property.title}`
          : `New message about ${property.title}`,
        link: "/dashboard/messages",
      },
    });

    return { chat, chatMessage, notification };
  });

  try {
    await pusherServer.trigger(`chat-${result.chat.id}`, "new-message", result.chatMessage);
    await pusherServer.trigger(`user-${property.ownerId}`, "new-notification", {
      type: result.notification.type,
      chatId: result.chat.id,
    });
  } catch (error) {
    console.error("BROKER_PUSHER_NOTIFICATION_ERROR:", error);
  }

  revalidatePath("/dashboard/messages");
  revalidatePath(`/properties/${propertyId}`);

  return {
    chatId: result.chat.id,
    propertyId: property.id,
    property: {
      id: property.id,
      title: property.title,
    },
    recipient: property.owner,
    seller: property.owner,
    message: result.chatMessage.content,
    messageId: result.chatMessage.id,
    createdAt: result.chatMessage.createdAt.toISOString(),
  };
}
