"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="text-sm font-medium text-[#7a7268] transition-colors duration-200 hover:text-[#1e1b17] px-3 py-1.5 rounded-full hover:bg-[#f2ece0]/60"
    >
      Logout
    </button>
  );
}
