// controllers/user.controller.js
// ✅ Updated: activatePendingSubscription helper added
//            Called on BOTH register and login — auto-activates admin-granted pending plans

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";
import { ADMIN_EMAILS } from "../middlewares/admin.middleware.js";
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from "../utils/email.utils.js";
import { Subscription } from "../models/Subscription.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: pending_email subscription ko activate karo
// Jab user register ya login kare — agar admin ne pehle unhe grant kiya tha
// ─────────────────────────────────────────────────────────────────────────────
const activatePendingSubscription = async (userId, email) => {
  try {
    const pending = await Subscription.findOne({
      email:  email.toLowerCase(),
      userId: null,
      status: "pending_email",
    });

    if (pending) {
      pending.userId = userId;
      pending.status = "active";
      await pending.save();
      console.log(`✅ Pending subscription activated for: ${email} → userId: ${userId}`);
    }
  } catch (err) {
    // Subscription fail ho toh bhi login/register fail mat karo
    // Sirf log karo — user ka experience affect nahi hona chahiye
    console.error("⚠️ Could not activate pending subscription:", err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Token generation
// ─────────────────────────────────────────────────────────────────────────────
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID format");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken  = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong while generating tokens", [error.message]);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/register
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "")     throw new ApiError(400, "Name is required");
  if (!email || email.trim() === "")   throw new ApiError(400, "Email is required");
  if (!password || password.trim() === "") throw new ApiError(400, "Password is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))         throw new ApiError(400, "Invalid email format");
  if (password.length < 6)             throw new ApiError(400, "Password must be at least 6 characters long");

  const existedUser = await User.findOne({ email: email.toLowerCase() });
  if (existedUser)                     throw new ApiError(409, "User with this email already exists");

  const user = await User.create({
    name:  name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Failed to create user. Please try again");

  // ✅ NEW: Check karo — agar admin ne pehle is email ko subscription di thi
  await activatePendingSubscription(createdUser._id, createdUser.email);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/login
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email)    throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, "User does not exist with this email");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  // ✅ NEW: Check karo — agar admin ne pehle is email ko subscription di thi
  // Login hone se pehle activate karo taaki getCurrentUser mein turant dikh jaye
  await activatePendingSubscription(user._id, user.email);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/logout
// ─────────────────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/refresh-token
// ─────────────────────────────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user)                                         throw new ApiError(401, "Invalid refresh token");
    if (incomingRefreshToken !== user?.refreshToken)   throw new ApiError(401, "Refresh token is expired or used");

    const options = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/users/current-user
// ─────────────────────────────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "User not found");

  const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

  let userData;
  if (typeof user.toObject === "function") userData = user.toObject();
  else if (user._doc)                       userData = user._doc;
  else                                      userData = user;

  const { password, refreshToken, __v, resetPasswordToken, resetPasswordExpires, ...safeUserData } = userData;

  const normalizedData = {
    ...safeUserData,
    isAdmin,
    name: safeUserData.name || safeUserData.displayName || "User",
  };

  const subscription = await Subscription.findOne({
    userId: user._id,
    status: "active",
    endDate: { $gt: new Date() },
  }).select("plan status endDate startDate amount daysRemaining").lean();

  const daysRemaining = subscription?.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate) - Date.now()) / 86_400_000))
    : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...normalizedData,
        subscription: subscription
          ? {
              plan:        subscription.plan,
              status:      subscription.status,
              startDate:   subscription.startDate,
              endDate:     subscription.endDate,
              amount:      subscription.amount,
              daysRemaining,
              hasAccess:   true,
            }
          : null,
        hasSubscription: !!subscription,
      },
      "Current user fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/forgot-password
// ─────────────────────────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    // Security: user exist karta hai ya nahi, reveal mat karo
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If an account exists with this email, a password reset link has been sent"));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken, user.name);
    console.log(`✅ Password reset email sent to: ${user.email}`);

    return res
      .status(200)
      .json(new ApiResponse(200, { email: user.email }, "Password reset link has been sent to your email"));
  } catch (error) {
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error("❌ Error sending reset email:", error);
    throw new ApiError(500, "Failed to send reset email. Please try again later.");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/users/verify-reset-token/:token
// ─────────────────────────────────────────────────────────────────────────────
const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) throw new ApiError(400, "Reset token is required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:   hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  return res.status(200).json(new ApiResponse(200, { valid: true }, "Reset token is valid"));
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/users/reset-password
// ─────────────────────────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) throw new ApiError(400, "Token and new password are required");
  if (newPassword.length < 6) throw new ApiError(400, "Password must be at least 6 characters long");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:   hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.password             = newPassword;
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken         = undefined; // Security: existing sessions invalidate

  await user.save();
  console.log(`✅ Password reset successful for: ${user.email}`);

  try {
    await sendPasswordResetConfirmation(user.email, user.name);
  } catch (error) {
    console.error("⚠️ Failed to send confirmation email:", error);
    // Don't throw — password already reset
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been reset successfully. You can now sign in with your new password."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};