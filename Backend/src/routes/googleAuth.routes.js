// routes/googleAuth.routes.js
// ✅ Updated: Google OAuth callback mein pending_email subscription auto-activate karo

import { Router } from "express";
import passport from "passport";
import {
  getGoogleProfile,
  googleLogout,
  testSession,
} from "../controllers/googleAuth.controller.js";
import { Subscription } from "../models/Subscription.model.js"; // ← NEW IMPORT

const router = Router();

// ── Google OAuth initiate ──────────────────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope:  ["profile", "email"],
    prompt: "select_account",
  })
);

// ── Google OAuth callback ──────────────────────────────────────────────────
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=google_auth_failed`,
  }),
  async (req, res) => {
    console.log("✅ Google OAuth successful");
    console.log("📧 User:", req.user.email);

    try {
      const accessToken  = req.user.generateAccessToken();
      const refreshToken = req.user.generateRefreshToken();

      req.user.refreshToken = refreshToken;
      await req.user.save({ validateBeforeSave: false });

      // ✅ NEW: pending_email subscription check karo
      // Agar admin ne pehle is email ko subscription di thi (user registered nahi tha)
      // Ab user Google se login kar raha hai → automatically activate karo
      try {
        const pending = await Subscription.findOne({
          email:  req.user.email.toLowerCase(),
          userId: null,
          status: "pending_email",
        });

        if (pending) {
          pending.userId = req.user._id;
          pending.status = "active";
          await pending.save();
          console.log(`✅ Pending subscription activated for Google user: ${req.user.email}`);
        }
      } catch (subErr) {
        // Subscription activate fail ho toh bhi login continue karo
        console.error("⚠️ Pending subscription activation failed:", subErr.message);
      }

      // Save session
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const frontendURL = process.env.FRONTEND_URL || "http://localhost:8080";
      const redirectUrl = `${frontendURL}/?googleAuth=success&accessToken=${accessToken}&refreshToken=${refreshToken}`;

      console.log("🔄 Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error("❌ Callback error:", error);
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:8080";
      res.redirect(`${frontendURL}/signin?error=session_failed`);
    }
  }
);

// ── Profile, Logout, Session test ─────────────────────────────────────────
router.get("/profile",       getGoogleProfile);
router.post("/logout",       googleLogout);
router.get("/test-session",  testSession);

export default router;