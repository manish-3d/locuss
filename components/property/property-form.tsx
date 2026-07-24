"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  propertySchema,
  type PropertySchema,
} from "@/lib/validations/property";

import { createProperty } from "@/app/dashboard/properties/actions";

import BasicInformation from "./basic-information";
import PropertyDetails from "./property-details";
import LocationInformation from "./location-information";
import ListingInformation from "./listing-information";
import AmenitiesSection from "./amenities-section";
import ImageUpload from "./image-upload";

export default function PropertyForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertySchema>({
    resolver: zodResolver(propertySchema),

    defaultValues: {
      // Basic Information
      title: "",
      description: "",
      price: 0,

      // Property Details
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      balconies: 0,
      parking: 0,
      furnished: false,

      // Location
      address: "",
      city: "",
      state: "",
      country: "",

      latitude: undefined,
      longitude: undefined,

      // Listing
      listingType: "SALE",
      propertyType: "APARTMENT",

      // Amenities
      amenities: [],
    },
  });

  function onSubmit(data: PropertySchema) {
    startTransition(async () => {
      try {
        await createProperty(data);
        reset();
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-6xl space-y-8"
    >
      <BasicInformation register={register} errors={errors} />

      <PropertyDetails register={register} errors={errors} />

      <LocationInformation register={register} errors={errors} />

      <ListingInformation watch={watch} setValue={setValue} />

      <AmenitiesSection watch={watch} setValue={setValue} />

      <ImageUpload />

      <div className="flex justify-end gap-4 border-t border-gray-200 pt-8">
        <button
          type="button"
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium transition hover:bg-gray-100"
        >
          Save Draft
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Publishing..." : "Publish Property"}
        </button>
      </div>
    </form>
  );
}
