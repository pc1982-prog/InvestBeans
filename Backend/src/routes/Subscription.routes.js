import { Router } from "express";
import { getMySubscriptions } from "../controllers/Subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected — user must be logged in
router.get("/my", verifyJWT, getMySubscriptions);

export default router;
