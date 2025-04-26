// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { sign } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Hardcoded credentials
  if (username === "admin" && password === "admin") {
    const token = sign({ username });

    const response = NextResponse.json({ message: "Logged in" });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
