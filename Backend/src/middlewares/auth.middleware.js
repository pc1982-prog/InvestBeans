import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import GoogleAuth from "../models/googleAuth.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

 
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                throw new ApiError(401, "Access token has expired");
            }
            throw new ApiError(401, "Invalid access token");
        }

        // Find user
        // const user = await User.findById(decodedToken?._id).select(
        //     "-password -refreshToken"
        // );
        let user = await GoogleAuth.findById(decodedToken?._id).select('-refreshToken -__v');
  if (!user) {
    user = await User.findById(decodedToken?._id).select('-password -refreshToken');
  }

        if (!user) {
            throw new ApiError(401, "Invalid access token - user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, error?.message || "Authentication failed");
    }
});

// Verify JWT or Google Session (for endpoints that support both)
export const verifyJWTOrSession = asyncHandler(async (req, res, next) => {
    try {
        // First try JWT token
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            try {
                let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                
                // Try to find as GoogleAuth user first (for Google OAuth)
                let user = await GoogleAuth.findById(decodedToken?._id).select("-refreshToken -__v");
                
                // If not found, try as regular User
                if (!user) {
                    user = await User.findById(decodedToken?._id).select("-password -refreshToken");
                }

                if (!user) {
                    throw new ApiError(401, "Invalid access token - user not found");
                }

                req.user = user;
                return next();
            } catch (jwtError) {
                if (jwtError instanceof ApiError) throw jwtError;
                // JWT verification failed, try session
                console.log(' JWT verification failed, trying session auth');
            }
        }

        // Fallback to session-based authentication
        if (!req.isAuthenticated() || !req.user) {
            throw new ApiError(401, "Access token is required");
        }

        console.log(' Using session-based auth for user:', req.user.email);
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, error?.message || "Authentication failed");
    }

    
});


// auth.middleware.js mein add karo — neeche existing code ke baad

export const optionalJWT = async (req, res, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        req.user = null;
        return next();
      }
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded?._id).select("-password -refreshToken");
      req.user = user || null;
    } catch {
      req.user = null; // expired/invalid token — treat as guest
    }
    next();
  };