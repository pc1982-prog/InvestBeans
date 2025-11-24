import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import GoogleAuth from "../models/googleAuth.model.js";
import { ADMIN_EMAILS } from "../middlewares/admin.middleware.js";


export const getGoogleProfile = asyncHandler(async (req, res) => {

  if (!req.isAuthenticated() || !req.user) {
    console.log(' Not authenticated or no user in session');
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  try {
   
    const googleUser = await GoogleAuth.findById(req.user._id).select('-__v');

    if (!googleUser) {
      console.log(' Google user not found for ID:', req.user._id);
      throw new ApiError(404, "User not found");
    }


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

    console.log(' Sending Google profile:', {
      email: userData.email,
      isAdmin: userData.isAdmin,
      sessionId: req.sessionID
    });

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "Profile fetched successfully"));

  } catch (error) {
    console.error(' Error fetching Google profile:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(500, "Failed to fetch profile. Please try again.");
  }
});

export const googleLogout = asyncHandler(async (req, res) => {
  console.log(' Google logout initiated');
  console.log(' Session ID:', req.sessionID);
  console.log('User:', req.user?.email || 'No user');

  try {
    
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) {
          console.error(" Passport logout error:", err);
          reject(err);
        } else {
          console.log(' Passport logout successful');
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error(" Session destroy error:", err);
          reject(err);
        } else {
          console.log(' Session destroyed');
          resolve();
        }
      });
    });

   
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    };

    res.clearCookie('investbeans.sid', cookieOptions);

    console.log(' Google logout completed');

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Logged out successfully"));

  } catch (error) {
    console.error(' Logout error:', error);
    

    res.clearCookie('investbeans.sid', { path: '/' });
    
    throw new ApiError(500, "Logout failed. Please try again.");
  }
});

export const testSession = asyncHandler(async (req, res) => {
  const sessionData = {
    sessionId: req.sessionID,
    authenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    user: req.user ? {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.displayName,
    } : null,
    cookies: Object.keys(req.cookies),
    sessionData: req.session
  };

  console.log('🧪 Session test:', sessionData);

  return res
    .status(200)
    .json(new ApiResponse(200, sessionData, "Session data retrieved"));
});