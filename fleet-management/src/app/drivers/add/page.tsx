"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDriverPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    id_number: "", 
    phone_number: "",
    email: "",
    image: null as File | null,
  });

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

    const response = await fetch("/api/drivers", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      router.push("/drivers");
    } else {
      alert("Error adding driver.");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add Driver</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="First Name" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input type="text" placeholder="Last Name" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <input type="text" placeholder="ID Number" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, id_number: e.target.value })} //Changed
        />
        <input type="text" placeholder="Phone Number" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
        />
        <input type="email" placeholder="Email" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input type="file" accept="image/*" required
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Add Driver
        </button>
      </form>
    </div>
  );
}
