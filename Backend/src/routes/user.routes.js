import { Router } from "express";
import {
  loginUser, logoutUser, registerUser,
  refreshAccessToken, getCurrentUser,
  forgotPassword, verifyResetToken, resetPassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/validation.middleware.js";
 
const router = Router();
 
// Validation middleware controller se PEHLE lagao
router.route("/register").post(validateRegister, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
 
router.route("/forgot-password").post(validateForgotPassword, forgotPassword);
router.route("/verify-reset-token/:token").get(verifyResetToken);
router.route("/reset-password").post(validateResetPassword, resetPassword);
 
export default router;
 