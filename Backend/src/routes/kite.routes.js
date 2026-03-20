// Backend/src/routes/kite.routes.js  ← REPLACE existing
import express from "express";
import crypto  from "crypto";
import axios   from "axios";
import fs      from "fs";
import path    from "path";
import { fileURLToPath } from "url";
import { kiteWS } from "../utils/kiteWebSocket.js";
import { autoLoginKite } from "../utils/kiteAutoLogin.js";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH   = path.resolve(__dirname, "../../.env");

const router     = express.Router();
const API_KEY    = process.env.KITE_API_KEY;
const API_SECRET = process.env.KITE_API_SECRET;

// ✅ FIX: autoLoginKite process.env.KITE_ACCESS_TOKEN update karta hai
// headers() ab runtime pe fresh token read karta hai — stale nahi hoga
const getToken = () => process.env.KITE_ACCESS_TOKEN || "";
let ACCESS_TOKEN = getToken(); // backward compat ke liye (callback mein use hota hai)

const headers = () => ({
  "X-Kite-Version": "3",
  Authorization: `token ${API_KEY}:${getToken()}`,
});

// Helper: build ?i=X&i=Y query string (Kite requires repeated params)
const symQS = (syms) => syms.map(s => `i=${encodeURIComponent(s)}`).join("&");

