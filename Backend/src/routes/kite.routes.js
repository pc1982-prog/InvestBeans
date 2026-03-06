// Backend/src/routes/kite.routes.js
// ✅ ES Module syntax — tumhare backend ke saath match karta hai

import express from "express";
import crypto from "crypto";
import axios from "axios";

const router = express.Router();

const API_KEY    = process.env.KITE_API_KEY;
const API_SECRET = process.env.KITE_API_SECRET;

// In-memory token — server restart pe reset hoga
let KITE_ACCESS_TOKEN = process.env.KITE_ACCESS_TOKEN || "";

// Kite API headers
const kiteHeaders = () => ({
  "X-Kite-Version": "3",
  Authorization: `token ${API_KEY}:${KITE_ACCESS_TOKEN}`,
});

// ─────────────────────────────────────────────────────────────────
// LOGIN — Browser mein kholo:
// http://127.0.0.1:8000/api/v1/kite/login
// ─────────────────────────────────────────────────────────────────
router.get("/login", (req, res) => {
  if (!API_KEY) {
    return res.status(500).send("❌ KITE_API_KEY .env mein set nahi hai!");
  }
  const loginURL = `https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}`;
  console.log("🔗 Kite login redirect:", loginURL);
  res.redirect(loginURL);
});

// ─────────────────────────────────────────────────────────────────
// CALLBACK — Kite Dashboard mein Redirect URL ye set karo:
// http://127.0.0.1:8000/api/v1/kite/callback
// ─────────────────────────────────────────────────────────────────
router.get("/callback", async (req, res) => {
  const { request_token, status } = req.query;

  console.log("\n📨 Kite Callback aaya!");
  console.log("   status        :", status);
  console.log("   request_token :", request_token);

  if (status !== "success" || !request_token) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:red;">❌ Login fail hua</h2>
        <p>Status received: <b>${status}</b></p>
        <a href="/api/v1/kite/login" style="color:blue;font-weight:bold;">🔄 Dobara try karo</a>
      </body></html>
    `);
  }

  try {
    // SHA-256: api_key + request_token + api_secret
    const checksum = crypto
      .createHash("sha256")
      .update(API_KEY + request_token + API_SECRET)
      .digest("hex");

    console.log("🔐 Checksum ready, exchanging token...");

    const response = await axios.post(
      "https://api.kite.trade/session/token",
      new URLSearchParams({ api_key: API_KEY, request_token, checksum }),
      {
        headers: {
          "X-Kite-Version": "3",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    KITE_ACCESS_TOKEN = response.data.data.access_token;
    const user = response.data.data;

    console.log("\n✅ ACCESS TOKEN MILA!");
    console.log("👤 User:", user.user_name, "|", user.email);
    console.log("🔑 Token:", KITE_ACCESS_TOKEN);
    console.log("\n📋 Backend/.env mein add karo:");
    console.log(`KITE_ACCESS_TOKEN=${KITE_ACCESS_TOKEN}\n`);

    res.send(`
      <html>
      <body style="font-family:sans-serif;padding:40px;background:#f0fdf4;">
        <h2 style="color:#16a34a;">✅ Kite Login Successful!</h2>
        <table style="border-collapse:collapse;margin:16px 0;">
          <tr>
            <td style="padding:6px 20px 6px 0;color:#666;font-weight:bold;">User</td>
            <td>${user.user_name}</td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#666;font-weight:bold;">Email</td>
            <td>${user.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 20px 6px 0;color:#666;font-weight:bold;">Login Time</td>
            <td>${user.login_time}</td>
          </tr>
        </table>
        <hr style="margin:24px 0;border-color:#bbf7d0;"/>
        <h3 style="color:#15803d;">📋 Ye line Backend/.env mein add karo:</h3>
        <code style="
          background:#dcfce7;
          padding:16px 20px;
          border-radius:10px;
          display:block;
          word-break:break-all;
          font-size:14px;
          border:1px solid #86efac;
          letter-spacing:0.5px;
        ">KITE_ACCESS_TOKEN=${KITE_ACCESS_TOKEN}</code>
        <br/>
        <p style="color:#15803d;font-weight:bold;font-size:16px;">
          🎉 Ab DomesticView mein real Zerodha data aayega!
        </p>
        <p style="color:#d97706;background:#fef3c7;padding:10px 16px;border-radius:8px;border:1px solid #fcd34d;">
          ⚠️ Token kal subah 6:00 AM pe expire hoga. Daily ek baar login karna hoga.
        </p>
      </body>
      </html>
    `);
  } catch (err) {
    const errData = err?.response?.data || err.message;
    console.error("❌ Token exchange failed:", errData);
    res.status(500).send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#fef2f2;">
        <h2 style="color:red;">❌ Token Exchange Failed</h2>
        <pre style="background:#fee2e2;padding:16px;border-radius:8px;overflow:auto;">
${JSON.stringify(errData, null, 2)}</pre>
        <a href="/api/v1/kite/login" style="color:blue;font-weight:bold;">🔄 Dobara try karo</a>
      </body></html>
    `);
  }
});

