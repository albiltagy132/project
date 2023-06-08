import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let { searchParams } = new URL(req.url);
		let randomReviewers = searchParams.get("rondomReviewers");

		if (randomReviewers) {
			let reviewers = (await prisma.users.findMany({ where: { role: "reviewer" }, select: { id: true } })).map(({ id }) => id);
			let [id1, id2] = [Math.floor(Math.random() * reviewers.length), Math.floor(Math.random() * reviewers.length)];
			return new Response(JSON.stringify([reviewers[id1], reviewers[id2]]), { status: 200 });
		}
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		prisma.$disconnect();
	}
};

export const POST = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let { authors, ...body } = await req.json();
		let paper = await prisma.papers.create({
			data: { ...body, authors: { create: authors } },
			include: { authors: true },
		});

		return new Response(JSON.stringify(paper), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
