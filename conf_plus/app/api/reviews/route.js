import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		if (userId) {
			const matchingPaper = await prisma.papers.findMany({ where: { reviewerIds: { has: userId } } });
			return new Response(JSON.stringify(matchingPaper));
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
		let review = await prisma.reviews.create({ data: body });
		console.log(review);
		return new Response(JSON.stringify(body), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
