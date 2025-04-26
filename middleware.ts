// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // 🛠️ IMPORTANT: NextRequest not Request
import { verify } from "./src/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token || !verify(token)) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only protect these routes:
export const config = {
  matcher: ["/((?!login|_next|favicon.ico|public).*)"], // allow login and static files
};
