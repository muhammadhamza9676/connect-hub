import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicPaths = [
  "/api/auth/login",
  "/api/auth/register"
];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public API routes
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Protect all other /api routes
//   if (pathname.startsWith("/api")) {
//     const authHeader = req.headers.get("authorization") || "";
//     const token = authHeader.replace("Bearer ", "");
//     if (!token) {
//       return NextResponse.json({ error: "No token provided" }, { status: 401 });
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       return NextResponse.next();
//     } catch (err) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
};
