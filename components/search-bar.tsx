import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="mt-12 w-full max-w-6xl rounded-2xl border bg-background p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5">
        {/* Location */}

        <Input
          placeholder="Search city, locality..."
          className="md:col-span-2"
        />

        {/* Buy / Rent */}

        <select className="h-10 rounded-md border bg-background px-3 text-sm">
          <option>Buy</option>
          <option>Rent</option>
        </select>

        {/* Property */}

        <select className="h-10 rounded-md border bg-background px-3 text-sm">
          <option>Apartment</option>
          <option>Villa</option>
          <option>House</option>
          <option>Commercial</option>
        </select>

        {/* Button */}

        <Button className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
