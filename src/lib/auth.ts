// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET_KEY || "default_secret";

export function sign(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verify(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies(); // 🛠️ await here
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verify(token);
}
