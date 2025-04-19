import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//POST - Add a new vehicle
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.vehicle_number || !data.device_id || !data.model || !data.make || !data.year || !data.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    //Convert `year` to an integer before saving
    const formattedData = {
      ...data,
      year: Number(data.year),
    };

    const newVehicle = await prisma.vehicle.create({ data: formattedData });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Error Creating Vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}



//GET - Fetch all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error Fetching Vehicles:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
