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
    const { menuItemId, quantity } = body;
    const cart = await cartService.addItemAsync(user.email, { menuItemId, quantity });
    return ResponseHelper.success("Item added to cart", cart);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const body = await request.json();
    const { cartItemId, quantity } = body;
    const cart = await cartService.updateItemAsync(user.email, { cartItemId, quantity });
    return ResponseHelper.success("Cart updated", cart);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}
