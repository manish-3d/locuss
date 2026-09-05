"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/interactions";

type FavoriteButtonProps = {
  propertyId: string;
  initialFavorited?: boolean;
};

export default function FavoriteButton({
  propertyId,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const next = !isFavorited;
    setIsFavorited(next);

    startTransition(async () => {
      try {
        await toggleFavorite(propertyId);
      } catch (err) {
        setIsFavorited(!next);
        console.error("Failed to toggle favorite:", err);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={isPending}
      aria-label={isFavorited ? "Remove favorite" : "Add favorite"}
      className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-xs transition-all duration-200 ${
        isFavorited
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-white/85 text-[#1e1b17] hover:bg-white hover:text-red-500 hover:scale-105"
      }`}
    >
      <Heart
        size={13}
        className={`transition-transform duration-200 ${
          isFavorited ? "fill-red-600 scale-110" : ""
        }`}
      />
    </button>
  );
}
