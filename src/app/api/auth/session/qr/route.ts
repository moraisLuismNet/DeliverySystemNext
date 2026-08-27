import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import openWASessionService from "@/lib/services/openWASessionService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const sessionName = process.env.OPENWA_SESSION_ID || "delivery-session";
    const existingStatus = await openWASessionService.getSessionStatusAsync(sessionName);
    if (existingStatus && existingStatus.status === "ready") {
      return ResponseHelper.success("Session already linked", { status: "ready", phone: existingStatus.phone || "" });
    }

    const resolvedId = await openWASessionService.ensureSessionActiveAsync(sessionName);
    if (!resolvedId) {
      return ResponseHelper.error("Failed to initialize session", undefined, 500);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const qrBuffer = await openWASessionService.getQrImageAsync(resolvedId);
    if (qrBuffer) {
      return ResponseHelper.success("QR image retrieved", { status: "qr_ready", qrImage: qrBuffer.toString("base64") });
    }

    const sessionStatus = await openWASessionService.getSessionStatusAsync(resolvedId);
    const st = sessionStatus?.status || "unknown";
    return ResponseHelper.success("Session status", { status: st });
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
