import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireBrokerUser } from "@/lib/ai/session";

export async function scheduleViewing(
  propertyId: string,
  scheduledAt: string,
  note?: string,
) {
  const user = await requireBrokerUser();
  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Please provide the viewing time as a valid ISO-8601 date.");
  }

  if (date <= new Date()) {
    throw new Error("The viewing time must be in the future.");
  }

  const trimmedNote = note?.trim() || null;
  if (trimmedNote && trimmedNote.length > 1000) {
    throw new Error("Viewing notes must be 1,000 characters or fewer.");
  }

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

  if (property.ownerId === user.id) {
    throw new Error("You cannot schedule a viewing for your own property.");
  }

  const viewing = await prisma.$transaction(async (tx) => {
    const conflictingViewing = await tx.viewing.findFirst({
      where: {
        propertyId: property.id,
        scheduledAt: date,
        buyerId: { not: user.id },
        status: { in: ["REQUESTED", "CONFIRMED"] },
      },
      select: { id: true },
    });

    if (conflictingViewing) {
      throw new Error("That viewing time is already requested. Please choose another time.");
    }

    return tx.viewing.upsert({
      where: {
        propertyId_buyerId_scheduledAt: {
          propertyId: property.id,
          buyerId: user.id,
          scheduledAt: date,
        },
      },
      create: {
        propertyId: property.id,
        buyerId: user.id,
        scheduledAt: date,
        note: trimmedNote,
        status: "REQUESTED",
      },
      update: {
        note: trimmedNote,
        status: "REQUESTED",
      },
    });
  });

  await prisma.notification.create({
    data: {
      userId: property.ownerId,
      type: "viewing_request",
      content: `New viewing request for ${property.title}`,
      link: "/dashboard/messages",
    },
  });

  revalidatePath(`/properties/${property.id}`);
  revalidatePath("/dashboard/messages");

  return {
    viewingId: viewing.id,
    status: viewing.status,
    scheduledAt: viewing.scheduledAt.toISOString(),
    property: {
      id: property.id,
      title: property.title,
    },
    recipient: property.owner,
  };
}
