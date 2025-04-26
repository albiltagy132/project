// src\app\api\trips\route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        driver: {
          select: {
            driver_id: true,
            first_name: true,
            last_name: true,
            image_url: true,
          },
        },
        vehicle: {
          select: {
            vehicle_id: true,
            vehicle_number: true,
            model: true,
            device_id: true,
          },
        },
      },
      orderBy: {
        start_time: "desc",
      },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to load trips." },
      { status: 500 }
    );
  }
}
