import { Router } from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getAdminBlogs,
    getBlogStats
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes (No authentication required)
router.route("/")
    .get(getAllBlogs); // GET /api/v1/blogs?search=ivf&category=health&page=1&limit=10&sort=desc

router.route("/:id")
    .get(getBlogById); // GET /api/v1/blogs/:id or /api/v1/blogs/:slug

// Admin Routes (Authentication + Admin check required)
router.route("/admin/create")
    .post(verifyJWT, verifyAdmin, upload.single("blogImage"), createBlog);

router.route("/admin/all")
    .get(verifyJWT, verifyAdmin, getAdminBlogs);

router.route("/admin/stats")
    .get(verifyJWT, verifyAdmin, getBlogStats);

router.route("/admin/:id")
    .put(verifyJWT, verifyAdmin, upload.single("blogImage"), updateBlog)
    .delete(verifyJWT, verifyAdmin, deleteBlog);

export default router;