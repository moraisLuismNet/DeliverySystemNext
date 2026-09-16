import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import notificationService from "@/lib/services/notificationService";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("CRON_SECRET not configured", { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    ensureDb();
    const result = await notificationService.processPendingWhatsAppAsync();
    return ResponseHelper.success("Pending WhatsApp notifications processed", result);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}