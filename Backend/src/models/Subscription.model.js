// models/subscription.model.js
// ✅ Added userId index — critical for performance at scale
// Without it: every verifySubscription call does full collection scan

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      required: true,
      index:    true, // ✅ PERFORMANCE — fast lookup by user
    },
    plan: {
      type:    String,
      enum:    ["free", "foundation", "command", "edge", "basic", "pro", "elite"],
      default: "free",
      required: true,
    },
    amount: {
      type:    Number,
      default: 0,
      min:     0,
    },
    currency: {
      type:    String,
      default: "INR",
    },
    status: {
      type:    String,
      enum:    ["active", "expired", "revoked", "pending", "failed"],
      default: "pending",
      index:   true, // ✅ Fast filter by status
    },
    startDate: {
      type:    Date,
      default: Date.now,
    },
    endDate: {
      type:     Date,
      required: true,
      index:    true, // ✅ Fast expiry checks
    },
    razorpayOrderId: {
      type:    String,
      default: null,
    },
    razorpayPaymentId: {
      type:    String,
      default: null,
      index:   true,
    },
    grantedByAdmin: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Compound index — most common query pattern in verifySubscription middleware
subscriptionSchema.index({ userId: 1, status: 1, endDate: 1 });

// Virtual: days remaining
subscriptionSchema.virtual("daysRemaining").get(function () {
  if (!this.endDate) return 0;
  return Math.max(0, Math.ceil((this.endDate - Date.now()) / 86_400_000));
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);