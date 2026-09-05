import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, MapPin, ArrowUpRight } from "lucide-react";

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
    <Link
      href={`/properties/${id}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-[#e5ddd0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#b8924a]/60 hover:shadow-md motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f2ece0]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div>
          <div className="flex items-baseline justify-between gap-1.5">
            <p className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-0.5 text-[10px] text-[#7a7268] shrink-0 truncate max-w-[50%]">
              <MapPin size={10} className="shrink-0 text-[#b8924a]" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <h3 className="mt-0.5 line-clamp-1 font-serif text-xs sm:text-[13px] font-semibold text-[#1e1b17] transition-colors group-hover:text-[#b8924a]">
            {title}
          </h3>

          <div className="mt-1.5 flex items-center gap-3 border-t border-[#f2ece0] pt-1.5 text-[10px] sm:text-[11px] text-[#524b42]">
            <div className="flex items-center gap-0.5">
              <BedDouble size={11} className="text-[#b8924a]" />
              <span>{bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Bath size={11} className="text-[#b8924a]" />
              <span>{bathrooms} Baths</span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end border-t border-[#f2ece0]/80 pt-1.5 text-[9px] sm:text-[10px]">
          <span className="inline-flex items-center gap-0.5 font-medium text-[#1e1b17] group-hover:text-[#b8924a] transition-colors">
            Details
            <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
