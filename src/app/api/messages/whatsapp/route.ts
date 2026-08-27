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

    const messages = await notificationService.getAllWhatsAppAsync();
    return ResponseHelper.success("WhatsApp messages retrieved successfully", messages);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
