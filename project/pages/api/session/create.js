import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { name, paper_id, time, date } = req.body;
  
  const session = await prisma.session.create({
    data: {
      name,
      paper_id,
      time: new Date(time),
      date: new Date(date)
    },
  });
  
  res.json(session);
}