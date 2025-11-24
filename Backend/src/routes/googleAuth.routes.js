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


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/signin?error=google_auth_failed",
  }),
  async (req, res) => {
    console.log(' Google OAuth successful');
    console.log(' User:', req.user.email);
    console.log(' Session ID before regenerate:', req.sessionID);

    try {
 
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error(' Session save failed:', err);
            reject(err);
          } else {
            console.log(' Session saved to database');
            console.log(' Final Session ID:', req.sessionID);
            resolve();
          }
        });
      });

    
      console.log(' Cookie should be set:', {
        name: 'investbeans.sid',
        value: req.sessionID,
        httpOnly: true,
        sameSite: 'lax'
      });

      const redirectUrl = `${process.env.FRONTEND_URL}?googleAuth=success`;
      console.log(' Redirecting to:', redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(' Callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/signin?error=session_failed`);
    }
  }
);

router.get("/profile", getGoogleProfile);


router.post("/logout", googleLogout);


router.get("/test-session", testSession);

export default router;