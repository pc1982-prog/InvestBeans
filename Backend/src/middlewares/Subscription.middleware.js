// middlewares/Subscription.middleware.js — UPDATED
// Fix: req.user null ho (guest) to crash mat karo
// Guest aur non-subscriber dono ko req.isSubscriber = false milega
// Controller mein isSubscriber check karke data strip hoga

import { Subscription } from "../models/Subscription.model.js";

export const verifySubscription = async (req, res, next) => {
  try {
    // ✅ Guest user — no token, no subscription
    // Block mat karo, bas flag set karo
    if (!req.user?._id) {
      req.isSubscriber = false;
      req.subscriptionPlan = null;
      return next(); // modal dikhega, andar locked sections honge
    }

    // Logged in user — subscription check karo
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    }).lean();

    req.isSubscriber = !!subscription;
    req.subscriptionPlan = subscription?.plan ?? null;

    next();
  } catch (err) {
    // Error pe bhi block mat karo — gracefully degrade karo
    console.error("verifySubscription error:", err.message);
    req.isSubscriber = false;
    req.subscriptionPlan = null;
    next();
  }
};