// ─────────────────────────────────────────────────────────────────
// TOKEN STATUS — Debug ke liye
// http://127.0.0.1:8000/api/v1/kite/token-status
// ─────────────────────────────────────────────────────────────────
router.get("/token-status", (req, res) => {
  res.json({
    has_token: !!KITE_ACCESS_TOKEN,
    api_key_set: !!API_KEY,
    api_key_preview: API_KEY ? API_KEY.slice(0, 6) + "…" : "NOT SET",
    token_preview: KITE_ACCESS_TOKEN
      ? KITE_ACCESS_TOKEN.slice(0, 8) + "…"
      : "NOT SET",
    message: KITE_ACCESS_TOKEN
      ? "✅ Token active — API calls chalenge"
      : "❌ Token nahi hai — /api/v1/kite/login pe jao",
  });
});

// ─────────────────────────────────────────────────────────────────
// QUOTE — Full price + 5-level depth + OI
// GET /api/v1/kite/quote?i=NSE:NIFTY 50&i=BSE:SENSEX
// ─────────────────────────────────────────────────────────────────
router.get("/quote", async (req, res) => {
  try {
    const symbols = [].concat(req.query.i || []);
    const response = await axios.get("https://api.kite.trade/quote", {
      headers: kiteHeaders(),
      params: { i: symbols },
    });
    res.json(response.data);
  } catch (err) {
    console.error("/quote error:", err?.response?.data);
    res.status(err?.response?.status || 500).json(
      err?.response?.data || { status: "error", message: err.message }
    );
  }
});

// ─────────────────────────────────────────────────────────────────
// OHLC — Sirf price data (faster, stock list ke liye)
// GET /api/v1/kite/ohlc?i=NSE:RELIANCE&i=NSE:TCS
// ─────────────────────────────────────────────────────────────────
router.get("/ohlc", async (req, res) => {
  try {
    const symbols = [].concat(req.query.i || []);
    const response = await axios.get("https://api.kite.trade/ohlc", {
      headers: kiteHeaders(),
      params: { i: symbols },
    });
    res.json(response.data);
  } catch (err) {
    console.error("/ohlc error:", err?.response?.data);
    res.status(err?.response?.status || 500).json(
      err?.response?.data || { status: "error", message: err.message }
    );
  }
});

// ─────────────────────────────────────────────────────────────────
// HISTORICAL — Candle data for charts
// GET /api/v1/kite/historical?token=256265&interval=5minute&from=2025-04-01&to=2025-04-19
// Common tokens: NIFTY50=256265, SENSEX=265, BANKNIFTY=260105
// ─────────────────────────────────────────────────────────────────
router.get("/historical", async (req, res) => {
  try {
    const { token, interval, from, to } = req.query;
    if (!token || !interval) {
      return res.status(400).json({ error: "token aur interval required hain" });
    }
    const response = await axios.get(
      `https://api.kite.trade/instruments/historical/${token}/${interval}`,
      { headers: kiteHeaders(), params: { from, to } }
    );
    res.json(response.data);
  } catch (err) {
    console.error("/historical error:", err?.response?.data);
    res.status(err?.response?.status || 500).json(
      err?.response?.data || { status: "error", message: err.message }
    );
  }
});

// Corporate actions stub
router.get("/corporate-actions", (req, res) => {
  res.json({ status: "success", data: [] });
});

// ✅ ES Module export — yahi fix tha!
export default router;