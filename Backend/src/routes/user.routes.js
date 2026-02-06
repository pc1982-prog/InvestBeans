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
// ✅ TEMPORARY: Email connection test endpoint
router.route("/test-email-connection").get(async (req, res) => {
    try {
        console.log('\n🧪 Testing email connection...');
        
        // Import at the top of the file if not already imported
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verify connection
        await transporter.verify();
        
        console.log('✅ Email connection successful!');
        
        res.json({
            success: true,
            message: 'Email connection verified successfully',
            config: {
                user: process.env.EMAIL_USER,
                passwordLength: process.env.EMAIL_PASSWORD?.length,
                environment: process.env.NODE_ENV
            }
        });
    } catch (error) {
        console.error('❌ Email connection test failed:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code,
            details: {
                user: process.env.EMAIL_USER,
                hasPassword: !!process.env.EMAIL_PASSWORD,
                passwordLength: process.env.EMAIL_PASSWORD?.length
            }
        });
    }
});

export default router;