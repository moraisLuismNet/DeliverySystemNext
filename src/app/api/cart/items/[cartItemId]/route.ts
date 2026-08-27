import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import cartService from "@/lib/services/cartService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ cartItemId: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const { cartItemId } = await params;
    await cartService.removeItemAsync(user.email, parseInt(cartItemId));
    return ResponseHelper.success("Item removed from cart");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
