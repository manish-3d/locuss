"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createProperty(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const image = formData.get("image")?.toString().trim();

  const price = Number(formData.get("price"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));

  if (
    !title ||
    !location ||
    !description ||
    !image ||
    Number.isNaN(price) ||
    Number.isNaN(bedrooms) ||
    Number.isNaN(bathrooms)
  ) {
    throw new Error("Invalid form data.");
  }

  await prisma.property.create({
    data: {
      title,
      location,
      description,
      image,
      price,
      bedrooms,
      bathrooms,
    },
  });

  revalidatePath("/");
  redirect("/");
}
