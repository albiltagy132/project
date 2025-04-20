// src/app/api/trips/create-from-assignments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WeekDay } from "@prisma/client";

export async function POST() {
  try {
    const today = new Date();
    const weekday = today.toLocaleDateString("en-US", { weekday: "long" }) as WeekDay;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const assignments = await prisma.assignment.findMany({
      where: { weekday },
    });

    if (!assignments.length) {
      return NextResponse.json(
        { message: "No assignments found for today." },
        { status: 200 }
      );
    }

    let createdCount = 0;

    for (const assignment of assignments) {
      // ✅ Check if a trip already exists for today, driver, vehicle, shift
      const existingTrip = await prisma.trip.findFirst({
        where: {
          driver_id: assignment.driver_id,
          vehicle_id: assignment.vehicle_id,
          shift: assignment.shift,
          start_time: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (existingTrip) {
        continue; // 🚫 Skip if trip already exists
      }

      // ✅ Create trip
      await prisma.trip.create({
        data: {
          driver_id: assignment.driver_id,
          vehicle_id: assignment.vehicle_id,
          start_time: today,
          trip_status: "InProgress",
          shift: assignment.shift,
        },
      });

      // ✅ Remove the assignment after creating trip
      await prisma.assignment.delete({
        where: { assignment_id: assignment.assignment_id },
      });

      createdCount++;
    }

    return NextResponse.json(
      { message: `${createdCount} trip(s) created for ${weekday}.` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating trips from assignments:", error);
    return NextResponse.json(
      { error: "Failed to create trips from assignments." },
      { status: 500 }
    );
  }
}
