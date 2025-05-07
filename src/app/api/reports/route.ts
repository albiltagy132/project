// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const driverId = searchParams.get("driver_id");
  const range = searchParams.get("range") || "all_time";

  const now = new Date();
  let startDate: Date | null = null;

  switch (range) {
    case "last_7_days":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "last_month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "last_6_months":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "last_year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = null;
  }

  const filters: any = {};
  if (startDate) {
    filters.event_time = { gte: startDate };
  }
  if (driverId && driverId !== "all") {
    filters.trip = { driver_id: parseInt(driverId) };
  }

  const events = await prisma.event.findMany({
    where: filters,
    include: {
      trip: { include: { driver: true } },
    },
  });

  return NextResponse.json(events);
}
