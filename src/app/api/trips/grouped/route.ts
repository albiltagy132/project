// src/app/api/trips/grouped/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { start_time: "desc" },
      include: {
        driver: true,
        vehicle: true,
        events: true,
      },
    });

    // Group by date
    const grouped = trips.reduce((acc: Record<string, typeof trips>, trip) => {
      const date = new Date(trip.start_time).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(trip);
      return acc;
    }, {});

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching grouped trips:", error);
    return NextResponse.json({ error: "Failed to fetch grouped trips" }, { status: 500 });
  }
}
