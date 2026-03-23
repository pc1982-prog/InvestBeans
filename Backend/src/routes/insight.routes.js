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
 
const router = Router();
 
// Public list
router.route("/").get(getAllInsights);
 
// Admin routes (static — /:id se pehle)
router.route("/admin/create").post(verifyJWT, verifyAdmin, validateInsight, createInsight);
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAdminInsights);
router.route("/admin/stats").get(verifyJWT, verifyAdmin, getInsightStats);
 
router.route("/admin/:id")
  .put(verifyJWT, verifyAdmin, validateMongoId("id"), validateInsight, updateInsight)
  .delete(verifyJWT, verifyAdmin, validateMongoId("id"), deleteInsight);
 
router.route("/admin/:id/toggle-publish")
  .patch(verifyJWT, verifyAdmin, validateMongoId("id"), togglePublishStatus);
 
// Like — login required
router.route("/:id/like").post(verifyJWT, validateMongoId("id"), toggleLike);
 
// Single insight — SUBSCRIBER ONLY
router.route("/:id").get(verifyJWT, verifySubscription, validateMongoId("id"), getInsightById);
 
export default router;