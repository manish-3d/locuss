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

  const imagesToCreate =
    validated.images && validated.images.length > 0
      ? validated.images.map((url, index) => ({ url, order: index }))
      : [
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            order: 0,
          },
        ];

  await prisma.property.create({
    data: {
      title: validated.title,
      description: validated.description,
      price: BigInt(validated.price),
      ownerId: session.user.id,
      address: validated.address,
      city: validated.city,
      state: validated.state,
      country: validated.country,
      area: validated.area,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms,
      balconies: validated.balconies,
      parking: validated.parking,
      furnished: validated.furnished,
      latitude: validated.latitude,
      longitude: validated.longitude,
      listingType: validated.listingType,
      propertyType: validated.propertyType,
      images: {
        createMany: {
          data: imagesToCreate,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/properties");
}

export async function updateProperty(id: string, data: PropertySchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = propertySchema.parse(data);

  const existing = await prisma.property.findUnique({
    where: { id },
  });

  if (!existing || (existing.ownerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await prisma.property.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      price: BigInt(validated.price),
      address: validated.address,
      city: validated.city,
      state: validated.state,
      country: validated.country,
      area: validated.area,
      bedrooms: validated.bedrooms,
      bathrooms: validated.bathrooms,
      balconies: validated.balconies,
      parking: validated.parking,
      furnished: validated.furnished,
      latitude: validated.latitude,
      longitude: validated.longitude,
      listingType: validated.listingType,
      propertyType: validated.propertyType,
    },
  });

  if (validated.images && validated.images.length > 0) {
    // Delete existing images and create new ones
    await prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    await prisma.propertyImage.createMany({
      data: validated.images.map((url, index) => ({
        propertyId: id,
        url,
        order: index,
      })),
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/properties");
  revalidatePath(`/dashboard/properties/${id}`);
  revalidatePath(`/properties/${id}`);
}

export async function deleteProperty(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.property.findUnique({
    where: { id },
  });

  if (!existing || (existing.ownerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await prisma.property.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

