import Link from "next/link";
import { Property } from "@prisma/client";
import { MapPin, BedDouble, Bath, Square, Pencil, Trash2 } from "lucide-react";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/dashboard/properties/${property.id}`}>
        <div className="relative">
          {property.image ? (
            <img
              src={property.image}
              alt={property.title}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}

          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium shadow">
            {property.status}
          </span>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <h2 className="line-clamp-1 text-2xl font-bold">
              {property.title}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} />
              {property.city}, {property.state}
            </div>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-gray-600">
            {property.description}
          </p>

          <div className="text-3xl font-bold">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-xl border bg-gray-50 p-4">
            <div className="text-center">
              <BedDouble className="mx-auto mb-2 h-5 w-5" />
              <p className="text-lg font-semibold">{property.bedrooms}</p>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>

            <div className="text-center">
              <Bath className="mx-auto mb-2 h-5 w-5" />
              <p className="text-lg font-semibold">{property.bathrooms}</p>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>

            <div className="text-center">
              <Square className="mx-auto mb-2 h-5 w-5" />
              <p className="text-lg font-semibold">{property.area}</p>
              <p className="text-xs text-gray-500">Sq Ft</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-3 border-t p-5">
        <Link
          href={`/dashboard/properties/${property.id}/edit`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium transition hover:bg-gray-100"
        >
          <Pencil size={18} />
          Edit
        </Link>

        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-3 font-medium text-white transition hover:bg-neutral-800">
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
