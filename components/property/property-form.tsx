"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  propertySchema,
  type PropertySchema,
} from "@/lib/validations/property";

import { createProperty, updateProperty } from "@/app/dashboard/properties/actions";

import BasicInformation from "./basic-information";
import PropertyDetails from "./property-details";
import LocationInformation from "./location-information";
import ListingInformation from "./listing-information";
import AmenitiesSection from "./amenities-section";
import ImageUpload from "./image-upload";

export default function PropertyForm({ property }: { property?: any }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertySchema>({
    resolver: zodResolver(propertySchema) as any,

    defaultValues: {
      // Basic Information
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property ? Number(property.price) : 0,

      // Property Details
      bedrooms: property?.bedrooms ?? 0,
      bathrooms: property?.bathrooms ?? 0,
      area: property?.area ?? 0,
      balconies: property?.balconies ?? 0,
      parking: property?.parking ?? 0,
      furnished: property?.furnished ?? false,

      // Location
      address: property?.address ?? "",
      city: property?.city ?? "",
      state: property?.state ?? "",
      country: property?.country ?? "",

      latitude: property?.latitude ?? undefined,
      longitude: property?.longitude ?? undefined,

      // Listing
      listingType: property?.listingType ?? "SALE",
      propertyType: property?.propertyType ?? "APARTMENT",

      // Amenities
      amenities: [],

      // Images
      images: property?.images ? property.images.map((img: any) => img.url) : [],
    },
  });

  function onSubmit(data: PropertySchema) {
    startTransition(async () => {
      try {
        if (property) {
          await updateProperty(property.id, data);
        } else {
          await createProperty(data);
        }
        reset();
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-5xl space-y-6 sm:space-y-8"
    >
      <BasicInformation register={register} errors={errors} />

      <PropertyDetails register={register} errors={errors} />

      <LocationInformation register={register} errors={errors} setValue={setValue} watch={watch} />

      <ListingInformation watch={watch} setValue={setValue} />

      <AmenitiesSection watch={watch} setValue={setValue} />

      <ImageUpload watch={watch} setValue={setValue} />

      <div className="flex items-center justify-end gap-3 border-t border-[#e5ddd0] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#1e1b17] px-8 py-3 text-xs sm:text-sm font-medium text-white transition hover:bg-black hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
        >
          {isPending ? "Publishing listing..." : "Publish Property"}
        </button>
      </div>
    </form>
  );
}
