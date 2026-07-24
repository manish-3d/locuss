import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SellPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">Sell With Locus</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Create and manage property listings from your dashboard.
      </p>

      <div className="mt-8">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
