import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type:     String,
      required: true,
      index:    true,
    },
    razorpay_payment_id: {
      type:     String,
      required: true,
      unique:   true,  // ✅ FIX: Was missing — controller comment said "unique index prevents
                       // duplicates" but index wasn't actually defined. Without this,
                       // webhook + callback race condition creates duplicate subscriptions.
      index:    true,
    },
    razorpay_signature: {
      type:     String,
      required: true,
    },
  },
  { timestamps: true } // ✅ Added for audit trail (createdAt, updatedAt)
);

export const Payment = mongoose.model("Payment", paymentSchema);