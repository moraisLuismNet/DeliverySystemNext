import { NextRequest, NextResponse } from "next/server";

const clients = new Map<string, { count: number; resetAt: number }>();
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "100");
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "1") * 60 * 1000;

export function rateLimit(request: NextRequest): NextResponse | null {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const now = Date.now();

  let entry = clients.get(clientIp);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    clients.set(clientIp, entry);
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later.", statusCode: 429 },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  return null;
}
