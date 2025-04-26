// src/app/reports/page.tsx
import { withAuth } from "@/lib/withAuth";

export default async function ReportsPage() {
  return withAuth(async () => (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Driver Performance</h2>
          {/* Map list of drivers with trip and event counts */}
        </div>

        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Vehicle Performance</h2>
          {/* Map list of vehicles with trip counts */}
        </div>

        <div className="border p-4 rounded shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-2">Events Summary</h2>
          {/* Show total Sleep/Yawn/Brake/Turn event counts */}
        </div>
      </div>
    </div>
  ));
}