// Helper: update .env file so token survives backend restarts
function saveTokenToEnv(token) {
  try {
    let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
    if (content.includes("KITE_ACCESS_TOKEN=")) {
      content = content.replace(/^KITE_ACCESS_TOKEN=.*/m, `KITE_ACCESS_TOKEN=${token}`);
    } else {
      content += `\nKITE_ACCESS_TOKEN=${token}`;
    }
    fs.writeFileSync(ENV_PATH, content, "utf8");
    console.log("✅ Token saved to .env automatically");
  } catch (e) {
    console.warn("⚠️  Could not auto-save to .env:", e.message);
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────
router.get("/login", (req, res) => {
  if (!API_KEY) return res.status(500).send("❌ KITE_API_KEY not set");
  res.redirect(`https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}`);
});

// ── CALLBACK ──────────────────────────────────────────────────────
router.get("/callback", async (req, res) => {
  const { request_token, status } = req.query;
  if (status !== "success" || !request_token)
    return res.status(400).send(`<h2 style="color:red">❌ Login failed: ${status}</h2>`);

  try {
    const checksum = crypto.createHash("sha256")
      .update(API_KEY + request_token + API_SECRET).digest("hex");

    const r = await axios.post(
      "https://api.kite.trade/session/token",
      new URLSearchParams({ api_key: API_KEY, request_token, checksum }),
      { headers: { "X-Kite-Version": "3", "Content-Type": "application/x-www-form-urlencoded" } }
    );

    ACCESS_TOKEN = r.data.data.access_token;
    process.env.KITE_ACCESS_TOKEN = ACCESS_TOKEN; // ✅ process.env update karo
    const user   = r.data.data;
    console.log(`\n✅ NEW TOKEN: ${ACCESS_TOKEN}\n`);

    // Auto-save to .env + reconnect WebSocket
    saveTokenToEnv(ACCESS_TOKEN);
    kiteWS.updateToken(ACCESS_TOKEN);

    res.send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Login Success</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',sans-serif; }
  body { background:#0a1826; min-height:100vh; display:flex; align-items:center; justify-content:center; }
  .card { background:#0c1821; border:1px solid #1a2d3f; border-radius:16px; padding:40px; max-width:520px; width:90%; }
  h2 { color:#16a34a; font-size:20px; margin-bottom:8px; }
  p { color:#5a7a92; font-size:13px; margin-bottom:16px; }
  .token-box { background:#081017; border:1px solid #1a2d3f; border-radius:10px; padding:16px; margin:16px 0; word-break:break-all; font-family:monospace; font-size:12px; color:#4ade80; }
  .badge { display:inline-flex; align-items:center; gap:6px; background:#16a34a20; border:1px solid #16a34a40; color:#4ade80; font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px; margin:4px 2px; }
  .warn { color:#f59e0b; font-size:12px; margin-top:16px; padding:12px; background:#f59e0b10; border:1px solid #f59e0b30; border-radius:8px; }
  .close-btn { margin-top:24px; width:100%; padding:12px; background:#16a34a; color:white; border:none; border-radius:10px; font-weight:700; cursor:pointer; font-size:14px; }
  .close-btn:hover { background:#15803d; }
</style></head>
<body><div class="card">
  <h2>✅ Login Successful</h2>
  <p>Welcome, <strong style="color:#c0d8ea">${user.user_name}</strong> (${user.user_id})</p>
  <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:16px">
    <span class="badge">✅ Token Saved</span>
    <span class="badge">🔌 WebSocket Live</span>
    <span class="badge">📁 .env Updated</span>
  </div>
  <p style="color:#3d5f78;font-size:11px;margin-bottom:4px">New Access Token (auto-saved to .env):</p>
  <div class="token-box">${ACCESS_TOKEN}</div>
  <div class="warn">⏰ Token expires at 6:00 AM IST tomorrow.<br>
  If you set up KITE_TOTP_SECRET in .env, it auto-refreshes daily — no manual login needed.</div>
  <button class="close-btn" onclick="window.close()">Close & Go Back to Dashboard</button>
</div></body></html>`);
  } catch (err) {
    console.error("❌ Token exchange failed:", err?.response?.data);
    res.status(500).send(`<h2>❌ ${JSON.stringify(err?.response?.data)}</h2>`);
  }
});

// ── STATUS ────────────────────────────────────────────────────────
router.get("/status", (req, res) => {
  res.json({
    ws_connected:  kiteWS.isConnected(),
    has_token:     !!ACCESS_TOKEN,
    api_key_set:   !!API_KEY,
    token_preview: ACCESS_TOKEN ? ACCESS_TOKEN.slice(0, 8) + "…" : "NOT SET",
    instruments:   Object.keys(kiteWS.getLastTicks()).length,
  });
});

// ── MANUAL AUTO-LOGIN TRIGGER ────────────────────────────────────
// Visit: /api/v1/kite/refresh-token to manually refresh token
router.get("/refresh-token", async (req, res) => {
  try {
    console.log("🔄 Manual token refresh triggered...");
    const token = await autoLoginKite();
    if (token) {
      res.json({ status: "success", message: "Token refreshed", token: token.slice(0, 8) + "…" });
    } else {
      res.status(500).json({ status: "error", message: "Auto-login failed — check server logs" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ── QUOTE (full price + depth) ────────────────────────────────────
router.get("/quote", async (req, res) => {
  try {
    const syms = [].concat(req.query.i || []);
    const r    = await axios.get(`https://api.kite.trade/quote?${symQS(syms)}`, { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── OHLC ──────────────────────────────────────────────────────────
router.get("/ohlc", async (req, res) => {
  try {
    const syms = [].concat(req.query.i || []);
    try {
      const r = await axios.get(`https://api.kite.trade/ohlc?${symQS(syms)}`, { headers: headers() });
      return res.json(r.data);
    } catch (_) {
      const r = await axios.get(`https://api.kite.trade/quote?${symQS(syms)}`, { headers: headers() });
      const data = {};
      for (const [k, v] of Object.entries(r.data.data || {})) {
        data[k] = { instrument_token: v.instrument_token, last_price: v.last_price, ohlc: v.ohlc };
      }
      res.json({ status: "success", data });
    }
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── HISTORICAL CANDLES ────────────────────────────────────────────
router.get("/historical", async (req, res) => {
  try {
    const { token, interval, from, to } = req.query;
    if (!token || !interval) return res.status(400).json({ error: "token and interval required" });

    const toDate   = to   || new Date().toISOString().split("T")[0];
    const fromDate = from || (() => {
      const d = new Date();
      if (interval === "day")             d.setFullYear(d.getFullYear() - 1);
      else if (interval.includes("minute")) d.setDate(d.getDate() - 7);
      else                                  d.setDate(d.getDate() - 30);
      return d.toISOString().split("T")[0];
    })();

    const r = await axios.get(
      `https://api.kite.trade/instruments/historical/${token}/${interval}`,
      { headers: headers(), params: { from: fromDate, to: toDate } }
    );

    const candles = (r.data?.data?.candles || []).map(([time, open, high, low, close, volume]) => ({
      x: new Date(time).getTime(),
      y: [open, high, low, close],
      volume,
    }));

    res.json({ status: "success", candles });
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MARKETS/HISTORY for CleanChart ───────────────────────────────
router.get("/markets/history/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const period     = req.query.period || "1D";

  const PERIOD_MAP = {
    "1D": { interval: "5minute",  days: 1   },
    "1W": { interval: "30minute", days: 7   },
    "1M": { interval: "day",      days: 30  },
    "3M": { interval: "day",      days: 90  },
    "1Y": { interval: "day",      days: 365 },
  };

  const TOKEN_MAP = {
    "NIFTY 50": 256265, "NIFTY50": 256265, "SENSEX": 265, "NIFTY BANK": 260105,
    "BANKNIFTY": 260105, "NIFTY IT": 258529, "NIFTY AUTO": 258049,
    "RELIANCE": 738561, "TCS": 2953217, "HDFCBANK": 341249, "INFY": 408065,
    "ICICIBANK": 1270529, "WIPRO": 969473, "HINDUNILVR": 356865, "ITC": 424961,
  };

  const cfg   = PERIOD_MAP[period] || PERIOD_MAP["1D"];
  const token = TOKEN_MAP[symbol.toUpperCase()];
  if (!token) return res.status(404).json({ status: "error", message: `Unknown symbol: ${symbol}` });

  const toDate   = new Date().toISOString().split("T")[0];
  const fromDate = (() => { const d = new Date(); d.setDate(d.getDate() - cfg.days); return d.toISOString().split("T")[0]; })();

  try {
    const r = await axios.get(
      `https://api.kite.trade/instruments/historical/${token}/${cfg.interval}`,
      { headers: headers(), params: { from: fromDate, to: toDate } }
    );
    const candles = (r.data?.data?.candles || []).map(([time, open, high, low, close, volume]) => ({
      x: new Date(time).getTime(), y: [open, high, low, close], volume,
    }));
    res.json({ status: "success", candles });
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── INSTRUMENTS LIST ──────────────────────────────────────────────
router.get("/instruments", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/instruments", { headers: headers() });
    res.set("Content-Type", "text/csv");
    res.send(r.data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ── F&O INSTRUMENTS (NFO) ─────────────────────────────────────────
// KEY FIX: Kite NFO CSV has EMPTY `name` field — filter by tradingsymbol.startsWith()
router.get("/instruments/:exchange", async (req, res) => {
  try {
    const r = await axios.get(
      `https://api.kite.trade/instruments/${req.params.exchange}`,
      { headers: headers() }
    );
    res.set("Content-Type", "text/csv");
    res.send(r.data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/fo/instruments", async (req, res) => {
  try {
    const name   = (req.query.name || "NIFTY").toString().toUpperCase();
    const type   = (req.query.type || "").toString().toUpperCase();
    const expiry = (req.query.expiry || "").toString();

    const r = await axios.get("https://api.kite.trade/instruments/NFO", { headers: headers(), responseType: "text" });
    const lines = r.data.split("\n").filter(l => l.trim());
    const hdrs  = lines[0].split(",").map(h => h.trim());

    const toObj = (line) => {
      const v = line.split(",");
      const o = {};
      hdrs.forEach((h, i) => { o[h] = (v[i] ?? "").trim(); });
      return o;
    };

    // Kite NFO CSV has EMPTY `name` column — must use tradingsymbol prefix
    const allMatching = lines.slice(1)
      .map(toObj)
      .filter(o => o.tradingsymbol && o.tradingsymbol.startsWith(name));

    const expiries   = [...new Set(allMatching.map(o => o.expiry).filter(Boolean))].sort();
    const nearExpiry = expiries[0] ?? "";
    const selExpiry  = expiry || nearExpiry;
    let   items      = allMatching.filter(o => o.expiry === selExpiry);
    if (type) items  = items.filter(o => o.instrument_type === type);

    res.json({
      status: "success",
      data:   items.slice(0, 500),
      meta:   { expiries, current_expiry: nearExpiry, selected_expiry: selExpiry, total: items.length },
    });
  } catch (err) {
    console.error("F&O instruments error:", err?.message);
    res.status(err?.response?.status || 500).json({ status: "error", message: err.message });
  }
});

// ── PORTFOLIO / HOLDINGS ──────────────────────────────────────────
router.get("/portfolio/holdings", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/portfolio/holdings", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── PORTFOLIO / POSITIONS ─────────────────────────────────────────
router.get("/portfolio/positions", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/portfolio/positions", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── ORDERS ────────────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/orders", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MARGINS ───────────────────────────────────────────────────────
router.get("/margins", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/user/margins", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MUTUAL FUNDS HOLDINGS ─────────────────────────────────────────
router.get("/mf/holdings", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/mf/holdings", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MUTUAL FUNDS SIPS ─────────────────────────────────────────────
router.get("/mf/sips", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/mf/sips", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MUTUAL FUNDS ORDERS ───────────────────────────────────────────
router.get("/mf/orders", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/mf/orders", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MARGIN CALCULATION (Order margins) ───────────────────────────
router.post("/margins/orders", async (req, res) => {
  try {
    const r = await axios.post(
      "https://api.kite.trade/margins/orders",
      req.body,
      { headers: { ...headers(), "Content-Type": "application/json" } }
    );
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── MARGIN CALCULATION (Basket margins) ──────────────────────────
router.post("/margins/basket", async (req, res) => {
  try {
    const params = req.query.consider_positions ? `?consider_positions=${req.query.consider_positions}` : "";
    const r = await axios.post(
      `https://api.kite.trade/margins/basket${params}`,
      req.body,
      { headers: { ...headers(), "Content-Type": "application/json" } }
    );
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── USER MARGINS ──────────────────────────────────────────────────
router.get("/user/margins", async (req, res) => {
  try {
    const r = await axios.get("https://api.kite.trade/user/margins", { headers: headers() });
    res.json(r.data);
  } catch (err) {
    res.status(err?.response?.status || 500).json(err?.response?.data || { status: "error", message: err.message });
  }
});

// ── NSE CORPORATE ACTIONS PROXY ───────────────────────────────────
let _nseSession = { cookies: "", ts: 0 };
const NSE_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const NSE_COMMON = {
  "User-Agent": NSE_UA, "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br", "DNT": "1", "Connection": "keep-alive",
  "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": '"Windows"',
};

function mergeCookies(existing, incoming = []) {
  const map = {};
  existing.split(";").forEach(c => { const [k,...v]=c.trim().split("="); if(k) map[k.trim()]=v.join("=").trim(); });
  incoming.forEach(c => { const [k,...v]=c.split(";")[0].trim().split("="); if(k) map[k.trim()]=v.join("=").trim(); });
  return Object.entries(map).filter(([k])=>k).map(([k,v])=>`${k}=${v}`).join("; ");
}

async function refreshNseSession() {
  console.log("🔄 Refreshing NSE session...");
  const r1 = await axios.get("https://www.nseindia.com/", {
    timeout: 15000,
    headers: { ...NSE_COMMON, Accept: "text/html,application/xhtml+xml,*/*;q=0.8", "Cache-Control": "no-cache",
      "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "sec-fetch-site": "none", "Upgrade-Insecure-Requests": "1" },
  });
  let cookies = mergeCookies("", r1.headers["set-cookie"] || []);
  await new Promise(r => setTimeout(r, 1500));
  try {
    const r2 = await axios.get("https://www.nseindia.com/companies-listing/corporate-filings-actions", {
      timeout: 12000,
      headers: { ...NSE_COMMON, Accept: "text/html,application/xhtml+xml,*/*;q=0.8", Referer: "https://www.nseindia.com/",
        Cookie: cookies, "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "sec-fetch-site": "same-origin", "Upgrade-Insecure-Requests": "1" },
    });
    cookies = mergeCookies(cookies, r2.headers["set-cookie"] || []);
  } catch (e) { console.warn("  NSE filings page warmup failed:", e.message); }
  _nseSession = { cookies, ts: Date.now() };
  return cookies;
}

async function getNseSession(forceRefresh = false) {
  const CACHE_MS = 8 * 60 * 1000;
  if (!forceRefresh && _nseSession.cookies && Date.now() - _nseSession.ts < CACHE_MS) return _nseSession.cookies;
  return refreshNseSession();
}

async function fetchNseCorpActions(cookies, fromDate, toDate) {
  const r = await axios.get(
    `https://www.nseindia.com/api/corporates-corporateActions?index=equities&from_date=${fromDate}&to_date=${toDate}`,
    { timeout: 15000, headers: { ...NSE_COMMON, Accept: "application/json, text/plain, */*",
        Referer: "https://www.nseindia.com/companies-listing/corporate-filings-actions",
        Cookie: cookies, "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "X-Requested-With": "XMLHttpRequest" } }
  );
  const raw = r.data;
  return Array.isArray(raw) ? raw : (raw?.data ?? raw?.body ?? []);
}

async function fetchBseCorpActions() {
  try {
    const r = await axios.get(
      "https://api.bseindia.com/BseIndiaAPI/api/CorporateAction/w?scripcode=&segment=0&strCat=-1&strPrevDate=&strScrip=&strSearch=P&strToDate=&strType=C&report=CORPACTALL",
      { timeout: 12000, headers: { "User-Agent": NSE_UA, Accept: "application/json", Referer: "https://www.bseindia.com/", Origin: "https://www.bseindia.com" } }
    );
    const items = r.data?.Table ?? r.data?.data ?? r.data ?? [];
    return (Array.isArray(items) ? items : []).slice(0, 100).map(i => ({
      symbol: i.SCRIP_CD || "", companyName: i.COMP_NAME || "", subject: i.PURPOSE || "",
      exDate: i.EX_DATE || "", recordDate: i.REC_DATE || "", remarks: i.REMARKS || "", series: i.SERIES || "", source: "BSE",
    }));
  } catch (e) { console.error("BSE fallback failed:", e.message); return []; }
}

router.get("/nse/corporate-actions", async (req, res) => {
  const today = new Date();
  const pad = n => String(n).padStart(2, "0");
  const fmtDate = d => `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  const toDate = fmtDate(today);
  const fromD = new Date(today); fromD.setDate(fromD.getDate() - 30);
  const fromDate = fmtDate(fromD);

  try {
    const cookies = await getNseSession();
    await new Promise(r => setTimeout(r, 600));
    try {
      const data = await fetchNseCorpActions(cookies, req.query.from || fromDate, req.query.to || toDate);
      return res.json({ status: "success", data, source: "NSE" });
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        console.warn("NSE 403 — retrying with fresh session...");
        _nseSession = { cookies: "", ts: 0 };
        await new Promise(r => setTimeout(r, 2000));
        const fresh = await getNseSession(true);
        await new Promise(r => setTimeout(r, 1000));
        try {
          const data = await fetchNseCorpActions(fresh, req.query.from || fromDate, req.query.to || toDate);
          return res.json({ status: "success", data, source: "NSE" });
        } catch (_) { /* fall through to BSE */ }
      } else { throw err; }
    }
  } catch (_) {}

  const bseData = await fetchBseCorpActions();
  if (bseData.length > 0) return res.json({ status: "success", data: bseData, source: "BSE" });
  return res.status(503).json({ status: "error", message: "NSE/BSE corporate action data unavailable. Visit NSE/BSE directly." });
});

router.get("/corporate-actions", (req, res) => {
  res.json({ status: "success", data: [], note: "Use /kite/nse/corporate-actions" });
});

export default router;