import { promises as fs } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type");

		if (type === "users") {
			const data = JSON.parse(await fs.readFile(join(process.cwd(), "/data/users.json"), "utf-8"));
			let users = await prisma.users.createMany({ data: data, skipDuplicates: true });
			return new Response(JSON.stringify(users));
		}

		if (type === "locations") {
			const data = JSON.parse(await fs.readFile(join(process.cwd(), "/data/locations.json"), "utf-8"));
			let locations = await prisma.locations.createMany({ data: data, skipDuplicates: true });
			return new Response(JSON.stringify(locations));
		}
	} catch (error) {
		new Response(JSON.stringify(error));
		console.log("Seed.js => ", error);
	} finally {
		await prisma.$disconnect();
	}
};
