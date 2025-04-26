// scripts/createAdmin.ts
import prisma from "@/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      username: "admin",
      password: "$2b$10$VRB/UtZEf0N5Nwv6y0hvNeUP5dOLWgcmxanL39LefUFeh3PX65v0m",
    },
  });
  console.log("✅ Admin user created!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
