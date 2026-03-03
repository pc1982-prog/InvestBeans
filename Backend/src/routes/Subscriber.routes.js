import express from "express";
import {
  subscribeNewsletter,
  checkSubscription,
  unsubscribe,
} from "../controllers/Subscriber.controller.js";

const router = express.Router();

// POST   /api/v1/subscribe           → Subscribe with email
router.post("/", subscribeNewsletter);

// GET    /api/v1/subscribe/check     → Check if email is already subscribed
router.get("/check", checkSubscription);

// DELETE /api/v1/subscribe/unsubscribe → Unsubscribe
router.delete("/unsubscribe", unsubscribe);

export default router;