"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ListingType, PropertyType, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const listingTypes = Object.values(ListingType);
const propertyTypes = Object.values(PropertyType);

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name)?.toString().trim();

  if (!value) {
    throw new Error("Invalid form data.");
  }

  return value;
}

function getRequiredNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));

  if (!Number.isFinite(value)) {
    throw new Error("Invalid form data.");
  }

  return value;
}

function getRequiredInteger(formData: FormData, name: string) {
  const value = getRequiredNumber(formData, name);

  if (!Number.isInteger(value)) {
    throw new Error("Invalid form data.");
  }

  return value;
}

async function getOwnerId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id) {
    return session.user.id;
  }

  const demoOwner = await prisma.user.upsert({
    where: {
      email: "demo-owner@locuss.local",
    },
    update: {},
    create: {
      name: "Demo Owner",
      email: "demo-owner@locuss.local",
      emailVerified: true,
      role: UserRole.SELLER,
    },
  });

  return demoOwner.id;
}

export async function createProperty(formData: FormData) {
  const title = getRequiredString(formData, "title");
  const address = getRequiredString(formData, "address");
  const city = getRequiredString(formData, "city");
  const state = getRequiredString(formData, "state");
  const country = getRequiredString(formData, "country");
  const description = getRequiredString(formData, "description");
  const image = getRequiredString(formData, "image");
  const listingType = getRequiredString(formData, "listingType");
  const propertyType = getRequiredString(formData, "propertyType");

  const price = getRequiredInteger(formData, "price");
  const bedrooms = getRequiredInteger(formData, "bedrooms");
  const bathrooms = getRequiredInteger(formData, "bathrooms");
  const area = getRequiredNumber(formData, "area");

  if (
    price <= 0 ||
    bedrooms < 0 ||
    bathrooms < 0 ||
    area <= 0 ||
    !listingTypes.includes(listingType as ListingType) ||
    !propertyTypes.includes(propertyType as PropertyType)
  ) {
    throw new Error("Invalid form data.");
  }

  const ownerId = await getOwnerId();

  await prisma.property.create({
    data: {
      title,
      address,
      city,
      state,
      country,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      listingType: listingType as ListingType,
      propertyType: propertyType as PropertyType,
      ownerId,
      images: {
        create: {
          url: image,
          order: 0,
        },
      },
    },
  });

  revalidatePath("/");
  redirect("/");
}
