import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProperty } from "../actions";
export default function PropertyForm() {
  return (
    <form className="mt-8 space-y-5" action={createProperty}>
      <Input name="title" placeholder="Property Title" />

      <Input name="location" placeholder="Location" />

      <Input type="number" name="price" placeholder="Price" />

      <Input type="number" name="bedrooms" placeholder="Bedrooms" />

      <Input type="number" name="bathrooms" placeholder="Bathrooms" />

      <Input name="image" placeholder="Image URL" />

      <textarea
        name="description"
        placeholder="Description"
        className="min-h-40 w-full rounded-md border p-3"
      />

      <button type="submit" className="w-full rounded bg-black p-3 text-white">
        Create Property
      </button>
    </form>
  );
}
