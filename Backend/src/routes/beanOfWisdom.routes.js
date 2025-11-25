// routes/beanOfWisdom.routes.js
import { Router } from "express";
import {
    getAllBeansOfWisdom,
    getBeanOfWisdomById,
    updateBeanOfWisdom,
    deleteBeanOfWisdom,
    getFieldLimits,
    checkBeanExists,
} from "../controllers/beanOfWisdom.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.route("/").get(getAllBeansOfWisdom);
router.route("/limits").get(getFieldLimits);
router.route("/check/exists").get(checkBeanExists);
router.route("/:id").get(getBeanOfWisdomById);

// Admin-only routes (authentication + admin verification required)
router.route("/:id").put(verifyJWT, verifyAdmin, updateBeanOfWisdom);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteBeanOfWisdom);

export default router;