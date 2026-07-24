import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProperty } from "../actions";

export default function PropertyForm() {
  return (
    <form className="mt-8 space-y-5" action={createProperty}>
      <Input name="title" placeholder="Property Title" required />

      <Input name="address" placeholder="Address" required />

      <div className="grid gap-5 md:grid-cols-3">
        <Input name="city" placeholder="City" required />
        <Input name="state" placeholder="State" required />
        <Input name="country" placeholder="Country" defaultValue="India" required />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <select
          name="listingType"
          defaultValue="SALE"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
        >
          <option value="SALE">Sale</option>
          <option value="RENT">Rent</option>
        </select>

        <select
          name="propertyType"
          defaultValue="APARTMENT"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
        >
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="PLOT">Plot</option>
          <option value="OFFICE">Office</option>
          <option value="SHOP">Shop</option>
        </select>
      </div>

      <Input type="number" name="price" placeholder="Price" min="1" required />

      <div className="grid gap-5 md:grid-cols-3">
        <Input type="number" name="bedrooms" placeholder="Bedrooms" min="0" required />
        <Input type="number" name="bathrooms" placeholder="Bathrooms" min="0" required />
        <Input type="number" name="area" placeholder="Area (sq ft)" min="1" step="0.01" required />
      </div>

      <Input name="image" placeholder="Image URL" type="url" required />

      <textarea
        name="description"
        placeholder="Description"
        required
        className="min-h-40 w-full rounded-md border p-3"
      />

      <Button type="submit" className="w-full">
        Create Property
      </Button>
    </form>
  );
}
