"use client";
import { useState } from "react";
import Image from "next/image";

interface Event {
  event_id: number;
  event_time: string;
  event_type: "Sleep" | "Yawn";
  device_id: string; // ✅ make sure this is declared
  sensor: "Brake" | "Deviation" | "Null";
  image_proof: string;
  event_severity: "Low" | "Medium" | "High";
}

interface TripCardProps {
  driver_name: string;
  driver_id: number;
  driver_image: string;
  vehicle_number: string;
  vehicle_model: string;
  trip_status: "InProgress" | "Completed" | "Failed";
  events: Event[];
}

export function TripCard({
  driver_name,
  driver_id,
  driver_image,
  vehicle_number,
  vehicle_model,
  trip_status,
  events,
}: TripCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md p-4 bg-white shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={driver_image}
            alt="Driver"
            width={80}
            height={80}
            className="rounded-lg border border-gray-300 shadow-md object-cover"
          />
          <div>
            <p className="font-semibold text-lg">{driver_name}</p>
            <p className="text-sm text-gray-600">ID: {driver_id}</p>
            <p className="text-sm text-gray-600">
              Vehicle: {vehicle_number} – {vehicle_model}
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                trip_status === "Completed"
                  ? "text-green-600"
                  : trip_status === "Failed"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              Status: {trip_status}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-blue-600 hover:underline font-medium"
        >
          {open ? "Hide Events ▲" : "Show Events ▼"}
        </button>
      </div>

      {open && (
        <div className="mt-4 border-t pt-4 space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No events recorded.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.event_id}
                className="flex items-center space-x-4 border p-2 rounded-md bg-gray-50"
              >
                <img
                  src={`data:image/jpeg;base64,${event.image_proof}`}
                  alt="Event"
                  width={80}
                  height={80}
                  className="rounded-lg border border-gray-300 shadow-md object-cover"
                />
                <div>
                  <p className="text-sm">
                    <strong>Type:</strong> {event.event_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong>{" "}
                    {new Date(event.event_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Device ID:</strong> {event.device_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Sensor:</strong> {event.sensor}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Severity:</strong>{" "}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.event_severity === "High"
                        ? "bg-red-100 text-red-800"
                        : event.event_severity === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : event.event_severity === "Low"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {event.event_severity ?? "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
