import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    getCurrentUser,
    getGoogleProfile,
    googleLogout,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Regular auth routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Google auth routes - NO verifyJWT middleware, uses passport session
router.route("/google-profile").get(getGoogleProfile);
router.route("/google-logout").post(googleLogout);

export default router;