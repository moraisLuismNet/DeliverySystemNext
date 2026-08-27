import Stripe from "stripe";
import paymentRepository from "../db/repositories/PaymentRepository";
import orderRepository from "../db/repositories/OrderRepository";
import userRepository from "../db/repositories/UserRepository";
import emailQueueRepository from "../db/repositories/EmailQueueRepository";
import notificationQueueRepository from "../db/repositories/NotificationQueueRepository";
import brevoEmailProvider from "./brevoEmailProvider";
import openWAProvider from "./openWAProvider";
import { CheckoutSessionResponseDTO } from "../dtos/Payment/CheckoutSessionResponseDTO";
import { CreateCheckoutSessionDTO } from "../dtos/Payment/CreateCheckoutSessionDTO";
import { ConfirmPaymentDTO } from "../dtos/Payment/ConfirmPaymentDTO";
import { IPaymentService } from "./interfaces/IPaymentService";

export class PaymentService implements IPaymentService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    this.stripe = new Stripe(secretKey, { apiVersion: "2026-02-25.clover" });
  }

  private debugLog(msg: string) {
    console.log(`[PaymentService] ${msg}`);
  }

  async createCheckoutSessionAsync(
    dto: CreateCheckoutSessionDTO,
  ): Promise<CheckoutSessionResponseDTO> {
    const order = await orderRepository.getOrderWithItemsAsync(dto.orderId);
    if (!order) throw new Error("Order not found");

    const items = (order as any).Items || [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (i: any) => ({
        price_data: {
          currency: "eur",
          product_data: { name: i.MenuItemName },
          unit_amount: Math.round(parseFloat(i.UnitPrice) * 100),
        },
        quantity: i.Quantity,
      }),
    );

    if (lineItems.length === 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: `Order #${dto.orderId}` },
          unit_amount: 0,
        },
        quantity: 1,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      locale: "en",
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL || "",
      metadata: { orderId: dto.orderId.toString() },
    });

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + parseFloat(i.UnitPrice) * i.Quantity,
      0,
    );

    await paymentRepository.create({
      OrderId: dto.orderId,
      StripeSessionId: session.id,
      StripePaymentIntentId: "",
      Status: "Pending",
      Amount: totalAmount,
      Currency: "eur",
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url || "",
    };
  }

  async confirmPaymentAsync(dto: ConfirmPaymentDTO): Promise<void> {
    this.debugLog(`confirmPaymentAsync called with sessionId="${dto.sessionId}"`);
    const session = await this.stripe.checkout.sessions.retrieve(dto.sessionId);
    this.debugLog(`payment_status="${session.payment_status}"`);

    if (session.payment_status === "paid") {
      const payment = await paymentRepository.getBySessionIdAsync(
        dto.sessionId,
      );
      this.debugLog(`payment record found: ${!!payment}`);
      if (payment) {
        if (payment.Status === "Paid") {
          this.debugLog("Payment already processed, skipping.");
          return;
        }

        await paymentRepository.update(payment.Id, {
          Status: "Paid",
          StripePaymentIntentId: (session.payment_intent as string) || "",
          PaidAt: new Date(),
          UpdatedAt: new Date(),
        } as any);
        this.debugLog(`Payment ${payment.Id} updated, updating order ${payment.OrderId}`);
        await orderRepository.update(payment.OrderId, {
          Status: "Confirmed",
          ConfirmedAt: new Date(),
          UpdatedAt: new Date(),
        } as any);

        const order = await orderRepository.getOrderWithItemsAsync(
          payment.OrderId,
        );
        this.debugLog(`order with items found: ${!!order}`);
        if (order) {
          const user = await userRepository.getByEmailAsync(order.UserId);
          const now = new Date();
          const itemsHtml = ((order as any).Items || [])
            .map(
              (i: any) =>
                `<tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px;"><strong>${i.MenuItemName}</strong></td>
              <td style="padding:10px;text-align:center;">${i.Quantity}</td>
              <td style="padding:10px;text-align:right;">${Number(i.UnitPrice).toFixed(2)}€</td>
              <td style="padding:10px;text-align:right;">${(Number(i.UnitPrice) * i.Quantity).toFixed(2)}€</td>
            </tr>`,
            )
            .join("");

          const emailBody = `
            <div style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:10px;">
              <h1 style="color:#4CAF50;text-align:center;">Order Confirmation</h1>
              <p>Dear ${user?.Name || "Customer"},</p>
              <p>Your payment has been received and your order is now confirmed. Thank you for your purchase!</p>
              <div style="background-color:#f9f9f9;padding:15px;border-radius:5px;margin:20px 0;">
                <p style="margin:0;"><strong>Order ID:</strong> #${order.Id}</p>
                <p style="margin:5px 0 0 0;"><strong>Date:</strong> ${now.toLocaleString()}</p>
                <p style="margin:5px 0 0 0;"><strong>Restaurant:</strong> ${order.RestaurantName}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;margin-top:20px;">
                <thead>
                  <tr style="background-color:#4CAF50;color:white;">
                    <th style="padding:10px;text-align:left;">Item</th>
                    <th style="padding:10px;text-align:center;">Qty</th>
                    <th style="padding:10px;text-align:right;">Price</th>
                    <th style="padding:10px;text-align:right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding:15px 10px;text-align:right;font-weight:bold;">Total:</td>
                    <td style="padding:15px 10px;text-align:right;font-weight:bold;color:#4CAF50;font-size:1.2em;">${Number(order.TotalAmount).toFixed(2)}€</td>
                  </tr>
                </tfoot>
              </table>
              <p style="margin-top:30px;">Thank you for choosing <strong>Delivery System</strong>.</p>
              <hr style="border:0;border-top:1px solid #eee;margin:20px 0;" />
              <p style="font-size:0.8em;color:#999;text-align:center;">This is an automated message.</p>
            </div>`;

          const toEmail = user?.Email || order.UserId;
          const subject = "Order Confirmation - Payment Received";
          this.debugLog(`Sending confirmation email to: ${toEmail}`);
          try {
            await brevoEmailProvider.sendEmailAsync(toEmail, subject, emailBody);
            this.debugLog(`Email sent to ${toEmail}`);
            await emailQueueRepository.create({
              OrderId: order.Id,
              ToEmail: toEmail,
              Subject: subject,
              Body: emailBody,
              Status: "Sent",
              RetryCount: 0,
              CreatedAt: now,
              SentAt: now,
            });
          } catch (emailError: any) {
            this.debugLog(
              `Direct email failed (${emailError?.message}), enqueueing for: ${toEmail}`,
            );
            await emailQueueRepository.create({
              OrderId: order.Id,
              ToEmail: toEmail,
              Subject: subject,
              Body: emailBody,
              Status: "Pending",
              RetryCount: 0,
              CreatedAt: now,
            });
          }

          if (user?.PhoneNumber) {
            const message = `Hello ${user.Name}, your order #${order.Id} has arrived. Enjoy your meal!`;
            this.debugLog(`Sending WhatsApp confirmation to: ${user.PhoneNumber}`);
            try {
              await openWAProvider.sendMessageAsync(user.PhoneNumber, message);
              this.debugLog(`WhatsApp message sent to ${user.PhoneNumber}`);
              await notificationQueueRepository.create({
                PhoneNumber: user.PhoneNumber,
                Message: message,
                OrderId: order.Id,
                Status: "Sent",
                RetryCount: 0,
                CreatedAt: now,
                SentAt: now,
              });
            } catch (waError: any) {
              this.debugLog(
                `Direct WhatsApp failed (${waError?.message}), enqueueing for: ${user.PhoneNumber}`,
              );
              const scheduledAt = new Date(now.getTime() + 1 * 60000);
              await notificationQueueRepository.create({
                PhoneNumber: user.PhoneNumber,
                Message: message,
                OrderId: order.Id,
                Status: "Pending",
                RetryCount: 0,
                CreatedAt: now,
                ScheduledAt: scheduledAt,
              });
            }
          }
        }
      }
    }
  }
}

export default new PaymentService();
