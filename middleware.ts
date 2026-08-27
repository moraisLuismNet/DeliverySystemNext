import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/middleware/rateLimit";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
