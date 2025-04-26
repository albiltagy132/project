// src\app\vehicles\edit\[id]\page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams(); //Ensure params is awaited
  const vehicleId = params.id as string; //convert param to string

  const [form, setForm] = useState({
    vehicle_number: "",
    device_id: "",
    model: "",
    make: "",
    year: "",
    status: "Active",
  });

  useEffect(() => {
    if (!vehicleId) return; //Ensure vehicleId exists before fetching

    fetch(`/api/vehicles/${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Vehicle for Edit:", data);
        setForm(data);
      })
      .catch((error) => console.error("Error fetching vehicle:", error));
  }, [vehicleId]); //Depend on `vehicleId` instead of `params.id`

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await fetch(`/api/vehicles/${vehicleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: Number(form.year), //Ensure year is a number
      }),
    });

    router.push("/vehicles");
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edit Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={form.vehicle_number} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })} />
        <input type="text" value={form.device_id} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, device_id: e.target.value })} />
        <input type="text" value={form.model} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <input type="text" value={form.make} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, make: e.target.value })} />
        <input type="number" value={form.year} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <select value={form.status} className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Update Vehicle
        </button>
      </form>
    </div>
  );
}
