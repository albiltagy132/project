import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type");
		const email = searchParams.get("email");
		const password = searchParams.get("password");

		if (type === "All") {
			let users = await prisma.users.findMany();
			return new Response(JSON.stringify(users));
		}

		if (email && password) {
			console.log("run");
			let user = await prisma.users.findFirst({ where: { AND: { email, password } } });
			if (user) return new Response(JSON.stringify(user), { status: 200 });
			else return new Response(JSON.stringify("Email OR Password Is Incurrect"), { status: 406 });
		}
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
