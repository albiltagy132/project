import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//GET - Fetch a Single Vehicle by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; //Ensure params is awaited
    const vehicle_id = parseInt(id);


    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error Fetching Vehicle:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

// 🗑️ DELETE - Remove a Vehicle
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; //Ensure params is awaited
    const vehicle_id = parseInt(id);


    await prisma.vehicle.delete({
      where: { vehicle_id },
    });

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Vehicle:", error);
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}

//PUT - Update a Vehicle
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; //Ensure params is awaited
    const vehicle_id = parseInt(id);
    const data = await req.json();


    const updatedVehicle = await prisma.vehicle.update({
      where: { vehicle_id },
      data,
    });

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("Error Updating Vehicle:", error);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}
