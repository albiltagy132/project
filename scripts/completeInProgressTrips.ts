import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function completeInProgressTrips() {
  const trips = await prisma.trip.findMany({
    where: { trip_status: "InProgress" },
  });

  if (trips.length === 0) {
    console.log("No InProgress trips found.");
    return;
  }

  for (const trip of trips) {
    const endTime = new Date(trip.start_time);
    endTime.setHours(endTime.getHours() + 5);

    await prisma.trip.update({
      where: { trip_id: trip.trip_id },
      data: {
        trip_status: "Completed",
        end_time: endTime,
      },
    });

    console.log(`✅ Trip ${trip.trip_id} marked as Completed. End time set to ${endTime.toISOString()}`);
  }

  console.log(`🎉 All ${trips.length} InProgress trip(s) have been completed.`);
}

completeInProgressTrips()
  .catch((err) => {
    console.error("❌ Error completing trips:", err);
  })
  .finally(() => prisma.$disconnect());
