import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/property/property-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    notFound();
  }

  // Ensure only owner or admin can edit
  if (property.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/properties");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Edit Property</h1>
        <p className="mt-2 text-gray-500">
          Modify the details of your property listing below.
        </p>
      </div>

      <PropertyForm property={property} />
    </div>
  );
}
