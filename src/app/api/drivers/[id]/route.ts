/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single vehicle
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id: parseInt(params.id) }, // Parse here if DB expects number
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

// PUT - Update a vehicle
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.vehicle.update({
      where: { vehicle_id: parseInt(params.id) }, // Parse here if DB expects number
      data,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a vehicle
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vehicle.delete({
      where: { vehicle_id: parseInt(params.id) }, // Parse here if DB expects number
    });

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
