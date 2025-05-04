import { useEffect, useState } from "react";

interface Driver {
    driver_id: number;
    first_name: string;
    last_name: string;
  }

export default function DriverSelector({ onChange }: { onChange: (id: string) => void }) {
    const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    fetch("/api/drivers").then(res => res.json()).then(setDrivers);
  }, []);

  return (
    <select onChange={(e) => onChange(e.target.value)} className="border p-2 rounded">
      <option value="all">All Drivers</option>
      {drivers.map((d) => (
        <option key={d.driver_id} value={d.driver_id}>
          {d.first_name} {d.last_name}
        </option>
      ))}
    </select>
  );
}
