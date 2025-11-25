import { Router } from "express";
import passport from "passport";
import {
  getGoogleProfile,
  googleLogout,
  testSession,
} from "../controllers/googleAuth.controller.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", 
  })
);


// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: process.env.FRONTEND_URL + "/signin?error=google_auth_failed",
//   }),
//   async (req, res) => {
//     console.log(' Google OAuth successful');
//     console.log(' User:', req.user.email);
//     console.log(' Session ID before regenerate:', req.sessionID);

//     try {
//       // Generate JWT tokens
//       const accessToken = req.user.generateAccessToken();
//       const refreshToken = req.user.generateRefreshToken();
      
//       console.log(' JWT Tokens generated');

//       // Save refresh token to database
//       req.user.refreshToken = refreshToken;
//       await req.user.save({ validateBeforeSave: false });
//       console.log(' Refresh token saved to database');

//       // Save session
//       await new Promise((resolve, reject) => {
//         req.session.save((err) => {
//           if (err) {
//             console.error(' Session save failed:', err);
//             reject(err);
//           } else {
//             console.log(' Session saved to database');
//             console.log(' Final Session ID:', req.sessionID);
//             resolve();
//           }
//         });
//       });

//       console.log(' Cookie should be set:', {
//         name: 'investbeans.sid',
//         value: req.sessionID,
//         httpOnly: true,
//         sameSite: 'lax'
//       });

//       // Redirect with tokens in query params (temporary, frontend will extract)
//       const redirectUrl = `${process.env.FRONTEND_URL}?googleAuth=success&accessToken=${accessToken}&refreshToken=${refreshToken}`;
//       console.log(' Redirecting to:', redirectUrl);
      
//       res.redirect(redirectUrl);
//     } catch (error) {
//       console.error(' Callback error:', error);
//       res.redirect(`${process.env.FRONTEND_URL}/signin?error=session_failed`);
//     }
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/signin?error=google_auth_failed`,
  }),
  async (req, res) => {
    console.log("✅ Google OAuth successful");
    console.log("📧 User:", req.user.email);

    try {
      const accessToken = req.user.generateAccessToken();
      const refreshToken = req.user.generateRefreshToken();

      req.user.refreshToken = refreshToken;
      await req.user.save({ validateBeforeSave: false });

      // Save session
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Redirect with tokens
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
router.get("/profile", getGoogleProfile);


router.post("/logout", googleLogout);


router.get("/test-session", testSession);

export default router;