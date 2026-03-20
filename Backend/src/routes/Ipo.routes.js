import { Router } from "express";
import { getAllIPOs, getIPOById, createIPO, updateIPO, deleteIPO } from "../controllers/Ipo.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/",       getAllIPOs);                         // GET    /api/v1/ipo
router.get("/:id",    getIPOById);                        // GET    /api/v1/ipo/:id
router.post("/",      upload.single("logo"), createIPO);  // POST   /api/v1/ipo  (logo image optional)
router.put("/:id",    upload.single("logo"), updateIPO);  // PUT    /api/v1/ipo/:id
router.delete("/:id", deleteIPO);                         // DELETE /api/v1/ipo/:id

export default router;