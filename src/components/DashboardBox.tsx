"use client";
import { TripCard } from "./TripCard";

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
  trip_id: number;
  event_time: string;
  event_type: "Sleep" | "Yawn"; 
  device_id: string; 
  image_proof: string;
  sensor: "Brake" | "Deviation" | "Null"; 
}



interface DashboardBoxProps {
  date: string;
  weekday: string;
  trips: Trip[];
  events: Event[];
}

export function DashboardBox({ date, weekday, trips, events }: DashboardBoxProps) {
  const morningTrips = trips.filter((t) => t.shift === "MORNING");
  const nightTrips = trips.filter((t) => t.shift === "NIGHT");

  const getEventsForTrip = (trip_id: number) =>
    events.filter((e) => e.trip_id === trip_id);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {weekday} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning Shift */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Morning Shift</h3>
          {morningTrips.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded">No trips assigned for this shift</div>
          ) : (
            morningTrips.map((trip) => (
              <TripCard
                key={trip.trip_id}
                driver_name={`${trip.driver.first_name} ${trip.driver.last_name}`}
                driver_id={trip.driver.driver_id}
                driver_image={trip.driver.image_url}
                vehicle_number={trip.vehicle.vehicle_number}
                vehicle_model={trip.vehicle.model}
                trip_status={trip.trip_status}
                events={getEventsForTrip(trip.trip_id)} // ✅ now filtering properly
              />
            ))
          )}
        </div>

        {/* Night Shift */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Night Shift</h3>
          {nightTrips.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded">No trips assigned for this shift</div>
          ) : (
            nightTrips.map((trip) => (
              <TripCard
                key={trip.trip_id}
                driver_name={`${trip.driver.first_name} ${trip.driver.last_name}`}
                driver_id={trip.driver.driver_id}
                driver_image={trip.driver.image_url}
                vehicle_number={trip.vehicle.vehicle_number}
                vehicle_model={trip.vehicle.model}
                trip_status={trip.trip_status}
                events={getEventsForTrip(trip.trip_id)} // ✅ now filtering properly
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
