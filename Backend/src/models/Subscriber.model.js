import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    // Optional: linked to a logged-in user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["homepage", "blog", "other"],
      default: "homepage",
    },
  },
  { timestamps: true }
);

// Index for fast lookups
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ userId: 1 });

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);