"use client";

import { useState } from "react";
import { ImagePlus, Trash2, Plus } from "lucide-react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { PropertySchema } from "@/lib/validations/property";

type ImageUploadProps = {
  watch: UseFormWatch<PropertySchema>;
  setValue: UseFormSetValue<PropertySchema>;
};

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
];

export default function ImageUpload({ watch, setValue }: ImageUploadProps) {
  const images = watch("images") || [];
  const [newUrl, setNewUrl] = useState("");

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    setValue("images", [...images, newUrl.trim()]);
    setNewUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  const handleSelectSample = (url: string) => {
    if (!images.includes(url)) {
      setValue("images", [...images, url]);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Property Images</h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide photo URLs or choose sample photos for your property.
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-3">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
          className="flex-1 rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      {/* Sample Image Picker */}
      <div>
        <p className="text-xs font-semibold uppercase text-gray-400 mb-3">Quick Sample Photos</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLE_IMAGES.map((sampleUrl, i) => (
            <div
              key={i}
              onClick={() => handleSelectSample(sampleUrl)}
              className={`group relative h-24 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                images.includes(sampleUrl) ? "border-blue-600 ring-2 ring-blue-600/30" : "border-transparent hover:border-gray-300"
              }`}
            >
              <img src={sampleUrl} alt="Sample" className="h-full w-full object-cover transition group-hover:scale-105" />
              {images.includes(sampleUrl) && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40 text-xs font-bold text-white">
                  Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="space-y-3 border-t pt-6">
          <p className="text-xs font-semibold uppercase text-gray-400">Selected Images ({images.length})</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div key={index} className="group relative h-32 overflow-hidden rounded-xl border shadow-sm">
                <img src={url} alt={`Property ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
