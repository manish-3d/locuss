"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-500 max-w-md">
        We encountered an error while loading the properties. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-xl bg-black px-6 py-2.5 font-medium text-white transition hover:bg-neutral-800"
      >
        Try again
      </button>
    </div>
  );
}
