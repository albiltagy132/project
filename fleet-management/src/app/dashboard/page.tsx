"use client";

import { useEffect, useState } from "react";
import { DashboardBox } from "@/components/DashboardBox";

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
  device_id: string;
}

interface Trip {
    trip_id: number;
    driver: Driver;
    vehicle: Vehicle;
    start_time: string;
    end_time: string | null;
    trip_status: "InProgress" | "Completed" | "Failed";
    shift: "MORNING" | "NIGHT"; // ✅ add this line
  }
  

interface Event {
  event_id: number;
  event_time: string;
  event_type: "Drowsy" | "Distracted";
  device_id: string;
  image_proof: string;
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

    const fetchData = async () => {
        try {
            const tripRes = await fetch("/api/trips");
            const text = await tripRes.text(); // <-- read raw text
            console.log("RAW /api/trips RESPONSE:", text);

            if (!tripRes.ok) {
            console.error("Trip API failed:", text);
            return;
            }

            const tripData: Trip[] = JSON.parse(text); // safely parse only if it's JSON
             
          const eventRes = await fetch("/api/events");
          const eventData: Event[] = await eventRes.json();
    
          setTrips(tripData);
          setEvents(eventData);
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

  // Filter trips for today and by search
  const filteredTrips = trips.filter((t) => {
    const date = t.start_time.split("T")[0];
    const matchToday = date === todayStr;

    const matchSearch =
      t.driver.first_name.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.last_name.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.driver_id.toString().includes(search);

    return matchToday && matchSearch;
  });

  const filteredEvents = events.filter((event) => {
    const date = event.event_time.split("T")[0];
    const afterStart = !startDate || date >= startDate;
    const beforeEnd = !endDate || date <= endDate;
    return afterStart && beforeEnd;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Fleet Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by driver name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        />
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
        onClick={async () => {
            try {
            const res = await fetch("/api/trips/create-from-assignments", {
                method: "POST",
            });
            const data = await res.json();
            alert(data.message || "Trips created.");
            // Optional: refresh trips immediately
            window.location.reload();
            } catch (error) {
            console.error("Error creating trips:", error);
            alert("Something went wrong while creating trips.");
            }
        }}
        >
        Create Today’s Trips
        </button>
      <DashboardBox
        date={todayStr}
        weekday={weekday}
        trips={filteredTrips}
        events={filteredEvents}
      />
    </div>
  );
}
