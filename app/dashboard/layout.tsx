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

      <main className="min-w-0 flex-1 overflow-y-auto px-3 py-4 pt-18 sm:px-8 sm:py-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
