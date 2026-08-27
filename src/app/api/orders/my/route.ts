import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import orderService from "@/lib/services/orderService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const orders = await orderService.getByUserAsync(user.email);
    return ResponseHelper.success("Orders retrieved successfully", orders);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
