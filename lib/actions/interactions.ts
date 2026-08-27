"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InquiryStatus } from "@prisma/client";

// Toggle Favorite (Add / Remove)
export async function toggleFavorite(propertyId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized. Please sign in.");
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: session.user.id,
        propertyId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId,
      },
    });
  }

  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
}

// Send Inquiry to Property Owner
export async function sendInquiry(propertyId: string, message: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized. Please sign in to send inquiries.");
  }

  if (!message || message.trim().length < 5) {
    throw new Error("Message must be at least 5 characters long.");
  }
  
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  
  if (!property) throw new Error("Property not found");

  const inquiry = await prisma.inquiry.create({
    data: {
      propertyId,
      buyerId: session.user.id,
      message: message.trim(),
      status: "OPEN",
    },
  });
  
  if (property.ownerId !== session.user.id) {
    let chat = await prisma.chat.findUnique({
      where: {
        propertyId_buyerId_sellerId: {
          propertyId,
          buyerId: session.user.id,
          sellerId: property.ownerId
        }
      }
    });
    
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          propertyId,
          buyerId: session.user.id,
          sellerId: property.ownerId,
          inquiryId: inquiry.id
        }
      });
    } else if (!chat.inquiryId) {
      chat = await prisma.chat.update({
        where: { id: chat.id },
        data: { inquiryId: inquiry.id }
      });
    }
    
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        senderId: session.user.id,
        content: message.trim()
      }
    });
    
    await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() }
    });
  }

  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/dashboard/messages");
}

// Update Inquiry Status (Owner/Admin)
export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { property: true },
  });

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (inquiry.property.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: { status },
  });

  revalidatePath("/dashboard/messages");
}

// Delete Inquiry
export async function deleteInquiry(inquiryId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { property: true },
  });

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (
    inquiry.buyerId !== session.user.id &&
    inquiry.property.ownerId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.inquiry.delete({
    where: { id: inquiryId },
  });

  revalidatePath("/dashboard/messages");
}

// Add Review to Property
export async function addReview(propertyId: string, rating: number, comment: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized. Please sign in to write a review.");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  if (!comment || comment.trim().length < 5) {
    throw new Error("Comment must be at least 5 characters.");
  }

  await prisma.review.create({
    data: {
      propertyId,
      userId: session.user.id,
      rating,
      comment: comment.trim(),
    },
  });

  revalidatePath(`/properties/${propertyId}`);
}
