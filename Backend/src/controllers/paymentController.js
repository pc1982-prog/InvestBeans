import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import { Subscription } from "../models/Subscription.model.js";

const PLAN_CONFIG = {
  foundation: { days: 365 },
  command:    { days: 30  },
  edge:       { days: 30  },
};

export const processPayment = async (req, res) => {
  try {
    const { amount, userId, planId, durationDays } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount required" });
    }
    const order = await instance.orders.create({
      amount:   Number(amount) * 100,
      currency: "INR",
      notes: { userId: userId || "", planId: planId || "", durationDays: durationDays || 30 },
    });
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("processPayment:", err.message);
    return res.status(500).json({ success: false, message: "Order creation failed." });
  }
};

export const getKey = async (_req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

export const paymentVerification = async (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:8080";
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.redirect(`${frontendURL}/paymentsuccess?error=missing_fields`);
    }
    const body     = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body).digest("hex");
    if (expected !== razorpay_signature) {
      console.error("Signature mismatch:", razorpay_order_id);
      return res.redirect(`${frontendURL}/paymentsuccess?error=verification_failed`);
    }
    await processVerifiedPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    return res.redirect(`${frontendURL}/paymentsuccess?reference=${razorpay_payment_id}`);
  } catch (err) {
    console.error("paymentVerification:", err.message);
    return res.redirect(`${frontendURL}/paymentsuccess?error=processing_failed`);
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(500).send("Webhook secret not configured");
    const receivedSig = req.headers["x-razorpay-signature"];
    const expectedSig = crypto.createHmac("sha256", webhookSecret).update(req.body).digest("hex");
    if (receivedSig !== expectedSig) return res.status(400).send("Invalid signature");
    const event = JSON.parse(req.body.toString());
    console.log("Webhook:", event.event, event.payload?.payment?.entity?.id);
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order   = await instance.orders.fetch(payment.order_id);
      const { userId, planId, durationDays = 30 } = order.notes || {};
      await processVerifiedPayment({
        razorpay_order_id: payment.order_id, razorpay_payment_id: payment.id,
        razorpay_signature: "webhook-verified-" + payment.id,
        userId, planId, durationDays, amountPaise: payment.amount,
      });
    }
    if (event.event === "payment.failed") {
      console.warn("Payment failed:", event.payload.payment.entity.order_id);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(200).json({ received: true, error: err.message });
  }
};

// ─── Core: called by both callback + webhook (idempotent) ────────────────────
// KEY FIX: filter is { userId, plan } NOT just { userId }
// → Multiple plans per user preserved
// → Same plan renewal: endDate extended
// → Different plan: new doc created
async function processVerifiedPayment({
  razorpay_order_id, razorpay_payment_id, razorpay_signature,
  userId, planId, durationDays, amountPaise,
}) {
  try {
    await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    console.log("Payment saved:", razorpay_payment_id);
  } catch (err) {
    if (err.code === 11000) { console.log("Already processed:", razorpay_payment_id); return; }
    throw err;
  }

  let resolvedUserId = userId, resolvedPlanId = planId;
  let resolvedDays = durationDays ? Number(durationDays) : 30;
  let resolvedAmount = amountPaise;

  if (!resolvedUserId || !resolvedPlanId) {
    try {
      const order    = await instance.orders.fetch(razorpay_order_id);
      resolvedUserId = order.notes?.userId;
      resolvedPlanId = order.notes?.planId;
      resolvedDays   = Number(order.notes?.durationDays) || 30;
      resolvedAmount = resolvedAmount || order.amount;
    } catch (e) { console.warn("Could not fetch order notes:", e.message); return; }
  }

  if (!resolvedUserId || !resolvedPlanId) {
    console.warn("Missing userId/planId for:", razorpay_payment_id); return;
  }

  const cfg    = PLAN_CONFIG[resolvedPlanId] || { days: resolvedDays };
  const days   = cfg.days;
  const amount = resolvedAmount ? Math.round(resolvedAmount / 100) : 0;
  const now    = new Date();

  // Check: is same plan already active?
  const existingActive = await Subscription.findOne({
    userId:  resolvedUserId,
    plan:    resolvedPlanId,
    status:  "active",
    endDate: { $gt: now },
  });

  if (existingActive) {
    // RENEWAL — extend endDate from current endDate (not from today)
    const newEnd = new Date(existingActive.endDate.getTime() + days * 86_400_000);
    await Subscription.findByIdAndUpdate(existingActive._id, {
      $set: { endDate: newEnd, razorpayOrderId: razorpay_order_id,
               razorpayPaymentId: razorpay_payment_id, amount },
      $inc: { renewalCount: 1 },
    });
    console.log(`RENEWED: ${resolvedPlanId} till ${newEnd.toDateString()} for ${resolvedUserId}`);
  } else {
    // NEW PURCHASE (or re-purchase after expiry)
    await Subscription.create({
      userId: resolvedUserId, plan: resolvedPlanId, amount, currency: "INR",
      status: "active", startDate: now, purchaseDate: now,
      endDate: new Date(now.getTime() + days * 86_400_000),
      razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
      grantedByAdmin: false, renewalCount: 0,
    });
    console.log(`CREATED: ${resolvedPlanId} (${days}d) for ${resolvedUserId}`);
  }
}