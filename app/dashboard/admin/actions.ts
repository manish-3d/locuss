"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// Ensure the logged in user is actually an ADMIN
async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function updateUserRole(userId: string, role: string) {
  await verifyAdmin();

  if (!Object.values(UserRole).includes(role as UserRole)) {
    throw new Error("Invalid role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as UserRole },
  });

  revalidatePath("/dashboard/admin");
}

export async function deleteUser(userId: string) {
  await verifyAdmin();

  // Prevent admin from deleting themselves
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id === userId) {
    throw new Error("Cannot delete your own admin account");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/admin");
}
