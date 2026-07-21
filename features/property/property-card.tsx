import Image from "next/image";
import { BedDouble, Bath, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type PropertyCardProps = {
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
};

export default function PropertyCard({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  image,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition hover:shadow-lg">
      <div className="relative h-56 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>

          <p className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} />
            {location}
          </p>
        </div>

        <p className="text-2xl font-bold text-primary">{price}</p>

        <div className="flex gap-6 text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble size={18} />
            {bedrooms}
          </span>

          <span className="flex items-center gap-1">
            <Bath size={18} />
            {bathrooms}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
