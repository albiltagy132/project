// src/app/page.tsx
import { redirect } from "next/navigation";
import { getTokenFromCookies } from "@/lib/auth";

export default async function Home() {
  const token = await getTokenFromCookies(); // 🛠️ force reading cookie

  if (!token) {
    redirect("/login"); // 🚀 Force redirect if not logged in
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-4">Welcome to Fleet Management</h2>
      <p className="text-gray-600">Manage drivers, vehicles, and track trips efficiently.</p>

      <div className="mt-8 space-x-4">
        <a href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700">
          Go to Dashboard
        </a>
        <a href="/reports" className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800">
          View Reports
        </a>
      </div>
    </div>
  );
}
