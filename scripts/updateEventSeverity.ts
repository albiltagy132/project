import prisma from "@/lib/prisma"; // Adjust if needed

async function run() {
  const events = await prisma.event.findMany();

  for (const event of events) {
    let severity: "Low" | "Medium" | "High" | null = null;

    if (event.event_type === "Sleep" && (event.sensor === "Brake" || event.sensor === "Turn")) {
      severity = "High";
    } else if (event.event_type === "Sleep") {
      severity = "Medium";
    } else if (event.event_type === "Yawn" && (event.sensor === "Brake" || event.sensor === "Turn")) {
      severity = "Low";
    }

    if (severity) {
      await prisma.event.update({
        where: { event_id: event.event_id },
        data: { event_severity: severity },
      });
      console.log(`✅ Updated event ${event.event_id} → ${severity}`);
    } else {
      console.log(`⚠ Skipped event ${event.event_id}, no matching severity rule.`);
    }
  }

  console.log("✅ All events updated.");
}

run()
  .catch((e) => {
    console.error("❌ Error updating severities:", e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
