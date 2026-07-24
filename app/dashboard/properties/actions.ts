"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema, PropertySchema } from "@/lib/validations/property";

export async function createProperty(data: PropertySchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = propertySchema.parse(data);

  await prisma.property.create({
    data: {
      title: validated.title,
      description: validated.description,
      price: BigInt(validated.price),

      ownerId: session.user.id,

      address: "",
      city: "",
      state: "",
      country: "",

      area: 0,

      bedrooms: 0,

      bathrooms: 0,

      listingType: "SALE",

      propertyType: "APARTMENT",
    },
  });

  revalidatePath("/dashboard");
}
