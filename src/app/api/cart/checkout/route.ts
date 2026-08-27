import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import cartService from "@/lib/services/cartService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const body = await request.json();
    const result = await cartService.checkoutAsync(user.email, body);
    return ResponseHelper.success("Redirect to payment", result);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}
