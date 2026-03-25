// routes/insight.routes.js — UPDATED
// Fix: /:id route pe verifyJWT hatao — guest users bhi modal dekh sakein
// verifySubscription khud JWT check karta hai aur subscription verify karta hai
// Non-subscriber/guest ko modal dikhega, andar locked sections honge

import { Router } from "express";
import {
  createInsight, getAllInsights, getInsightById,
  updateInsight, deleteInsight, getAdminInsights,
  getInsightStats, togglePublishStatus, toggleLike,
} from "../controllers/insight.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifySubscription } from "../middlewares/Subscription.middleware.js";
import { validateInsight, validateMongoId } from "../middlewares/validation.middleware.js";
import {
  optionalAuth,
  checkSubscription,
} from "../middlewares/Stripinsightfornonsubscriber.middleware.js";

const router = Router();

// Public list
router.route("/").get(optionalAuth, checkSubscription, getAllInsights);

// Admin routes
router.route("/admin/create").post(verifyJWT, verifyAdmin, validateInsight, createInsight);
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAdminInsights);
router.route("/admin/stats").get(verifyJWT, verifyAdmin, getInsightStats);

router.route("/admin/:id")
  .put(verifyJWT, verifyAdmin, validateMongoId("id"), validateInsight, updateInsight)
  .delete(verifyJWT, verifyAdmin, validateMongoId("id"), deleteInsight);

router.route("/admin/:id/toggle-publish")
  .patch(verifyJWT, verifyAdmin, validateMongoId("id"), togglePublishStatus);

// Like — login required (ye sahi hai)
router.route("/:id/like").post(verifyJWT, validateMongoId("id"), toggleLike);

// ✅ FIXED: verifyJWT hataya — optionalAuth use karo
// Guest aur non-subscriber dono modal dekh sakenge
// verifySubscription decide karega kya strip karna hai
router.route("/:id").get(optionalAuth, verifySubscription, validateMongoId("id"), getInsightById);

export default router;