import { z } from "zod";

export const propertySchema = z.object({
  // Basic Information
  title: z.string().min(5, "Title must be at least 5 characters").max(100),

  description: z.string().min(30, "Description must be at least 30 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  // Property Details
  bedrooms: z.coerce.number().int().min(0),

  bathrooms: z.coerce.number().int().min(0),

  area: z.coerce.number().positive(),

  balconies: z.coerce.number().int().min(0).optional(),

  parking: z.coerce.number().int().min(0).optional(),

  furnished: z.boolean(),

  // Location
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),

  latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional(),

  // Listing
  listingType: z.enum(["SALE", "RENT"]),

  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "VILLA",
    "PLOT",
    "OFFICE",
    "SHOP",
  ]),

  // Amenities
  amenities: z.array(z.string()).default([]),

  // Images
  images: z.array(z.string()).default([]),
});

export type PropertySchema = z.infer<typeof propertySchema>;
