import { prisma } from "@/lib/prisma";

export async function getFeaturedProperties() {
  return prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
}

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({
    where: {
      id,
    },
  });
}
