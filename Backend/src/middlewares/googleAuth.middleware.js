import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyGoogleSession = asyncHandler(async (req, res, next) => {
  console.log('Verifying Google session');
  console.log('Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('Has user:', !!req.user);


  if (!req.isAuthenticated() || !req.user) {
    console.log(' Google session verification failed');
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  console.log(' Google session verified for:', req.user.email);
  next();
});


export const checkGoogleSession = (req, res, next) => {
  req.isGoogleAuthenticated = req.isAuthenticated() && !!req.user;
  console.log('🔍 Google auth check:', req.isGoogleAuthenticated);
  next();
};