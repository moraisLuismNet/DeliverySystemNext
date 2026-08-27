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
    const status = await openWASessionService.getSessionStatusAsync(sessionName);
    return ResponseHelper.success("Session status", {
      status: status?.status || "disconnected",
      phone: status?.phone || null,
    });
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.success("Session status", { status: "disconnected", phone: null });
  }
}
