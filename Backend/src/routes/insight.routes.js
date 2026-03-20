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

// ── Public list ──────────────────────────────────────────────────────────────
router.route("/").get(getAllInsights);

// ── Admin static routes (MUST be before /:id) ───────────────────────────────
// If these come after router.route("/:id"), Express matches "admin" as :id
// and these routes never execute — causing silent failures.
router.route("/admin/create").post(verifyJWT, verifyAdmin, createInsight);
router.route("/admin/all").get(verifyJWT, verifyAdmin, getAdminInsights);
router.route("/admin/stats").get(verifyJWT, verifyAdmin, getInsightStats);

// ── Admin dynamic routes ─────────────────────────────────────────────────────
router
  .route("/admin/:id")
  .put(verifyJWT, verifyAdmin, updateInsight)
  .delete(verifyJWT, verifyAdmin, deleteInsight);

router
  .route("/admin/:id/toggle-publish")
  .patch(verifyJWT, verifyAdmin, togglePublishStatus);

// ── Like (authenticated) ─────────────────────────────────────────────────────
router.route("/:id/like").post(verifyJWT, toggleLike);

// ── Public single insight (MUST be last) ────────────────────────────────────
router.route("/:id").get(getInsightById);

export default router;