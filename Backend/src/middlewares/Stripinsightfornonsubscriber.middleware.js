
import { Subscription } from "../models/Subscription.model.js";
import jwt from "jsonwebtoken";

// ─── Optional JWT: token ho to user attach karo, na ho to guest ──────────────
export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
  } catch {
    req.user = null; // expired/invalid token → treat as guest
  }
  next();
};

// ─── Check subscription and attach to req ────────────────────────────────────
export const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      req.isSubscriber = false;
      return next();
    }

    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    }).lean();

    req.isSubscriber = !!sub;
    req.subscriptionPlan = sub?.plan || null;
  } catch {
    req.isSubscriber = false;
  }
  next();
};

// ─── Fields jo non-subscribers ko NAHI dikhne chahiye ────────────────────────
const RESTRICTED_FIELDS = [
  "investBeansInsight",  // full AI analysis block
  // description partial strip neeche handle hogi
];

// ─── Strip helper ─────────────────────────────────────────────────────────────
export const stripInsightData = (insight, isSubscriber) => {
  if (isSubscriber) return insight; // subscriber ko sab milega

  const stripped = { ...insight };

  // 1. investBeansInsight — poora block remove
  delete stripped.investBeansInsight;

  // 2. description — sirf pehle 80 characters, baaki blur ke liye
  if (stripped.description && stripped.description.length > 80) {
    stripped.description = stripped.description.slice(0, 80);
    stripped.isDescriptionTruncated = true;
  }

  // 3. Flag lagao frontend ke liye
  stripped.isRestricted = true;

  return stripped;
};