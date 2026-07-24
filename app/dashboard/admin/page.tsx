import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./admin-client";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect the admin panel
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users and properties
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const properties = await prisma.property.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminClient users={users} properties={properties} />;
}
