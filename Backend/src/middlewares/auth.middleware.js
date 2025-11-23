import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

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
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

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