import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import orderService from "@/lib/services/orderService";
import notificationService from "@/lib/services/notificationService";
import userService from "@/lib/services/userService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    const order = await orderService.updateStatusAsync(parseInt(id), status);

    if (status === "Delivered") {
      try {
        const customer = await userService.getByIdAsync(order.userId);
        if (customer) {
          await notificationService.scheduleDeliveryNotificationAsync(order.id, customer.phoneNumber, customer.name);
        }
      } catch { }
    }

    return ResponseHelper.success("Status updated", order);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
