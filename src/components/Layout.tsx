// src\components\Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold">Fleet Management</h1>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/vehicles" className="hover:underline">Vehicles</Link></li>
            <li><Link href="/drivers" className="hover:underline">Drivers</Link></li>
            <li><Link href="/assign" className="hover:underline">Assign</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/reports" className="hover:underline">Reports</Link></li>
          </ul>
        </nav>
      </header>

      {/* Page Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
