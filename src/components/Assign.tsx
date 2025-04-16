"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


interface Driver {
  driver_id: number;
  first_name: string;
  last_name: string;
  image_url: string;
}

interface Vehicle {
  vehicle_id: number;
  vehicle_number: string;
  model: string;
}

interface Assignment {
  assignment_id: number;
  driver: Driver;
  vehicle: Vehicle;
  assigned_at: string;
  shift: "MORNING" | "NIGHT";
  weekday: string;
}

export function Assign() {
  const [selectedWeekday, setSelectedWeekday] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number | "">("");
  const [selectedVehicle, setSelectedVehicle] = useState<number | "">("");
  const [selectedShift, setSelectedShift] = useState<"MORNING" | "NIGHT">("MORNING");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Added Search Query

  useEffect(() => {
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((data: Driver[]) => setDrivers(data));

    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data: Vehicle[]) => setVehicles(data));

    fetch("/api/assignments")
      .then((res) => res.json())
      .then((data: Assignment[]) => setAssignments(data));
  }, []);

  async function handleAssign() {
    if (!selectedDriver || !selectedVehicle || !selectedWeekday) {
      alert("Please select a driver, vehicle, shift, and weekday.");
      return;
    }
  
    const response = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driver_id: selectedDriver,
        vehicle_id: selectedVehicle,
        shift: selectedShift,
        weekday: selectedWeekday,
      }),
    });
  
    if (response.ok) {
      alert("Driver assigned successfully!");
      const newAssignment = await response.json();
      setAssignments([...assignments, newAssignment]);
    } else {
      const err = await response.json();
      alert(err?.error || "Error assigning driver.");
    }
  }
  

  async function handleUnassign(assignment_id: number) {
    if (!confirm("Are you sure you want to unassign this driver?")) return;

    await fetch(`/api/assignments/${assignment_id}`, { method: "DELETE" });
    setAssignments(assignments.filter((a) => a.assignment_id !== assignment_id));
  }

  // Filter Assignments Based on Search Query
  const filteredAssignments = assignments.filter((a) =>
    a.driver.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.driver.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.vehicle.vehicle_number.includes(searchQuery) ||
    a.shift.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Assign Driver to Vehicle</h2>

      <div className="flex space-x-4">
        <select className="border p-2 w-full" onChange={(e) => setSelectedDriver(Number(e.target.value))}>
          <option value="">Select Driver</option>
          {drivers.map((driver) => (
            <option key={driver.driver_id} value={driver.driver_id}>
              {driver.first_name} {driver.last_name}
            </option>
          ))}
        </select>

        <select className="border p-2 w-full" onChange={(e) => setSelectedVehicle(Number(e.target.value))}>
          <option value="">Select Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
              {vehicle.vehicle_number} - {vehicle.model}
            </option>
          ))}
        </select>

        <select className="border p-2 w-full" onChange={(e) => setSelectedShift(e.target.value as "MORNING" | "NIGHT")}>
          <option value="MORNING">Morning Shift (9 AM - 5 PM)</option>
          <option value="NIGHT">Night Shift (5 PM - 1 AM)</option>
        </select>

        <select className="border p-2 w-full" onChange={(e) => setSelectedWeekday(e.target.value)}>
          <option value="">Select Day</option>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700" onClick={handleAssign}>
          Assign
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Driver Name, Vehicle Number, or Shift"
        className="border p-2 w-full mb-6 mt-2"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h3 className="text-xl font-semibold mt-6">Current Assignments</h3>
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Driver</th>
            <th className="border border-gray-300 p-2">Vehicle</th>
            <th className="border border-gray-300 p-2">Shift</th>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">Assigned At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((a) => (
            <tr key={a.assignment_id} className="text-center border border-gray-200">
              <td className="p-2 flex items-center space-x-3">
                <Image src={a.driver.image_url} alt="Driver" className="w-20 h-20 border border-gray-300 shadow-md object-cover" />
                <span>{a.driver.first_name} {a.driver.last_name}</span>
              </td>
              <td className="p-2">{a.vehicle.vehicle_number} - {a.vehicle.model}</td>
              <td className="p-2">{a.shift}</td>
              <td className="p-2">{a.weekday}</td>
              <td className="p-2">{new Date(a.assigned_at).toLocaleString()}</td>
              <td className="p-2">
                <button
                  onClick={() => handleUnassign(a.assignment_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Unassign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
