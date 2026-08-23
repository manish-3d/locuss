"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (city.trim()) {
      params.set("city", city);
    } else {
      params.delete("city");
    }

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="mt-8 flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search by city..."
          className="w-full rounded-xl border px-12 py-3 outline-none transition focus:border-black"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-black px-8 text-white transition hover:bg-neutral-800"
      >
        Search
      </button>
    </form>
  );
}
