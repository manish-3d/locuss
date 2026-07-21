import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="mt-10 w-full max-w-5xl rounded-2xl border bg-background p-6 shadow-lg">
      <div className="grid gap-4 md:grid-cols-5">
        {/* Location */}
        <Input
          placeholder="Search city, locality..."
          className="md:col-span-2"
        />

        {/* Buy / Rent */}
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
          <option>Buy</option>
          <option>Rent</option>
        </select>

        {/* Property Type */}
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
          <option>Apartment</option>
          <option>Villa</option>
          <option>House</option>
          <option>Commercial</option>
        </select>

        {/* Search Button */}
        <Button className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
