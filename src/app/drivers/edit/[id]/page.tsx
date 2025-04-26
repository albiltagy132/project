// src\app\drivers\edit\[id]\page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditDriverPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    id_number: "",
    phone_number: "",
    email: "",
    image: null as File | null,
    image_url: "",
  });

  useEffect(() => {
    if (!driverId) return;
  
    fetch(`/api/drivers/${driverId}`)
      .then(async (res) => {
        const text = await res.text();
        console.log("Raw Response from API:", text); // Debugging
  
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${text}`);
        }
  
        return JSON.parse(text); // Prevents JSON parsing error
      })
      .then((data) => {
        setForm({ ...data, image: null });
      })
      .catch((error) => console.error("Error fetching driver:", error));
  }, [driverId]);
  

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("id_number", form.id_number);
    formData.append("phone_number", form.phone_number);
    formData.append("email", form.email);

    if (form.image) {
      formData.append("image", form.image);
    }

    await fetch(`/api/drivers/${driverId}`, {
      method: "PUT",
      body: formData,
    });

    router.push("/drivers");
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edit Driver</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={form.first_name} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <input type="text" value={form.last_name} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input type="text" value={form.id_number} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, id_number: e.target.value })} />
        <input type="text" value={form.phone_number} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        <input type="email" value={form.email} required className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="file" accept="image/*" className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Update Driver
        </button>
      </form>
    </div>
  );
}
