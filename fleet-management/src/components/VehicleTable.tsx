"use client";
import { useEffect, useState } from "react";

interface Vehicle {
  vehicle_id: number;
  vehicle_number: string;
  device_id: string;
  model: string;
  make: string;
  year: number;
  status: string;
}

export function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Added Search Query

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      console.log("Fetched Vehicles:", data);
      setVehicles(data);
    } catch (err) {
      console.error("Error Fetching Vehicles:", err);
      setError("Failed to load vehicles. Try refreshing.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter Vehicles Based on Search Query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Delete Vehicle Function
  const deleteVehicle = async (vehicle_id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const response = await fetch(`/api/vehicles/${vehicle_id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete vehicle");

      setVehicles(vehicles.filter((v) => v.vehicle_id !== vehicle_id));
    } catch (error) {
      console.error("Error Deleting Vehicle:", error);
      alert("Failed to delete vehicle.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Vehicle Number, Device ID, Model, Make, or Status"
        className="border p-2 w-full mb-6 mt-2"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Vehicle Number</th>
            <th className="border border-gray-300 p-2">Device ID</th>
            <th className="border border-gray-300 p-2">Model</th>
            <th className="border border-gray-300 p-2">Make</th>
            <th className="border border-gray-300 p-2">Year</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <tr key={vehicle.vehicle_id} className="text-center border border-gray-200">
                <td className="p-2">{vehicle.vehicle_number}</td>
                <td className="p-2">{vehicle.device_id}</td>
                <td className="p-2">{vehicle.model}</td>
                <td className="p-2">{vehicle.make}</td>
                <td className="p-2">{vehicle.year}</td>
                <td className="p-2">{vehicle.status}</td>
                <td className="p-2 space-x-2">
                  <a
                    href={`/vehicles/edit/${vehicle.vehicle_id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => deleteVehicle(vehicle.vehicle_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">No vehicles found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
