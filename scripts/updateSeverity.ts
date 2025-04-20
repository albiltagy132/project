import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateEventSeverities() {
  const events = await prisma.event.findMany();

  for (const event of events) {
    let severity: "High" | "Medium" | "Low" | null = null;

    if (event.event_type === "Sleep") {
      severity = event.sensor !== "Null" ? "High" : "Medium";
    } else if (event.event_type === "Yawn") {
      severity = event.sensor !== "Null" ? "Low" : null;
    }

    if (severity) {
      await prisma.event.update({
        where: { event_id: event.event_id },
        data: { event_severity: severity },
      });
      console.log(`✅ Updated event ${event.event_id} → ${severity}`);
    } else {
      console.log(`⚠ Skipped event ${event.event_id} (no matching severity rule)`);
    }
  }

  console.log("🎉 Done updating event severities.");
}

updateEventSeverities()
  .catch((err) => {
    console.error("❌ Error updating severities:", err);
  })
  .finally(() => prisma.$disconnect());
