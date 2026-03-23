
import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import { Subscription } from "../models/Subscription.model.js";


const PLAN_CONFIG = {
  foundation: { days: 365 },
  command:    { days: 30  },
  edge:       { days: 30  },
};

// ─── POST /api/v1/payment/process ─────────────────────────────────────────────
export const processPayment = async (req, res) => {
  try {
    const { amount, userId, planId, durationDays } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount required" });
    }

    const order = await instance.orders.create({
      amount:   Number(amount) * 100,   // rupees → paise
      currency: "INR",
      notes: {
        userId:      userId      || "",
        planId:      planId      || "",
        durationDays: durationDays || 30,
      },
    });

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ processPayment:", err.message);
    return res.status(500).json({ success: false, message: "Order creation failed. Please try again." });
  }
};

// ─── GET /api/v1/getKey ───────────────────────────────────────────────────────
export const getKey = async (req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};


export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.error("❌ Signature mismatch for order:", razorpay_order_id);
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 2. Process (idempotent — won't fail if webhook already processed it)
    await processVerifiedPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    // 3. Redirect to success page
    return res.redirect(
      `${process.env.CORS_ORIGIN}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } catch (err) {
    console.error("❌ paymentVerification:", err.message);
    return res.redirect(
      `${process.env.CORS_ORIGIN}/paymentsuccess?error=processing_failed`
    );
  }
};


export const paymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ RAZORPAY_WEBHOOK_SECRET not set in .env");
      return res.status(500).send("Webhook secret not configured");
    }

    // 1. Verify webhook signature
    const receivedSignature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body) // raw buffer — must NOT be JSON parsed
      .digest("hex");

    if (receivedSignature !== expectedSignature) {
      console.error("❌ Webhook signature invalid");
      return res.status(400).send("Invalid signature");
    }

    // 2. Parse body (it's a raw Buffer at this point)
    const event = JSON.parse(req.body.toString());
    console.log("✅ Webhook received:", event.event, event.payload?.payment?.entity?.id);

    // 3. Handle payment.captured — main success event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount; // in paise

      // Fetch order to get notes
      const order = await instance.orders.fetch(orderId);
      const { userId, planId, durationDays = 30 } = order.notes || {};

      const fakeSignature = "webhook-verified-" + paymentId;

      await processVerifiedPayment({
        razorpay_order_id:  orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature:  fakeSignature,
        userId,
        planId,
        durationDays,
        amountPaise: amount,
      });
    }

    // 4. Handle payment.failed — optional: mark subscription as pending/failed
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      console.warn("⚠️ Payment failed for order:", payment.order_id);
      // Could update subscription status to 'failed' here if needed
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    // Always return 200 to Razorpay — otherwise it retries endlessly
    return res.status(200).json({ received: true, error: err.message });
  }
};


async function processVerifiedPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  planId,
  durationDays = 30,
  amountPaise,
}) {
  // Save payment record — unique index on razorpay_payment_id prevents duplicates
  try {
    await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    console.log("✅ Payment saved:", razorpay_payment_id);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate — webhook + callback both fired, ignore
      console.log("ℹ️ Payment already processed (idempotent):", razorpay_payment_id);
      return;
    }
    throw err;
  }

  // Create subscription if userId + planId present
  if (!userId || !planId) {
    // Fetch from order if not passed directly
    try {
      const order = await instance.orders.fetch(razorpay_order_id);
      userId = order.notes?.userId;
      planId = order.notes?.planId;
      durationDays = order.notes?.durationDays || 30;
      amountPaise = amountPaise || order.amount;
    } catch (e) {
      console.warn("⚠️ Could not fetch order notes:", e.message);
      return;
    }
  }

  if (!userId || !planId) {
    console.warn("⚠️ No userId/planId — subscription not created for:", razorpay_payment_id);
    return;
  }

  const cfg   = PLAN_CONFIG[planId] || { days: Number(durationDays) };
  const days  = cfg.days;
  const amount = amountPaise ? Math.round(amountPaise / 100) : 0;

  await Subscription.findOneAndUpdate(
    { userId },
    {
      userId,
      plan:              planId,
      amount,
      currency:          "INR",
      status:            "active",
      startDate:         new Date(),
      endDate:           new Date(Date.now() + days * 86_400_000),
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      grantedByAdmin:    false,
      updatedAt:         new Date(),
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Subscription active: ${planId} (${days}d) for ${userId}`);
}