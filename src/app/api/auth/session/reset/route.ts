import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import openWASessionService from "@/lib/services/openWASessionService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const sessionId = process.env.OPENWA_SESSION_ID || "delivery-session";
    const status = await openWASessionService.getSessionStatusAsync(sessionId);
    if (status && status.id) {
      await openWASessionService.deleteSessionAsync(status.id);
    }
    return ResponseHelper.success("Session reset successfully", { status: "reset" });
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
