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
    const { email, phoneNumber, name, password } = body;
    if (!email || !password || !name) {
      return ResponseHelper.badRequest("Email, name, and password are required");
    }
    const result = await authService.registerAsync({ email, phoneNumber: phoneNumber || "", name, password });
    return ResponseHelper.created("Registration successful", result);
  } catch (error: any) {
    return ResponseHelper.badRequest(error.message);
  }
}
