import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function requireBrokerUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Please sign in to use this broker action.");
  }

  return session.user;
}

export async function getBrokerUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

