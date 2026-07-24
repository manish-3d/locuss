"use client";

import { ImagePlus } from "lucide-react";

export default function ImageUpload() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Property Images</h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload high-quality photos of your property.
        </p>
      </div>

      <label
        className="
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-2xl
        border-2
        border-dashed
        border-gray-300
        py-20
        transition
        hover:border-black
        "
      >
        <ImagePlus className="mb-5" size={48} />

        <h3 className="text-lg font-medium">Drag & Drop Images</h3>

        <p className="mt-2 text-sm text-gray-500">or click to browse</p>

        <p className="mt-6 text-xs text-gray-400">PNG • JPG • WEBP</p>

        <input type="file" multiple className="hidden" />
      </label>
    </section>
  );
}
