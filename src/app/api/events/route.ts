// src\app\api\events\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, $Enums } from "@prisma/client";

// 🟢 Helper to determine event severity
function determineSeverity(
  event_type: $Enums.EventType,
  sensor: $Enums.SensorType
): $Enums.EventSeverity {
  const isSleep = event_type === "Sleep";
  const isYawn = event_type === "Yawn";
  const isBrakeOrTurn = sensor === "Brake" || sensor === "Turn";

  if (isSleep && isBrakeOrTurn) return "High";
  if (isSleep) return "Medium";
  if (isYawn && isBrakeOrTurn) return "Low";
  return "Low"; // Default fallback
}

// 🟢 GET - Return all events with related trip/driver/vehicle
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { event_time: "desc" },
      include: {
        trip: {
          include: {
            driver: true,
            vehicle: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// 🔴 POST - Create new event sent from Raspberry Pi
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || req.headers.get("x-event-secret");
  const expectedSecret = process.env.EVENT_SECRET;

  if (!authHeader || (authHeader !== `Bearer ${expectedSecret}` && authHeader !== expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { device_id, timestamp, event_type, image_proof, sensor } = await req.json();
    console.log("📩 Event received:");

    const eventDate = new Date(timestamp);
    const hour = eventDate.getHours();
    const shift: $Enums.Shift = hour >= 9 && hour < 17 ? "MORNING" : "NIGHT";

    // 1. Ensure the vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { device_id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // 2. Find the trip for this device and shift on the same day
    const startOfDay = new Date(eventDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);

    const trip = await prisma.trip.findFirst({
      where: {
        vehicle_id: vehicle.vehicle_id,
        shift,
        start_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found for this timestamp" }, { status: 404 });
    }

    // 🔵 Compute severity
    const severity = determineSeverity(event_type, sensor);

    // 3. Save the event
    const newEvent = await prisma.event.create({
      data: {
        trip_id: trip.trip_id,
        event_time: eventDate,
        event_type: event_type as $Enums.EventType,
        sensor: sensor as $Enums.SensorType,
        image_proof,
        device_id,
        event_severity: severity,
      },
    });

    // 4. Mark trip as completed if still in progress
    if (trip.trip_status === "InProgress") {
      await prisma.trip.update({
        where: { trip_id: trip.trip_id },
        data: {
          trip_status: "Completed",
          end_time: eventDate,
        },
      });
    }

    console.log("✅ Event saved and trip updated.");
    return NextResponse.json(newEvent, { status: 201 });

  } catch (error) {
    console.error("❌ Error saving event:", error);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
