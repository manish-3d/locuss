import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f2]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 pt-18 lg:pt-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
