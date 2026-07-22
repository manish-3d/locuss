import PropertyForm from "@/features/dashboard/components/property-form";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <PropertyForm />
    </main>
  );
}
