import { PrismaClient } from "@prisma/client";

/* 
	{ 
		count: 0, 
		presentations: [
			{ 
				title: "-", 
				count: 0 
			}
		] 
	}
*/

export const GET = async (req) => {
	const prisma = new PrismaClient();
	await prisma.$connect();

	try {
		let reviews = await prisma.reviews.findMany();
		let papers = await prisma.papers.findMany({ include: { _count: true } });
		let sessions = await prisma.sessions.findMany();

		let [accepted, rejected] = [0, 0];
		reviews.forEach((review) => (review.evaluation > 1 && review.contribution > 1 ? (accepted += 1 || 0) : (rejected += 1 || 0)));
		let paperAuthors = papers.map(({ title, _count }) => ({ title, count: _count.authors }));

		let papersData = { count: papers?.length || 0, paperState: { submitted: papers?.length || 0, accepted, rejected }, paperAuthors: paperAuthors };
		let sessionsData = { conferences: sessions.length || 0, presentations: reviews.length || 0 };

		return new Response(JSON.stringify({ papers: papersData, sessions: sessionsData }));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
