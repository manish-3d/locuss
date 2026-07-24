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

  // Fetch received inquiries (where user is the owner of the property)
  const receivedInquiries = await prisma.inquiry.findMany({
    where: {
      property: {
        ownerId: session.user.id,
      },
    },
    include: {
      buyer: {
        select: {
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch sent inquiries (where user is the buyer)
  const sentInquiries = await prisma.inquiry.findMany({
    where: {
      buyerId: session.user.id,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <MessagesClient
      receivedInquiries={receivedInquiries}
      sentInquiries={sentInquiries}
    />
  );
}

