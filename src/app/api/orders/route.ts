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
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const orders = await orderService.getAllAsync();
    return ResponseHelper.success("Orders retrieved successfully", orders);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const body = await request.json();
    const order = await orderService.createAsync(user.email, body);
    return ResponseHelper.created("Order created", order);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}
