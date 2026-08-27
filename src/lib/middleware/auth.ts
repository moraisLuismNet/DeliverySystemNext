import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface UserPayload {
  email: string;
  name: string;
  role: string;
}

export function verifyAuth(request: NextRequest): UserPayload {
  const authHeader = request.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = request.cookies.get("token")?.value;
  }

  if (!token) {
    throw Object.assign(new Error("No authentication token provided"), { statusCode: 401 });
  }

  if (!process.env.JWT_KEY) {
    throw Object.assign(new Error("Server configuration error"), { statusCode: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY) as UserPayload & { iat: number };
    return { email: decoded.email, name: decoded.name, role: decoded.role };
  } catch {
    throw Object.assign(new Error("Invalid or expired token"), { statusCode: 401 });
  }
}

export function requireAuth(roles?: string[]) {
  return (request: NextRequest): { user: UserPayload } | NextResponse => {
    try {
      const user = verifyAuth(request);

      if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return NextResponse.json(
          { success: false, message: "Forbidden: Insufficient permissions", statusCode: 403 },
          { status: 403 }
        );
      }

      return { user };
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || "Authentication failed", statusCode: err.statusCode || 500 },
        { status: err.statusCode || 500 }
      );
    }
  };
}
