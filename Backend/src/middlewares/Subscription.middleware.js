// middlewares/subscription.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/Subscription.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// HARD BLOCK — 403 if no active subscription
// Use this on routes where data should NEVER reach non-subscribers
// Even if they open Network tab in DevTools, they get nothing
// ─────────────────────────────────────────────────────────────────────────────
export const verifySubscription = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Login required");
  }

  const sub = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
    endDate: { $gt: new Date() },
  });

  if (!sub) {
    throw new ApiError(
      403,
      "Active subscription required to access this content"
    );
  }

  req.subscription = sub;
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// SOFT CHECK — attach subscription info to req, don't block
// Use this when you want to return partial data to non-subscribers
// (e.g. summary free hai, full insight locked hai)
// ─────────────────────────────────────────────────────────────────────────────
export const checkSubscription = asyncHandler(async (req, res, next) => {
  req.hasSubscription = false;
  req.subscription = null;

  if (req.user) {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (sub) {
      req.hasSubscription = true;
      req.subscription = sub;
    }
  }

  next();
});