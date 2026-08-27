import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import paymentService from "@/lib/services/paymentService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return ResponseHelper.badRequest("session_id is required");
    }
    await paymentService.confirmPaymentAsync({ sessionId });
    return ResponseHelper.success("Payment confirmed");
  } catch (error: any) {
    return ResponseHelper.error(`Payment error: ${error.message}`);
  }
}
