// middlewares/sanitize.middleware.js
// XSS protection — dangerous HTML/script tags remove karta hai body/query se
// Koi extra npm package nahi chahiye — pure JS

function sanitizeString(str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
      // ✅ slash replace HATA diya — URLs aur paths toot jaate the
  }
  
  function sanitizeObject(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "string") return sanitizeString(obj);
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
  
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  export const sanitizeInputs = (req, res, next) => {
    // ✅ Sirf body sanitize karo — user input aata hai yahan
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
  
    // ✅ Query params sanitize karo — ?search=<script> jaisa input
    if (req.query && typeof req.query === "object") {
      req.query = sanitizeObject(req.query);
    }
  
    // ❌ req.params BILKUL mat chhuo — Express routing ke liye zaroori hain
    // Agar sanitize karo toh /api/v1/markets/global jaise routes toot jaate hain
  
    next();
  };