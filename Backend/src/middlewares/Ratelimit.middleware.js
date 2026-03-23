// middlewares/rateLimit.middleware.js
// npm install express-rate-limit
import rateLimit from "express-rate-limit";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ── General limiter — sab routes pe lagta hai ────────────────────────────────
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 500 : 100_000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Bahut zyada requests. Thodi der baad try karo." },
  // ✅ FIX: skip() ko proper tarike se likha — pehle arrow function galat tha
  // Development mein completely skip karo rate limiting
  skip: (req) => !IS_PRODUCTION,

  // ✅ FIX: keyGenerator add kiya — agar proxy ke peeche ho toh IP sahi mile
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  },
});

// ── Auth limiter — login / register / forgot password ────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 20 : 100_000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Bahut zyada login attempts. 15 minute baad try karo." },
  skip: (req) => !IS_PRODUCTION,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  },
});

// ── Admin limiter — admin dashboard routes ───────────────────────────────────
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PRODUCTION ? 100 : 100_000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many admin requests." },
  skip: (req) => !IS_PRODUCTION,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  },
});