import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const sessions = await prisma.session.findMany();
  
  res.json(sessions);
}
