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

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID format");
        }

        const user = await User.findById(userId);
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            "Something went wrong while generating tokens",
            [error.message]
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Name is required");
    }
    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
    }
    if (!password || password.trim() === "") {
        throw new ApiError(400, "Password is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const existedUser = await User.findOne({ email: email.toLowerCase() });

    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user. Please try again");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User does not exist with this email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

    let userData;
    
    if (typeof user.toObject === 'function') {
        userData = user.toObject();
    } else if (user._doc) {
        userData = user._doc;
    } else {
        userData = user;
    }

    const { password, refreshToken, __v, resetPasswordToken, resetPasswordExpires, ...safeUserData } = userData;

    const normalizedData = {
        ...safeUserData,
        isAdmin,
        name: safeUserData.name || safeUserData.displayName || 'User'
    };

    // Subscription fetch karo — admin grant ya payment dono se aata hai
    const subscription = await Subscription.findOne({
        userId: user._id,
        status: "active",
        endDate: { $gt: new Date() },
    }).select("plan status endDate startDate amount daysRemaining").lean();

    const daysRemaining = subscription?.endDate
        ? Math.max(0, Math.ceil((new Date(subscription.endDate) - Date.now()) / 86_400_000))
        : 0;

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                ...normalizedData,
                subscription: subscription
                    ? {
                        plan: subscription.plan,
                        status: subscription.status,
                        startDate: subscription.startDate,
                        endDate: subscription.endDate,
                        amount: subscription.amount,
                        daysRemaining,
                        hasAccess: true,
                      }
                    : null,
                hasSubscription: !!subscription,
            },
            "Current user fetched successfully"
        ));
});

//  NEW: Forgot Password - Send reset email
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        // Don't reveal if user exists or not (security best practice)
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {},
                "If an account exists with this email, a password reset link has been sent"
            ));
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        // Send reset email
        await sendPasswordResetEmail(user.email, resetToken, user.name);

        console.log(`âœ… Password reset email sent to: ${user.email}`);
        console.log(`ðŸ”— Reset token (for dev): ${resetToken}`);

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { email: user.email },
                "Password reset link has been sent to your email"
            ));
    } catch (error) {
        // If email fails, clear the reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        console.error('âŒ Error sending reset email:', error);
        throw new ApiError(500, "Failed to send reset email. Please try again later.");
    }
});

// âœ… NEW: Verify Reset Token (optional - for frontend validation)
const verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(400, "Reset token is required");
    }

    // Hash the token to compare with database
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Reset link is invalid or has expired");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { valid: true }, "Reset token is valid"));
});

// âœ… NEW: Reset Password - Update password with token
const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new ApiError(400, "Token and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Hash the token to compare with database
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Reset link is invalid or has expired");
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Clear refresh token for security
    user.refreshToken = undefined;

    await user.save();

    console.log(`âœ… Password reset successful for: ${user.email}`);

    // Send confirmation email (optional)
    try {
        await sendPasswordResetConfirmation(user.email, user.name);
    } catch (error) {
        console.error('âš ï¸ Failed to send confirmation email:', error);
        // Don't throw error - password was already reset
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password has been reset successfully. You can now sign in with your new password."
        ));
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