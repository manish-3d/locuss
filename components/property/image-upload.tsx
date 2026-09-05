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
    <section className="rounded-2xl border border-[#e5ddd0] bg-white p-6 sm:p-8 shadow-xs space-y-5">
      <div className="border-b border-[#f2ece0] pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1e1b17]">
          Gallery & Visual Assets
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#7a7268]">
          Upload high-resolution photography. The first uploaded image will serve as the listing cover.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 sm:py-12 transition cursor-pointer select-none ${
          isUploading
            ? "border-[#b8924a] bg-[#faf7f2] cursor-not-allowed"
            : "border-[#e5ddd0] bg-[#faf7f2]/50 hover:border-[#b8924a] hover:bg-[#b8924a]/5"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 size={32} className="animate-spin text-[#b8924a]" />
            <p className="text-xs sm:text-sm font-medium text-[#1e1b17]">Uploading photography…</p>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#e5ddd0] text-[#b8924a] shadow-xs">
              <ImagePlus size={24} />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-[#1e1b17]">
                Click or drag photos to upload
              </p>
              <p className="mt-1 text-[11px] text-[#7a7268]">
                PNG, JPG, or WEBP up to 10MB each. High-definition images recommended.
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {uploadError && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs text-red-600 border border-red-200">
          {uploadError}
        </p>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3 border-t border-[#f2ece0] pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
            Attached Photos ({images.length})
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={url + index}
                className="group relative h-28 sm:h-32 overflow-hidden rounded-xl border border-[#e5ddd0] shadow-xs bg-[#f2ece0]"
              >
                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-[#1e1b17]/85 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider">
                    Primary Cover
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute right-2 top-2 rounded-lg bg-red-600/90 backdrop-blur-xs p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-700"
                  aria-label="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
