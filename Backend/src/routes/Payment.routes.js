// routes/Payment.routes.js
// ✅ IMPORTANT: Webhook route uses express.raw() — must come BEFORE express.json() middleware
// In app.js make sure this router is imported and registered BEFORE express.json() is applied,
// OR use the per-route raw body parser below (which is safer and what we do here).

import express from "express";
import {
  getKey,
  paymentVerification,
  processPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// ── Standard routes (use parsed JSON body from app.js) ────────────────────────
router.route("/payment/process").post(processPayment);
router.route("/getKey").get(getKey);
router.route("/paymentVerification").post(paymentVerification);

// ── Webhook route ─────────────────────────────────────────────────────────────
// express.raw() here overrides app.js's express.json() for this route only.
// Razorpay sends raw body — we need it as Buffer to verify HMAC signature.
// If you JSON-parse it first, the signature check WILL FAIL.
//
// Setup in Razorpay Dashboard:
//   Settings → Webhooks → Add new webhook
//   URL: https://yourdomain.com/api/v1/payment/webhook
//   Secret: same as RAZORPAY_WEBHOOK_SECRET in .env
//   Active events: payment.captured, payment.failed, order.paid
router.route("/payment/webhook").post(
  express.raw({ type: "application/json" }),
  paymentWebhook
);

export default router;