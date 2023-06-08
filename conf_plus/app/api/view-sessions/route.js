import { PrismaClient } from "@prisma/client";

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let { searchParams } = new URL(req.url);
		let date = searchParams.get("date");

		let sessions = null;

		if (date === "All") sessions = await prisma.sessions.findMany();
		else sessions = await prisma.sessions.findMany({ where: { date } });

		let papers = await prisma.papers.findMany({ select: { title: true, authors: true } });
		sessions.forEach((session, i) => {
			let matchingPaper = papers.find((paper) => session.paper.toUpperCase() === paper.title.toUpperCase());
			if (!matchingPaper) return console.log(session.paper, papers);
			let presenters = matchingPaper.authors.filter((author) => author.presenter).map((author) => author.name);
			sessions[i].presenters = presenters;
		});

		return new Response(JSON.stringify(sessions), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
