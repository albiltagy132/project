// src\app\drivers\page.tsx
import { DriverTable } from "@/components/DriverTable";
import Link from "next/link";

export default function DriversPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Drivers Management</h2>
      <Link href="/drivers/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        + Add Driver
      </Link>
      <DriverTable />
    </div>
  );
}
