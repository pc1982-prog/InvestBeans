
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type:    mongoose.Schema.Types.ObjectId,
      index:   true,
      default: null,
    },
    email: {
      type:      String,
      default:   null,
      index:     true,
      lowercase: true,
      trim:      true,
    },
    plan: {
      type:     String,
      enum:     ["free", "foundation", "command", "edge", "basic", "pro", "elite"],
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
    // ✅ NEW: Track original purchase date separately from startDate
    // (useful when endDate is extended on renewal — purchaseDate stays original)
    purchaseDate: {
      type:    Date,
      default: Date.now,
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
    // ✅ NEW: Renewal count — kitni baar extend hua
    renewalCount: {
      type:    Number,
      default: 0,
      min:     0,
    },
  },
  { timestamps: true }
);

// ✅ Compound indexes
subscriptionSchema.index({ userId: 1, plan: 1, status: 1, endDate: 1 }); // active plan lookup
subscriptionSchema.index({ userId: 1, status: 1, endDate: 1 });           // all active subscriptions
subscriptionSchema.index({ email: 1, status: 1 });                        // pending_email activation
subscriptionSchema.index({ razorpayPaymentId: 1 }, { sparse: true });     // payment lookup

// Virtual: days remaining for this subscription
subscriptionSchema.virtual("daysRemaining").get(function () {
  if (!this.endDate) return 0;
  return Math.max(0, Math.ceil((this.endDate - Date.now()) / 86_400_000));
});

// Virtual: is this subscription currently active?
subscriptionSchema.virtual("isCurrentlyActive").get(function () {
  return this.status === "active" && this.endDate > new Date();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);