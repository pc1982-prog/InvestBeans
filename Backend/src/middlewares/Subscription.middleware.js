

import { Subscription } from "../models/Subscription.model.js";

export const verifySubscription = async (req, res, next) => {
  try {
    // Guest user — no token, not subscribed
    if (!req.user?._id) {
      req.isSubscriber    = false;
      req.activePlans     = [];
      req.subscriptionPlan = null;
      return next();
    }

    // Fetch ALL active subscriptions for this user
    // One query — returns all plans user has purchased and not expired
    const activeSubs = await Subscription.find({
      userId:  req.user._id,
      status:  "active",
      endDate: { $gt: new Date() },
    })
      .sort({ endDate: -1 }) // latest expiry first
      .lean();

    req.isSubscriber     = activeSubs.length > 0;
    req.activePlans      = activeSubs.map(s => s.plan); // ["foundation", "command"]
    req.subscriptionPlan = activeSubs[0]?.plan ?? null; // primary plan (backward compat)
    req.subscriptions    = activeSubs;                  // full docs if needed

    next();
  } catch (err) {
    console.error("verifySubscription error:", err.message);
    req.isSubscriber     = false;
    req.activePlans      = [];
    req.subscriptionPlan = null;
    next();
  }
};

// ─── Plan-specific middleware factory ─────────────────────────────────────────
// Usage: router.get("/command-data", verifySubscription, requirePlan("command"), handler)
// Returns 403 if user doesn't have this specific plan active
export const requirePlan = (planId) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Login required" });
  }
  if (!req.activePlans?.includes(planId)) {
    return res.status(403).json({
      success: false,
      message: `${planId} subscription required`,
      requiredPlan: planId,
      activePlans:  req.activePlans || [],
      upgradeUrl:   `/plans/${planId}/checkout`,
    });
  }
  next();
};

// ─── Any subscriber check ─────────────────────────────────────────────────────
// Blocks completely if no active subscription at all
export const requireAnySubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Login required" });
  }
  if (!req.isSubscriber) {
    return res.status(403).json({
      success: false,
      message: "Active subscription required",
      activePlans: [],
      upgradeUrl:  "/plans",
    });
  }
  next();
};