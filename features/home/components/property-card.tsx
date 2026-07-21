import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type PropertyCardProps = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
};

export default function PropertyCard({
  id,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  image,
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-60 w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>

            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary">
            ₹{price.toLocaleString("en-IN")}
          </h2>

          <div className="flex gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <BedDouble size={18} />
              <span>{bedrooms} Beds</span>
            </div>

            <div className="flex items-center gap-2">
              <Bath size={18} />
              <span>{bathrooms} Baths</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
