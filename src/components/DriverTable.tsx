// src\components\DriverTable.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";


interface Driver {
  driver_id: number;
  first_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  email: string;
  image_url: string;
}

export function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Added Search Query

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      console.log("Fetched Drivers:", data);
      setDrivers(data);
    } catch (err) {
      console.error("Error Fetching Drivers:", err);
      setError("Failed to load drivers. Try refreshing.");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter Drivers Based on Search Query
  const filteredDrivers = drivers.filter((driver) =>
    driver.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.id_number.includes(searchQuery) ||
    driver.phone_number.includes(searchQuery) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Delete Driver Function
  const deleteDriver = async (driver_id: number) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
  
    try {
      const response = await fetch(`/api/drivers/${driver_id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete driver");
  
      setDrivers(drivers.filter((d) => d.driver_id !== driver_id));
    } catch (error) {
      console.error("Error Deleting Driver:", error);
      alert("Failed to delete driver.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name, ID Number, Phone, or Email"
        className="border p-2 w-full mb-6 mt-2"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">ID Number</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <tr key={driver.driver_id} className="text-center border border-gray-200">
                <td className="p-2 text-center">
                  <div className="flex justify-center">
                    <Image src={driver.image_url} alt="Driver" width={80} height={80} className="rounded-lg border border-gray-300 shadow-md object-cover" />
                  </div>
                </td>
                <td className="p-2">{driver.first_name}</td>
                <td className="p-2">{driver.last_name}</td>
                <td className="p-2">{driver.id_number}</td>
                <td className="p-2">{driver.phone_number}</td>
                <td className="p-2">{driver.email}</td>
                <td className="p-2 space-x-2">
                  <a
                    href={`/drivers/edit/${driver.driver_id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => deleteDriver(driver.driver_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">No drivers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
