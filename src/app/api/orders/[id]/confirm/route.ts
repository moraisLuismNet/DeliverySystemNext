import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import orderService from "@/lib/services/orderService";
import emailQueueService from "@/lib/services/emailQueueService";
import emailQueueRepository from "@/lib/db/repositories/EmailQueueRepository";
import brevoEmailProvider from "@/lib/services/brevoEmailProvider";

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

    const now = new Date();
    const subject = "Order Confirmed";
    const body = `Order ${order.id} confirmed`;

    try {
      await brevoEmailProvider.sendEmailAsync(user.email, subject, body);
      await emailQueueRepository.create({
        OrderId: order.id,
        ToEmail: user.email,
        Subject: subject,
        Body: body,
        Status: "Sent",
        RetryCount: 0,
        CreatedAt: now,
        SentAt: now,
      });
    } catch (error: any) {
      await emailQueueService.enqueueEmailAsync(user.email, subject, body);
    }

    return ResponseHelper.success("Order confirmed", order);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}