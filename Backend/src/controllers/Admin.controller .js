// controllers/Admin.controller.js
// ✅ Updated: grantSubscription now accepts BOTH userId and email
// Admin can grant to any email — even if user hasn't registered yet

import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import GoogleAuth from "../models/googleAuth.model.js";
import { Subscription } from "../models/Subscription.model.js";
import { ADMIN_EMAILS } from "../middlewares/admin.middleware.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/admin/users  →  All users (Google + regular) with subscriptions
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const googleUsers = await GoogleAuth.find()
    .select("-refreshToken -__v")
    .sort({ createdAt: -1 })
    .lean();

  const regularUsers = await User.find()
    .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires -__v")
    .sort({ createdAt: -1 })
    .lean();

  const subscriptions = await Subscription.find().lean();

  // Build subscription map keyed by userId string
  const subMap = {};
  for (const sub of subscriptions) {
    if (sub.userId) {
      subMap[sub.userId.toString()] = sub;
    }
  }

  const formatSub = (sub) => sub ? {
    plan:              sub.plan,
    amount:            sub.amount,
    currency:          sub.currency || "INR",
    status:            sub.status,
    startDate:         sub.startDate,
    endDate:           sub.endDate,
    daysRemaining:     Math.max(0, Math.ceil((new Date(sub.endDate) - Date.now()) / 86_400_000)),
    razorpayPaymentId: sub.razorpayPaymentId || null,
  } : null;

  const normalisedGoogle = googleUsers.map((u) => ({
    _id:          u._id,
    name:         u.displayName || "—",
    email:        u.email,
    image:        u.image || null,
    authType:     "google",
    isAdmin:      ADMIN_EMAILS.includes((u.email || "").toLowerCase()),
    createdAt:    u.createdAt,
    subscription: formatSub(subMap[u._id.toString()] || null),
  }));

  const normalisedRegular = regularUsers.map((u) => ({
    _id:          u._id,
    name:         u.name || "—",
    email:        u.email,
    image:        null,
    authType:     "email",
    isAdmin:      ADMIN_EMAILS.includes((u.email || "").toLowerCase()),
    createdAt:    u.createdAt,
    subscription: formatSub(subMap[u._id.toString()] || null),
  }));

  const allUsers = [...normalisedGoogle, ...normalisedRegular].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.status(200).json(
    new ApiResponse(200, { users: allUsers, total: allUsers.length }, "Users fetched")
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/admin/stats  →  Dashboard summary numbers
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminStats = asyncHandler(async (req, res) => {
  const [googleCount, regularCount, subscriptions] = await Promise.all([
    GoogleAuth.countDocuments(),
    User.countDocuments(),
    Subscription.find().lean(),
  ]);

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active" && new Date(s.endDate) > Date.now()
  );

  // pending_email wali bhi count karo — admin ne grant ki hain
  const pendingEmailSubs = subscriptions.filter(
    (s) => s.status === "pending_email"
  );

  const totalRevenue = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);

  const planBreakdown = subscriptions.reduce((acc, s) => {
    if (s.status === "active") {
      acc[s.plan] = (acc[s.plan] || 0) + 1;
    }
    return acc;
  }, {});

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers:           googleCount + regularCount,
        googleUsers:          googleCount,
        emailUsers:           regularCount,
        activeSubscriptions:  activeSubscriptions.length,
        pendingEmailGrants:   pendingEmailSubs.length,   // ← NEW: waiting for user to register
        totalSubscriptions:   subscriptions.length,
        totalRevenue,
        planBreakdown,
      },
      "Stats fetched"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/admin/subscription/:userId
// → Existing flow: grant to a known userId (from dashboard table click)
// ─────────────────────────────────────────────────────────────────────────────
export const grantSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { plan = "pro", durationDays = 30, amount = 0 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId format");
  }

  const startDate = new Date();
  const endDate   = new Date(Date.now() + durationDays * 86_400_000);

  const sub = await Subscription.findOneAndUpdate(
    { userId },
    {
      userId,
      plan,
      amount,
      currency:       "INR",
      status:         "active",
      startDate,
      endDate,
      grantedByAdmin: true,
      updatedAt:      new Date(),
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, sub, `Subscription granted (${plan}, ${durationDays} days)`)
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/admin/subscription/grant
// → NEW FLOW: grant by email — user registered ho ya na ho, dono work karta hai
//
// CASES:
//   1. User already registered → seedha active subscription do
//   2. User not registered yet → pending_email record save karo
//                                Jab user register/login karega → auto-activate
// ─────────────────────────────────────────────────────────────────────────────
export const grantSubscriptionByEmail = asyncHandler(async (req, res) => {
  const { email: rawEmail, plan = "pro", durationDays = 30, amount = 0 } = req.body;

  if (!rawEmail || !rawEmail.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const email = rawEmail.toLowerCase().trim();

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const startDate = new Date();
  const endDate   = new Date(Date.now() + durationDays * 86_400_000);

  // ── Step 1: Check karo — kya is email ka account already exist karta hai? ──
  const googleUser  = await GoogleAuth.findOne({ email }).select("_id email").lean();
  const regularUser = !googleUser
    ? await User.findOne({ email }).select("_id email").lean()
    : null;
  const existingUser = googleUser || regularUser;

  // ── Case 1: User already registered hai ───────────────────────────────────
  if (existingUser) {
    const sub = await Subscription.findOneAndUpdate(
      { userId: existingUser._id },
      {
        userId:         existingUser._id,
        email,
        plan,
        amount,
        currency:       "INR",
        status:         "active",
        startDate,
        endDate,
        grantedByAdmin: true,
        updatedAt:      new Date(),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...sub.toObject(),
          alreadyRegistered: true,
          message: `User already registered — subscription directly activated`,
        },
        `✅ Subscription active (${plan}, ${durationDays} days) for ${email}`
      )
    );
  }

  // ── Case 2: User abhi registered nahi hai → pending_email record banao ────
  // Agar pehle se koi pending_email record hai is email ka, usse update karo
  const sub = await Subscription.findOneAndUpdate(
    { email, userId: null },   // existing pending record dhundo
    {
      email,
      userId:         null,            // account nahi hai abhi
      plan,
      amount,
      currency:       "INR",
      status:         "pending_email", // ← special status
      startDate,
      endDate,
      grantedByAdmin: true,
      updatedAt:      new Date(),
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...sub.toObject(),
        alreadyRegistered: false,
        message: `User registered nahi hai. Jab ${email} signup/login karega, plan automatically activate ho jayega.`,
      },
      `⏳ Pending subscription saved (${plan}, ${durationDays} days) for ${email}`
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/admin/pending-grants
// → NEW: All pending_email subscriptions (jinhe email se grant kiya but abhi register nahi)
// ─────────────────────────────────────────────────────────────────────────────
export const getPendingEmailGrants = asyncHandler(async (req, res) => {
  const pending = await Subscription.find({ status: "pending_email" })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { grants: pending, total: pending.length }, "Pending grants fetched")
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/admin/subscription/:userId  →  Revoke subscription
// ─────────────────────────────────────────────────────────────────────────────
export const revokeSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await Subscription.findOneAndUpdate(
    { userId },
    { status: "revoked", endDate: new Date() }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "Subscription revoked")
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/admin/pending-grant/:id
// → Pending grant cancel karo (email se)
// ─────────────────────────────────────────────────────────────────────────────
export const revokePendingGrant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid subscription ID");
  }

  await Subscription.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Pending grant removed")
  );
});