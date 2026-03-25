// models/Subscription.model.js
// ✅ Updated: email field added, userId optional, pending_email status added
// This allows admin to grant subscription to any email — even before user registers

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type:    mongoose.Schema.Types.ObjectId,
      index:   true,
      default: null,  // ✅ null allowed when admin grants by email before user registers
    },
    email: {
      type:      String,
      default:   null,
      index:     true,  // ✅ Fast lookup when user logs in for first time
      lowercase: true,
      trim:      true,
    },
    plan: {
      type:     String,
      enum:     ["free", "foundation", "command", "edge", "basic", "pro", "elite"],
      default:  "free",
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
      type:  String,
      enum:  ["active", "expired", "revoked", "pending", "failed", "pending_email"],
      //                                                              ↑ NEW STATUS
      // pending_email = admin ne email se grant kiya, user abhi registered nahi
      // Jab user register/login karega → automatically "active" ho jayega
      default: "pending",
      index:   true,
    },
    startDate: {
      type:    Date,
      default: Date.now,
    },
    endDate: {
      type:     Date,
      required: true,
      index:    true,
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

// ✅ Compound indexes — fast queries
subscriptionSchema.index({ userId: 1, status: 1, endDate: 1 }); // verifySubscription main query
subscriptionSchema.index({ email: 1, status: 1 });               // pending_email activation lookup

// Virtual: days remaining
subscriptionSchema.virtual("daysRemaining").get(function () {
  if (!this.endDate) return 0;
  return Math.max(0, Math.ceil((this.endDate - Date.now()) / 86_400_000));
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);