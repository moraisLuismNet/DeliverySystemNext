import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import notificationService from "@/lib/services/notificationService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const whatsAppMessages = await notificationService.getAllWhatsAppAsync();
    const emailMessages = await notificationService.getAllEmailsAsync();
    return ResponseHelper.success("Messages retrieved successfully", { whatsAppMessages, emailMessages });
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const body = await request.json();
    const { orderId, phoneNumber, customerName } = body;
    await notificationService.scheduleDeliveryNotificationAsync(orderId, phoneNumber, customerName);
    return ResponseHelper.success("Notification queued successfully");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}
