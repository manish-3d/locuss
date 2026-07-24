"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await authClient.signOut();

    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button onClick={logout} variant="destructive">
      Logout
    </Button>
  );
}
