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
  // Fetch all Google OAuth users
  const googleUsers = await GoogleAuth.find()
    .select("-refreshToken -__v")
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all regular (email/password) users
  const regularUsers = await User.find()
    .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires -__v")
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all subscriptions
  const subscriptions = await Subscription.find().lean();

  // Build a subscription map keyed by userId string
  const subMap = {};
  for (const sub of subscriptions) {
    subMap[sub.userId.toString()] = sub;
  }

  // Normalise Google users
  const normalisedGoogle = googleUsers.map((u) => {
    const sub = subMap[u._id.toString()] || null;
    return {
      _id: u._id,
      name: u.displayName || "—",
      email: u.email,
      image: u.image || null,
      authType: "google",
      isAdmin: ADMIN_EMAILS.includes((u.email || "").toLowerCase()),
      createdAt: u.createdAt,
      subscription: sub
        ? {
            plan: sub.plan,
            amount: sub.amount,
            currency: sub.currency || "INR",
            status: sub.status,
            startDate: sub.startDate,
            endDate: sub.endDate,
            daysRemaining: Math.max(
              0,
              Math.ceil((new Date(sub.endDate) - Date.now()) / 86_400_000)
            ),
            razorpayPaymentId: sub.razorpayPaymentId || null,
          }
        : null,
    };
  });

  // Normalise regular users
  const normalisedRegular = regularUsers.map((u) => {
    const sub = subMap[u._id.toString()] || null;
    return {
      _id: u._id,
      name: u.name || "—",
      email: u.email,
      image: null,
      authType: "email",
      isAdmin: ADMIN_EMAILS.includes((u.email || "").toLowerCase()),
      createdAt: u.createdAt,
      subscription: sub
        ? {
            plan: sub.plan,
            amount: sub.amount,
            currency: sub.currency || "INR",
            status: sub.status,
            startDate: sub.startDate,
            endDate: sub.endDate,
            daysRemaining: Math.max(
              0,
              Math.ceil((new Date(sub.endDate) - Date.now()) / 86_400_000)
            ),
            razorpayPaymentId: sub.razorpayPaymentId || null,
          }
        : null,
    };
  });

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

  const totalRevenue = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);

  const planBreakdown = subscriptions.reduce((acc, s) => {
    acc[s.plan] = (acc[s.plan] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers: googleCount + regularCount,
        googleUsers: googleCount,
        emailUsers: regularCount,
        activeSubscriptions: activeSubscriptions.length,
        totalSubscriptions: subscriptions.length,
        totalRevenue,
        planBreakdown,
      },
      "Stats fetched"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/admin/subscription/:userId  →  Manually grant / extend subscription
// ─────────────────────────────────────────────────────────────────────────────
export const grantSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { plan = "pro", durationDays = 30, amount = 0 } = req.body;

  const startDate = new Date();
  const endDate = new Date(Date.now() + durationDays * 86_400_000);

  const sub = await Subscription.findOneAndUpdate(
    { userId },
    {
      userId,
      plan,
      amount,
      currency: "INR",
      status: "active",
      startDate,
      endDate,
      grantedByAdmin: true,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, sub, `Subscription granted (${plan}, ${durationDays} days)`)
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