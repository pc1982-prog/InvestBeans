import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    getCurrentUser,
    forgotPassword,
    verifyResetToken,
    resetPassword,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// ✅ NEW: Password reset routes
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-reset-token/:token").get(verifyResetToken);
router.route("/reset-password").post(resetPassword);


export default router;