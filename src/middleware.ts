import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET!; // Same secret used when signing the token

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow access to login page and static assets
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET));
    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Specify the paths middleware applies to
export const config = {
  matcher: [
    "/dashboard/:path*", "/drivers/:path*", "/vehicles/:path*", "/assign/:path*", "/api/:path*",
    "/((?!login|_next|favicon.ico).*)",
  ],
};

