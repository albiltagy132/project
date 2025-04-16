import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WeekDay } from "@prisma/client"; // Make sure you have this enum in your schema

export async function POST() {
  try {
    const today = new Date();
    const weekday = today.toLocaleDateString("en-US", { weekday: "long" }) as WeekDay;

    // Get today's assignments
    const assignments = await prisma.assignment.findMany({
      where: { weekday },
    });

    if (!assignments.length) {
      return NextResponse.json(
        { message: "No assignments found for today." },
        { status: 200 }
      );
    }

    // Loop through and create trips
    for (const assignment of assignments) {
      await prisma.trip.create({
        data: {
          driver_id: assignment.driver_id,
          vehicle_id: assignment.vehicle_id,
          start_time: today,
          trip_status: "InProgress",
          shift: assignment.shift, // ✅ this must be set!
        },
      });
      

      // Remove the assignment after creating trip
      await prisma.assignment.delete({
        where: { assignment_id: assignment.assignment_id },
      });
    }

    return NextResponse.json(
      { message: `${assignments.length} trip(s) created for ${weekday}.` },
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
