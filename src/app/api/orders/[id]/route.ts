import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import orderService from "@/lib/services/orderService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const { id } = await params;
    const order = await orderService.getByIdAsync(parseInt(id));
    if (!order) return ResponseHelper.notFound("Order not found");
    return ResponseHelper.success("Order retrieved successfully", order);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const { id } = await params;
    await orderService.cancelAsync(parseInt(id));
    return ResponseHelper.success("Order cancelled");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
