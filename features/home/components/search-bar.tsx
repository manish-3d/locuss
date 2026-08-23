"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [listingType, setListingType] = useState(searchParams.get("listingType") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (city.trim()) {
      params.set("city", city.trim());
    } else {
      params.delete("city");
    }

    if (listingType) {
      params.set("listingType", listingType);
    } else {
      params.delete("listingType");
    }

    if (propertyType) {
      params.set("propertyType", propertyType);
    } else {
      params.delete("propertyType");
    }

    // Reset pagination when performing a new search from the homepage
    params.delete("page");

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mt-10 w-full max-w-5xl rounded-2xl border bg-background p-6 shadow-lg">
      <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-5">
        {/* Location */}
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city, locality..."
          className="md:col-span-2"
        />

        {/* Buy / Rent */}
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none"
        >
          <option value="">Any Intent</option>
          <option value="SALE">Buy</option>
          <option value="RENT">Rent</option>
        </select>

        {/* Property Type */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none"
        >
          <option value="">Any Type</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="PLOT">Plot</option>
          <option value="OFFICE">Office</option>
          <option value="SHOP">Shop</option>
        </select>

        {/* Search Button */}
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
    </div>
  );
}
