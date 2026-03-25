// routes/Admin.routes.js
// ✅ Updated: new email-based grant routes added

import { Router } from "express";
import {
  getAllUsers,
  getAdminStats,
  grantSubscription,
  grantSubscriptionByEmail,   // ← NEW
  getPendingEmailGrants,       // ← NEW
  revokeSubscription,
  revokePendingGrant,          // ← NEW
} from "../controllers/Admin.controller .js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ── All routes: must be authenticated AND admin ──────────────────────────────
router.use(verifyJWT, verifyAdmin);

// ── Existing routes ──────────────────────────────────────────────────────────
router.get("/users",                   getAllUsers);
router.get("/stats",                   getAdminStats);
router.patch("/subscription/:userId",  grantSubscription);      // userId se grant (table click)
router.delete("/subscription/:userId", revokeSubscription);     // subscription revoke

// ── NEW: Email-based grant routes ────────────────────────────────────────────
// POST /admin/subscription/grant    → email se grant karo (registered ya nahi)
// GET  /admin/pending-grants        → dekhho kaunse emails pending hain
// DELETE /admin/pending-grant/:id   → pending grant cancel karo
router.post("/subscription/grant",     grantSubscriptionByEmail);
router.get("/pending-grants",          getPendingEmailGrants);
router.delete("/pending-grant/:id",    revokePendingGrant);

export default router;

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER IN app.js (obfuscated path):
//
//   app.use(`/api/v1/${process.env.ADMIN_API_SEGMENT || "xp-insights-42"}`, adminLimiter, adminRouter);
// ─────────────────────────────────────────────────────────────────────────────