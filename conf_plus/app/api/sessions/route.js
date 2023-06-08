import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type");

		if (type === "locations") {
			const locations = await prisma.locations.findMany();
			return new Response(JSON.stringify(locations));
		}

		if (type === "dates") {
			let [days, hours, minutes, seconds, miliSeconds] = [10, 24, 60, 60, 1000];
			let dates = [];
			let start = new Date();
			let end = new Date(start.getTime() + days * hours * minutes * seconds * miliSeconds);
			while (start <= end) {
				dates.push(start);
				start = new Date(start.getTime() + hours * minutes * seconds * miliSeconds);
			}
			let availableDates = dates.map((date) => date.toISOString().substring(0, 10));
			return new Response(JSON.stringify(availableDates));
		}

		if (type === "papersTitles") {
			let reviews = (await prisma.reviews.findMany({ select: { paper: true } })).map(({ paper }) => paper);
			return new Response(JSON.stringify(reviews), { status: 200 });
		}

		if (type === "sessions") {
			let sessions = await prisma.sessions.findMany();
			return new Response(JSON.stringify(sessions), { status: 200 });
		}
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error));
	} finally {
		await prisma.$disconnect();
	}
};

export const POST = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let body = await req.json();

		let session = await prisma.sessions.create({ data: body });
		return new Response(JSON.stringify(session), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};

export const DELETE = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let { searchParams } = new URL(req.url);
		let id = searchParams.get("id");

		await prisma.sessions.delete({ where: { id } });
		return new Response(JSON.stringify("DELETED"), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};

export const PUT = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let { searchParams } = new URL(req.url);
		let id = searchParams.get("id");
		let body = await req.json();

		let a = await prisma.sessions.update({
			where: { id },
			data: body,
		});
		return new Response(JSON.stringify(a), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
