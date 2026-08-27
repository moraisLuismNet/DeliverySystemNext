import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import cartService from "@/lib/services/cartService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const cart = await cartService.getCartAsync(user.email);
    return ResponseHelper.success("Cart retrieved successfully", cart);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const { searchParams } = new URL(request.url);
    const restoreStock = searchParams.get("restoreStock") !== "false";
    await cartService.clearCartAsync(user.email, restoreStock);
    return ResponseHelper.success("Cart cleared");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
