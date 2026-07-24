import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: {
      email: "demo-owner@locuss.local",
    },
    update: {},
    create: {
      name: "Demo Owner",
      email: "demo-owner@locuss.local",
      emailVerified: true,
      role: "SELLER",
    },
  });

  await prisma.property.create({
    data: {
      title: "Modern Apartment",
      description: "Beautiful apartment in the city center.",
      address: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      price: 8500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1250,
      listingType: "SALE",
      propertyType: "APARTMENT",
      ownerId: owner.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
          order: 0,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      title: "Luxury Villa",
      description: "Luxury villa with swimming pool.",
      address: "Sector 44",
      city: "Noida",
      state: "Uttar Pradesh",
      country: "India",
      price: 12000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      listingType: "SALE",
      propertyType: "VILLA",
      ownerId: owner.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          order: 0,
        },
      },
    },
  });

  await prisma.property.create({
    data: {
      title: "Family Home",
      description: "Comfortable family home.",
      address: "Golf Course Road",
      city: "Gurgaon",
      state: "Haryana",
      country: "India",
      price: 6500000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      listingType: "SALE",
      propertyType: "HOUSE",
      ownerId: owner.id,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
          order: 0,
        },
      },
    },
  });

  console.log("Database seeded!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
