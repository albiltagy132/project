import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verify } from "./src/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token || !verify(token)) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|login|_next|favicon.ico|public).*)"], // exclude public & allowed routes
};
