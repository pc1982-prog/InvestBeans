import { Router } from "express";
import {
  createInsight,
  getAllInsights,
  getInsightById,
  updateInsight,
  deleteInsight,
  getAdminInsights,
  getInsightStats,
  togglePublishStatus,
  toggleLike,
} from "../controllers/insight.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllInsights);
router.route("/:id").get(getInsightById);

// Like route (requires authentication)
router.route("/:id/like").post(verifyJWT, toggleLike);

// Admin routes
router.route("/admin/create").post(verifyJWT, verifyAdmin, createInsight);

router.route("/admin/all").get(verifyJWT, verifyAdmin, getAdminInsights);

router.route("/admin/stats").get(verifyJWT, verifyAdmin, getInsightStats);

router
  .route("/admin/:id")
  .put(verifyJWT, verifyAdmin, updateInsight)
  .delete(verifyJWT, verifyAdmin, deleteInsight);

router
  .route("/admin/:id/toggle-publish")
  .patch(verifyJWT, verifyAdmin, togglePublishStatus);

export default router;