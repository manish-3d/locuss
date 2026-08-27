import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessagesClient from "./messages-client";

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id }
      ]
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          images: { take: 1 }
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <MessagesClient initialChats={chats} currentUserId={session.user.id} />
  );
}

