import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import orderService from "@/lib/services/orderService";
import emailQueueService from "@/lib/services/emailQueueService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    const { id } = await params;
    const order = await orderService.confirmAsync(parseInt(id));
    try {
      await emailQueueService.enqueueEmailAsync(user.email, "Order Confirmed", `Order ${order.id} confirmed`);
    } catch { }
    return ResponseHelper.success("Order confirmed", order);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
