import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Settings, Shield, Trash2, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  // Handle Account Deletion
  async function deleteAccount() {
    "use server";
    const s = await auth.api.getSession({
      headers: await headers(),
    });

    if (s?.user.id) {
      await prisma.user.delete({
        where: { id: s.user.id },
      });
      redirect("/sign-in");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile/Account Security */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Security & Access</h2>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-gray-800">Email Address</p>
                <p className="text-gray-500">{session.user.email}</p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Verified
              </span>
            </div>

            <div className="flex justify-between items-center text-sm pt-4 border-t">
              <div>
                <p className="font-medium text-gray-800">Current Role</p>
                <p className="text-gray-500">Your account level on Locus</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase">
                {session.user.role || "BUYER"}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Preferences */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <Bell className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts for new messages and inquiries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-gray-800">Marketing Updates</p>
                <p className="text-xs text-gray-500">Stay informed about new products and feature updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <div className="flex items-center gap-3 border-b border-red-100 pb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">Danger Zone</h2>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-red-800">Delete Account</p>
              <p className="text-xs text-red-600">
                Permanently delete your account and all associated properties. This cannot be undone.
              </p>
            </div>

            <form action={deleteAccount}>
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
