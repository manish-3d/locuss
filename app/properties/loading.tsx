import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-gray-500">
      <Loader2 className="h-10 w-10 animate-spin text-black" />
      <p className="text-lg font-medium">Loading properties...</p>
    </div>
  );
}
