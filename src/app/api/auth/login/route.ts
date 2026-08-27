import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import authService from "@/lib/services/authService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return ResponseHelper.badRequest("Email and password are required");
    }
    const result = await authService.loginAsync({ email, password });
    return ResponseHelper.success("Login successful", result);
  } catch (error: any) {
    if (error.message?.includes("Invalid") || error.message?.includes("disabled")) {
      return ResponseHelper.error(error.message, undefined, 401);
    }
    return ResponseHelper.error(error.message);
  }
}
