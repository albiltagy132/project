import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    res.status(400).json({ message: "No user with that email" });
    return;
  }

  const valid = bcrypt.compareSync(password, user.password);

  if (!valid) {
    res.status(400).json({ message: "Incorrect password" });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ message: "Login successful", token: token });
}