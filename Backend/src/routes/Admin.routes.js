import { Router } from "express";
import {
  getAllUsers,
  getAdminStats,
  grantSubscription,
  revokeSubscription,
} from "../controllers/Admin.controller .js ";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// ── All routes: must be authenticated AND admin ──────────────────────────────
router.use(verifyJWT, verifyAdmin);

router.get("/users",                      getAllUsers);
router.get("/stats",                      getAdminStats);
router.patch("/subscription/:userId",     grantSubscription);
router.delete("/subscription/:userId",    revokeSubscription);

export default router;

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER IN app.js like this (use an obfuscated path):
//
//   import adminRouter from "./routes/admin.routes.js";
//   app.use("/api/v1/xp-insights-42", adminRouter);
//                         ↑ obfuscated — never use "/admin"
//
// Store the obfuscated segment in .env:
//   ADMIN_API_SEGMENT=xp-insights-42
//
// Then in app.js:
//   app.use(`/api/v1/${process.env.ADMIN_API_SEGMENT}`, adminRouter);
// ─────────────────────────────────────────────────────────────────────────────