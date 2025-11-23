import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import GoogleAuth from "../models/googleAuth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ADMIN_EMAILS } from "../middlewares/admin.middleware.js";

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

    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { ...user.toObject(), isAdmin },
            "Current user fetched successfully"
        ));
});

// ✅ FIXED VERSION - Explicitly check and send cookie info
const getGoogleProfile = asyncHandler(async (req, res) => {
    console.log('👤 Google profile request');
    console.log('🔑 Session ID:', req.sessionID);
    console.log('🔐 Authenticated:', req.isAuthenticated());
    console.log('👥 User in session:', req.user ? 'Yes' : 'No');
    console.log('🍪 Cookies received:', req.cookies);
    console.log('📋 Headers:', req.headers.cookie);
    
    // Check if user is authenticated via passport
    if (!req.isAuthenticated() || !req.user) {
        console.log('❌ User not authenticated - session may have expired');
        
        // ✅ Send explicit response with cookie info for debugging
        return res.status(401).json({
            success: false,
            message: "User session not found or expired",
            debug: {
                hasSession: !!req.sessionID,
                hasCookie: !!req.cookies['investbeans.sid'],
                authenticated: req.isAuthenticated()
            }
        });
    }

    try {
        // Fetch fresh user data from database
        const googleUser = await GoogleAuth.findById(req.user._id);

        if (!googleUser) {
            console.log('❌ Google user not found in database for ID:', req.user._id);
            throw new ApiError(404, "User not found");
        }

        // Check if user is admin based on ADMIN_EMAILS
        const isAdmin = ADMIN_EMAILS.includes(googleUser.email.toLowerCase());

        const userData = {
            _id: googleUser._id,
            name: googleUser.displayName,
            email: googleUser.email,
            image: googleUser.image,
            googleId: googleUser.googleId,
            createdAt: googleUser.createdAt,
            updatedAt: googleUser.updatedAt,
            isAdmin
        };

        console.log('✅ Sending Google user profile:', {
            email: userData.email,
            name: userData.name,
            hasImage: !!userData.image,
            isAdmin: userData.isAdmin,
            sessionId: req.sessionID
        });

        // ✅ Explicitly set CORS headers for cookie
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res
            .status(200)
            .json(new ApiResponse(200, userData, "Google user profile fetched successfully"));
    } catch (error) {
        console.error('❌ Error fetching Google profile:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to fetch user profile");
    }
});

const googleLogout = asyncHandler(async (req, res) => {
    console.log('🚪 Google logout called');
    console.log('🔑 Session ID before logout:', req.sessionID);
    
    try {
        // Passport logout
        await new Promise((resolve, reject) => {
            req.logout((err) => {
                if (err) {
                    console.error("❌ Passport logout error:", err);
                    reject(err);
                } else {
                    console.log('✅ Passport logout successful');
                    resolve();
                }
            });
        });

        // Destroy session
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    console.error("❌ Session destroy error:", err);
                    reject(err);
                } else {
                    console.log('✅ Session destroyed');
                    resolve();
                }
            });
        });

        // Clear session cookie
        res.clearCookie('investbeans.sid', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        console.log('✅ Google logout completed successfully');

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Logged out successfully"));
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.clearCookie('investbeans.sid', { path: '/' });
        throw new ApiError(500, "Logout failed");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    getGoogleProfile,
    googleLogout,
};