"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { PropertySchema } from "@/lib/validations/property";

type ImageUploadProps = {
  watch: UseFormWatch<PropertySchema>;
  setValue: UseFormSetValue<PropertySchema>;
};

export default function ImageUpload({ watch, setValue }: ImageUploadProps) {
  const images = watch("images") || [];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      const data: { urls: string[] } = await res.json();
      setValue("images", [...images, ...data.urls]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Property Images</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload photos of your property. Multiple images are supported.
        </p>
      </div>

      {/* Drop Zone / Upload Button */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 transition cursor-pointer select-none ${
          isUploading
            ? "border-blue-300 bg-blue-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/40"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-sm font-medium text-blue-600">Uploading images…</p>
          </>
        ) : (
          <>
            <ImagePlus size={36} className="text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                Click to upload images
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, WEBP up to 10MB each. Multiple files allowed.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Upload error */}
      {uploadError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
          {uploadError}
        </p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3 border-t pt-6">
          <p className="text-xs font-semibold uppercase text-gray-400">
            Uploaded Images ({images.length})
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={url + index}
                className="group relative h-32 overflow-hidden rounded-xl border shadow-sm"
              >
                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                    Cover
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Property image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
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
