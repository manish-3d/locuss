import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Phone, Mail, Award } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  // Handle profile update
  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name")?.toString();
    const phone = formData.get("phone")?.toString();

    if (!name) return;

    const s = await auth.api.getSession({
      headers: await headers(),
    });

    if (s?.user.id) {
      await prisma.user.update({
        where: { id: s.user.id },
        data: { name, phone },
      });
      revalidatePath("/dashboard/profile");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your personal information and contact details.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* User Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <User className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-xl font-bold">{session.user.name}</h2>
          <p className="text-sm text-gray-500">{session.user.email}</p>

          <div className="mt-6 w-full space-y-3 border-t pt-6 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Award className="h-4 w-4 text-gray-400" />
              <span>Role: <strong className="text-gray-800">{session.user.role || "BUYER"}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="line-clamp-1">{session.user.email}</span>
            </div>
            {session.user.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{session.user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold border-b pb-4">Edit Profile</h3>

          <form action={updateProfile} className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={session.user.name}
                required
                className="mt-2 block w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={session.user.phone || ""}
                placeholder="Enter your phone number"
                className="mt-2 block w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
