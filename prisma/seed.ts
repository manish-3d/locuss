import { PrismaClient, ListingType, PropertyType, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CITIES = [
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Greater Noida", state: "Uttar Pradesh" },
  { city: "Delhi", state: "Delhi" },
  { city: "Ghaziabad", state: "Uttar Pradesh" },
  { city: "Gurgaon", state: "Haryana" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1c2c3109a9?w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const seedEmail = "seed@locuss.local";

  // 1. Create or get the Seed User
  const owner = await prisma.user.upsert({
    where: { email: seedEmail },
    update: {},
    create: {
      name: "Seed Admin",
      email: seedEmail,
      emailVerified: true,
      role: "ADMIN",
    },
  });

  // 2. Safely clear old seeded properties to avoid duplicates
  await prisma.property.deleteMany({
    where: { ownerId: owner.id },
  });

  console.log("Deleted old seeded properties.");

  // 3. Generate 40 properties
  const propertiesData = [];
  for (let i = 1; i <= 40; i++) {
    const location = getRandomItem(CITIES);
    const listingType: ListingType = Math.random() > 0.4 ? "SALE" : "RENT";
    const propertyType: PropertyType = getRandomItem(["APARTMENT", "HOUSE", "VILLA", "PLOT", "OFFICE", "SHOP"]);
    const isCommercial = propertyType === "OFFICE" || propertyType === "SHOP";
    
    // Realistic price logic
    let priceBase = 0;
    if (listingType === "RENT") {
      priceBase = isCommercial ? getRandomInt(30000, 200000) : getRandomInt(15000, 80000);
    } else {
      priceBase = isCommercial ? getRandomInt(5000000, 50000000) : getRandomInt(3000000, 30000000);
    }

    const bedrooms = isCommercial || propertyType === "PLOT" ? 0 : getRandomInt(1, 5);
    const bathrooms = propertyType === "PLOT" ? 0 : getRandomInt(1, 4);
    const area = getRandomInt(500, 5000);
    const balconies = propertyType === "PLOT" || propertyType === "OFFICE" ? 0 : getRandomInt(0, 3);
    const parking = getRandomInt(0, 3);
    const furnished = Math.random() > 0.5;

    propertiesData.push({
      title: `Modern ${propertyType.toLowerCase()} in ${location.city}`,
      description: `A beautiful and spacious ${propertyType.toLowerCase()} available for ${listingType.toLowerCase()}. Features excellent location, modern amenities, and great neighborhood.`,
      address: `Sector ${getRandomInt(1, 150)}, ${location.city}`,
      city: location.city,
      state: location.state,
      country: "India",
      price: BigInt(priceBase),
      bedrooms,
      bathrooms,
      area,
      balconies,
      parking,
      furnished,
      listingType,
      propertyType,
      status: "PUBLISHED" as PropertyStatus,
      views: getRandomInt(0, 500),
      ownerId: owner.id,
      latitude: 28.5355 + (Math.random() - 0.5) * 0.1, // Approximate Delhi NCR coords
      longitude: 77.3910 + (Math.random() - 0.5) * 0.1,
    });
  }

  // Insert properties sequentially to handle images creation
  let createdCount = 0;
  for (const data of propertiesData) {
    const imagesToCreate = [];
    const numImages = getRandomInt(2, 4);
    for (let j = 0; j < numImages; j++) {
      imagesToCreate.push({
        url: getRandomItem(IMAGES),
        order: j,
      });
    }

    await prisma.property.create({
      data: {
        ...data,
        images: {
          create: imagesToCreate,
        },
      },
    });
    createdCount++;
  }

  console.log(`Database seeded successfully with ${createdCount} properties!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
