import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
    });

    res.json(session);
  } else if (req.method === 'PUT') {
    const { name, paper_id, time, date } = req.body;

    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: { 
        name, 
        paper_id, 
        time: new Date(time), 
        date: new Date(date) 
      },
    });

    res.json(session);
  } else if (req.method === 'DELETE') {
    const session = await prisma.session.delete({
      where: { id: Number(id) },
    });

    res.json(session);
  }
}
