// src\app\vehicles\add\page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVehiclePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    vehicle_number: "",
    device_id: "",
    model: "",
    make: "",
    year: "",
    status: "Active",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    const requestData = {
      ...form,
      year: Number(form.year), //Convert to a number
    };
  
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const text = await response.text(); //Read raw response before parsing
    console.log("Raw Response from API:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Error Parsing JSON:", error);
      alert("Unexpected server response.");
      return;
    }

    console.log("Parsed Response:", data);

    if (response.ok) {
      router.refresh();
      router.push("/vehicles");
    } else {
      alert("Error: " + (data.error || "Unknown error"));
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Vehicle Number" required
          className="border p-2 w-full" onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })} />
        <input type="text" placeholder="Device ID" required
          className="border p-2 w-full" onChange={(e) => setForm({ ...form, device_id: e.target.value })} />
        <input type="text" placeholder="Model" required
          className="border p-2 w-full" onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <input type="text" placeholder="Make" required
          className="border p-2 w-full" onChange={(e) => setForm({ ...form, make: e.target.value })} />
        <input type="number" placeholder="Year" required
          className="border p-2 w-full" onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <select className="border p-2 w-full" onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
