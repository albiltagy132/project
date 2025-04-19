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
  shift: "MORNING" | "NIGHT";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripRes = await fetch("/api/trips");
        const tripData: Trip[] = await tripRes.json();

        const eventRes = await fetch("/api/events");
        const eventData: Event[] = await eventRes.json();

        setTrips(tripData);
        setEvents(eventData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  // Group trips by date
  const groupedTrips = trips.reduce((acc: Record<string, Trip[]>, trip) => {
    const date = trip.start_time.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(trip);
    return acc;
  }, {});

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedTrips).sort((a, b) => b.localeCompare(a));

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

      {/* Manual create trips button */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
        onClick={async () => {
          try {
            const res = await fetch("/api/trips/create-from-assignments", {
              method: "POST",
            });
            const data = await res.json();
            alert(data.message || "Trips created.");
            window.location.reload();
          } catch (error) {
            console.error("Error creating trips:", error);
            alert("Something went wrong while creating trips.");
          }
        }}
      >
        Create Today’s Trips
      </button>

      {/* Render one DashboardBox per date */}
      {sortedDates.map((date) => {
        const tripsForDate = groupedTrips[date];

        // Filter by search input
        const filteredTrips = tripsForDate.filter((t) =>
          t.driver.first_name.toLowerCase().includes(search.toLowerCase()) ||
          t.driver.last_name.toLowerCase().includes(search.toLowerCase()) ||
          t.driver.driver_id.toString().includes(search)
        );

        // Filter events for this date and date range
        const eventsForDate = events.filter((event) => {
          const eventDate = event.event_time.split("T")[0];
          const isSameDay = eventDate === date;
          const afterStart = !startDate || eventDate >= startDate;
          const beforeEnd = !endDate || eventDate <= endDate;
          return isSameDay && afterStart && beforeEnd;
        });

        const weekday = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

        return (
          <DashboardBox
            key={date}
            date={date}
            weekday={weekday}
            trips={filteredTrips}
            events={eventsForDate}
          />
        );
      })}
    </div>
  );
}
