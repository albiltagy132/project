import Link from "next/link";
import { ReactNode } from "react";
import { cookies } from "next/headers";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const cookieStore = await cookies(); // 🛠️ await here
  const token = cookieStore.get("token")?.value;

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies(); // 🛠️ await here
    await cookieStore.set("token", "", { path: "/", expires: new Date(0) });
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold">Fleet Management</h1>
          <ul className="flex space-x-6 items-center">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/vehicles" className="hover:underline">Vehicles</Link></li>
            <li><Link href="/drivers" className="hover:underline">Drivers</Link></li>
            <li><Link href="/assign" className="hover:underline">Assign</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/reports" className="hover:underline">Reports</Link></li>
            {token && (
              <form action={handleLogout}>
                <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                  Logout
                </button>
              </form>
            )}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
