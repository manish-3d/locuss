import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.property.createMany({
    data: [
      {
        title: "Modern Apartment",
        description: "Beautiful apartment in the city center.",
        location: "New Delhi",
        price: 8500000,
        bedrooms: 3,
        bathrooms: 2,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      },
      {
        title: "Luxury Villa",
        description: "Luxury villa with swimming pool.",
        location: "Noida",
        price: 12000000,
        bedrooms: 4,
        bathrooms: 3,
        image:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      },
      {
        title: "Family Home",
        description: "Comfortable family home.",
        location: "Gurgaon",
        price: 6500000,
        bedrooms: 2,
        bathrooms: 2,
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      },
    ],
  });

  console.log("✅ Database seeded!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
