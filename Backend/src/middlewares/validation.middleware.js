// middlewares/validation.middleware.js
// Input sanitization aur validation — XSS aur bad data se protection

import { body, param, validationResult } from "express-validator";

// ─── Helper: errors collect karo aur 400 bhejo ──────────────────────────────
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // pehli error dikhao
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Register validation ──────────────────────────────────────────────────────
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name required hai")
    .isLength({ min: 2, max: 50 }).withMessage("Name 2-50 characters ka hona chahiye")
    .matches(/^[a-zA-Z\s\u0900-\u097F]+$/).withMessage("Name mein sirf letters allowed hain")
    .escape(), // HTML tags remove karo (XSS prevention)

  body("email")
    .trim()
    .notEmpty().withMessage("Email required hai")
    .isEmail().withMessage("Valid email enter karo")
    .normalizeEmail() // lowercase + trim
    .isLength({ max: 100 }).withMessage("Email bahut lamba hai"),

  body("password")
    .notEmpty().withMessage("Password required hai")
    .isLength({ min: 6 }).withMessage("Password kam se kam 6 characters ka hona chahiye")
    .isLength({ max: 128 }).withMessage("Password bahut lamba hai"),

  handleValidationErrors,
];

// ─── Login validation ─────────────────────────────────────────────────────────
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email required hai")
    .isEmail().withMessage("Valid email enter karo")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password required hai")
    .isLength({ max: 128 }).withMessage("Invalid password"),

  handleValidationErrors,
];

// ─── Forgot password validation ───────────────────────────────────────────────
export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email required hai")
    .isEmail().withMessage("Valid email enter karo")
    .normalizeEmail(),

  handleValidationErrors,
];

// ─── Reset password validation ────────────────────────────────────────────────
export const validateResetPassword = [
  body("token")
    .notEmpty().withMessage("Reset token required hai")
    .isLength({ min: 10 }).withMessage("Invalid token"),

  body("newPassword")
    .notEmpty().withMessage("New password required hai")
    .isLength({ min: 6 }).withMessage("Password kam se kam 6 characters ka hona chahiye")
    .isLength({ max: 128 }).withMessage("Password bahut lamba hai"),

  handleValidationErrors,
];

// ─── Insight create/update validation ────────────────────────────────────────
export const validateInsight = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title required hai")
    .isLength({ max: 200 }).withMessage("Title 200 characters se zyada nahi ho sakta")
    .escape(),

  body("description")
    .trim()
    .notEmpty().withMessage("Description required hai")
    .isLength({ max: 1000 }).withMessage("Description 1000 characters se zyada nahi ho sakta")
    .escape(),

  body("category")
    .trim()
    .notEmpty().withMessage("Category required hai")
    .isLength({ max: 50 }).withMessage("Category bahut lamba hai")
    .escape(),

  body("marketType")
    .isIn(["domestic", "global", "commodities"]).withMessage("marketType: domestic, global ya commodities hona chahiye"),

  body("sentiment")
    .optional()
    .isIn(["positive", "negative", "neutral"]).withMessage("sentiment: positive, negative ya neutral hona chahiye"),

  body("investBeansInsight.impactScore")
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage("Impact score 1-10 ke beech hona chahiye"),

  body("credits.url")
    .optional()
    .trim()
    .isURL().withMessage("Valid URL enter karo"),

  handleValidationErrors,
];

// ─── Payment process validation ──────────────────────────────────────────────
export const validatePayment = [
  body("amount")
    .notEmpty().withMessage("Amount required hai")
    .isFloat({ min: 1 }).withMessage("Amount valid hona chahiye")
    .customSanitizer(v => Math.round(Number(v))), // integer ensure karo

  body("userId")
    .notEmpty().withMessage("UserId required hai")
    .isMongoId().withMessage("Invalid userId format"),

  body("planId")
    .notEmpty().withMessage("PlanId required hai")
    .isIn(["foundation", "command", "edge"]).withMessage("Invalid plan. foundation, command, ya edge hona chahiye"),

  handleValidationErrors,
];

// ─── Subscription grant validation (admin) ───────────────────────────────────
export const validateGrantSubscription = [
  body("plan")
    .notEmpty().withMessage("Plan required hai")
    .isIn(["foundation", "command", "edge", "basic", "pro", "elite"]).withMessage("Invalid plan"),

  body("durationDays")
    .notEmpty().withMessage("durationDays required hai")
    .isInt({ min: 1, max: 3650 }).withMessage("Duration 1-3650 days hona chahiye"),

  body("amount")
    .optional()
    .isFloat({ min: 0 }).withMessage("Amount valid hona chahiye"),

  handleValidationErrors,
];

// ─── MongoDB ObjectId param validation ───────────────────────────────────────
export const validateMongoId = (paramName = "id") => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`),

  handleValidationErrors,
];