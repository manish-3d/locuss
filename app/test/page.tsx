import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const properties = await prisma.property.findMany();

  return (
    <main className="space-y-6 p-10">
      {properties.map((property) => (
        <div key={property.id} className="rounded-lg border p-4">
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <p>{property.address}</p>

          <p>₹{property.price.toLocaleString()}</p>
        </div>
      ))}
    </main>
  );
}
