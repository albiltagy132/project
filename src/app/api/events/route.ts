import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, $Enums } from "@prisma/client";


export async function POST(req: Request) {
  try {
    const { device_id, timestamp, event_type, image_proof, sensor } = await req.json();

    // 1. Get the vehicle by device_id
    const vehicle = await prisma.vehicle.findUnique({
      where: { device_id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // 2. Get the weekday + hour from timestamp
    const eventDate = new Date(timestamp);
    const weekdayString = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const weekday = weekdayString as $Enums.WeekDay;
    const hour = eventDate.getHours();

    // 3. Determine shift based on hour
    const shift = hour >= 9 && hour < 17 ? "MORNING" : "NIGHT";

    // 4. Find the trip by vehicle + driver assigned at that time
    const assignment = await prisma.assignment.findFirst({
      where: {
        vehicle_id: vehicle.vehicle_id,
        shift,
        weekday,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "No assignment found for this vehicle and time" }, { status: 404 });
    }

    // 5. Find the trip matching that driver/vehicle on the same date
    const trip = await prisma.trip.findFirst({
      where: {
        driver_id: assignment.driver_id,
        vehicle_id: assignment.vehicle_id,
        start_time: {
          lte: eventDate,
        },
        end_time: {
          gte: eventDate,
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found for that time" }, { status: 404 });
    }

    // 6. Save the event
    const newEvent = await prisma.event.create({
      data: {
        trip_id: trip.trip_id,
        event_time: eventDate,
        event_type,
        sensor,
        image_proof,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("❌ Error saving event:", error);
    return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
  }
}
