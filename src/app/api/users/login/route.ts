// src/app/api/users/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // use jose instead of jsonwebtoken

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
  }

  // ✅ Create JWT with jose
  const token = await new SignJWT({ userId: user.id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

  const response = NextResponse.json({ success: true });

  // ✅ Set token as HTTP-only cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
}
