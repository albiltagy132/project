// src\app\api\assignments\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Create a new assignment
export async function POST(req: Request) {
  try {
    const { driver_id, vehicle_id, shift, weekday } = await req.json();

    // Check if the driver is already assigned on the same day and shift
    const driverConflict = await prisma.assignment.findFirst({
      where: {
        driver_id,
        shift,
        weekday,
      },
    });

    if (driverConflict) {
      return NextResponse.json(
        { error: "This driver already has an assignment on the selected day and shift." },
        { status: 400 }
      );
    }

    // Check if the vehicle is already assigned on the same day and shift
    const vehicleConflict = await prisma.assignment.findFirst({
      where: {
        vehicle_id,
        shift,
        weekday,
      },
    });

    if (vehicleConflict) {
      return NextResponse.json(
        { error: "This vehicle is already assigned to another driver on the selected day and shift." },
        { status: 400 }
      );
    }

    // Create the new assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        driver_id,
        vehicle_id,
        shift,
        weekday,
      },
      include: {
        driver: true,
        vehicle: true,
      },
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json({ error: "Failed to assign driver" }, { status: 500 });
  }
}

// GET - Fetch all assignments (Include Shift and Day)
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        driver: {
          select: {
            first_name: true,
            last_name: true,
            image_url: true,
          },
        },
        vehicle: true,
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}
