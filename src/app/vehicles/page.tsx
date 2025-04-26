// src\app\vehicles\page.tsx
import { VehicleTable } from "@/components/VehicleTable";
import Link from "next/link";
import { withAuth } from "@/lib/withAuth"; // 🛠️ Import withAuth

export default async function VehiclesPage() {
  return withAuth(async () => (  // 🛠️ Wrap inside withAuth
    <div>
      <h2 className="text-2xl font-semibold mb-4">Vehicles Management</h2>
      <Link href="/vehicles/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        + Add Vehicle
      </Link>
      <VehicleTable />
    </div>
  ));
}
