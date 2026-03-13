// Backend/src/routes/kite_test.js
// ── TEST ROUTE — browser mein kholo: http://localhost:8000/api/v1/kite/test
// Saare APIs ek saath test karo, green/red status dikhega

import express from "express";
import axios   from "axios";

const router   = express.Router();
const API_KEY  = () => process.env.KITE_API_KEY;
const TOKEN    = () => process.env.KITE_ACCESS_TOKEN;
const headers  = () => ({
  "X-Kite-Version": "3",
  Authorization: `token ${API_KEY()}:${TOKEN()}`,
});

// ── Helper: test ek API ───────────────────────────────────────────
async function testAPI(name, fn) {
  const t0 = Date.now();
  try {
    const result = await fn();
    return { name, ok: true,  ms: Date.now()-t0, preview: result };
  } catch (e) {
    return { name, ok: false, ms: Date.now()-t0,
      error: e?.response?.data?.message || e?.response?.data?.error_type || e.message,
      status: e?.response?.status };
  }
}

// ── Main test endpoint ────────────────────────────────────────────
router.get("/test", async (req, res) => {

  const results = await Promise.all([

    // 1. Token valid check
    testAPI("🔑 Token / User Profile", async () => {
      const r = await axios.get("https://api.kite.trade/user/profile", { headers: headers() });
      const d = r.data.data;
      return `${d.user_name} (${d.user_id}) — ${d.email}`;
    }),

    // 2. Quote (Market Data)
    testAPI("📈 Market Quote (NSE:INFY)", async () => {
      const r = await axios.get("https://api.kite.trade/quote?i=NSE:INFY", { headers: headers() });
      const d = r.data.data["NSE:INFY"];
      return `LTP: ₹${d.last_price} | O:${d.ohlc.open} H:${d.ohlc.high} L:${d.ohlc.low} C:${d.ohlc.close}`;
    }),

    // 3. OHLC
    testAPI("📊 OHLC (NSE:RELIANCE)", async () => {
      const r = await axios.get("https://api.kite.trade/quote/ohlc?i=NSE:RELIANCE", { headers: headers() });
      const d = r.data.data["NSE:RELIANCE"];
      return `LTP: ₹${d.last_price} | O:${d.ohlc.open} H:${d.ohlc.high} L:${d.ohlc.low} C:${d.ohlc.close}`;
    }),

    // 4. F&O Instruments
    testAPI("🔮 F&O Instruments (NIFTY NFO)", async () => {
      const r = await axios.get("https://api.kite.trade/instruments/NFO", { headers: headers(), responseType: "text" });
      const lines = r.data.split("\n").filter(l => l.trim());
      const niftyLines = lines.filter(l => l.startsWith("NIFTY") || l.includes(",NIFTY"));
      // Count by tradingsymbol starting with NIFTY
      const hdrs = lines[0].split(",");
      const tsIdx = hdrs.indexOf("tradingsymbol");
      const niftyCount = lines.slice(1).filter(l => {
        const cols = l.split(",");
        return cols[tsIdx] && cols[tsIdx].startsWith("NIFTY");
      }).length;
      return `Total NFO lines: ${lines.length-1} | NIFTY instruments: ${niftyCount}`;
    }),

    // 5. Portfolio Holdings
    testAPI("💼 Portfolio Holdings", async () => {
      const r = await axios.get("https://api.kite.trade/portfolio/holdings", { headers: headers() });
      const d = r.data.data || [];
      if (d.length === 0) return "0 holdings (no stocks in demat)";
      const total = d.reduce((s, h) => s + h.pnl, 0);
      return `${d.length} holdings | Total P&L: ₹${total.toFixed(2)}`;
    }),

    // 6. Portfolio Positions
    testAPI("📋 Portfolio Positions", async () => {
      const r = await axios.get("https://api.kite.trade/portfolio/positions", { headers: headers() });
      const net = r.data.data?.net || [];
      return `${net.length} net positions today`;
    }),

    // 7. Orders
    testAPI("📝 Orders (Today)", async () => {
      const r = await axios.get("https://api.kite.trade/orders", { headers: headers() });
      const d = r.data.data || [];
      const complete = d.filter(o => o.status === "COMPLETE").length;
      const open     = d.filter(o => o.status === "OPEN").length;
      return `${d.length} orders | Complete: ${complete} | Open: ${open}`;
    }),

    // 8. User Margins
    testAPI("💰 User Margins (Equity)", async () => {
      const r = await axios.get("https://api.kite.trade/user/margins", { headers: headers() });
      const eq = r.data.data?.equity;
      if (!eq) return "No margin data";
      return `Net: ₹${eq.net?.toFixed(2)} | Cash: ₹${eq.available?.cash?.toFixed(2)} | Used: ₹${eq.utilised?.debits?.toFixed(2)}`;
    }),

    // 9. MF Holdings
    testAPI("🏦 Mutual Fund Holdings", async () => {
      const r = await axios.get("https://api.kite.trade/mf/holdings", { headers: headers() });
      const d = r.data.data || [];
      if (d.length === 0) return "0 MF holdings";
      return `${d.length} funds | e.g. ${d[0].fund.slice(0,40)}...`;
    }),

    // 10. MF SIPs
    testAPI("🔄 Mutual Fund SIPs", async () => {
      const r = await axios.get("https://api.kite.trade/mf/sips", { headers: headers() });
      const d = r.data.data || [];
      const active = d.filter(s => s.status === "ACTIVE").length;
      return `${d.length} SIPs | Active: ${active}`;
    }),

    // 11. Margin Calculation (POST)
    testAPI("🧮 Margin Calculator (INFY BUY 1)", async () => {
      const r = await axios.post(
        "https://api.kite.trade/margins/orders",
        [{ exchange:"NSE", tradingsymbol:"INFY", transaction_type:"BUY",
           variety:"regular", product:"CNC", order_type:"MARKET", quantity:1, price:0, trigger_price:0 }],
        { headers: { ...headers(), "Content-Type": "application/json" } }
      );
      const d = r.data.data?.[0];
      return `Total margin: ₹${d?.total} | VAR: ₹${d?.var} | Charges: ₹${d?.charges?.total?.toFixed(4)}`;
    }),

    // 12. Historical Data
    testAPI("📉 Historical Data (NIFTY 50, day)", async () => {
      const today = new Date().toISOString().split("T")[0];
      const from  = new Date(); from.setDate(from.getDate()-7);
      const r = await axios.get(
        `https://api.kite.trade/instruments/historical/256265/day`,
        { headers: headers(), params: { from: from.toISOString().split("T")[0], to: today } }
      );
      const candles = r.data?.data?.candles || [];
      const last = candles[candles.length-1];
      return `${candles.length} candles | Last: O:${last?.[1]} H:${last?.[2]} L:${last?.[3]} C:${last?.[4]}`;
    }),

    // 13. NSE Corporate Actions
    testAPI("🏢 Corporate Actions (NSE - direct test)", async () => {
      const today = new Date();
      const pad   = n => String(n).padStart(2,"0");
      const fmt   = d => `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
      const to    = fmt(today);
      const fromD = new Date(today); fromD.setDate(fromD.getDate()-30);
      const from  = fmt(fromD);
      const r1 = await axios.get("https://www.nseindia.com/", {
        timeout: 12000,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,*/*;q=0.8", "Accept-Language": "en-IN,en-US;q=0.9",
          "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "sec-fetch-site": "none" },
      });
      const cookies = (r1.headers["set-cookie"] || []).map(c => c.split(";")[0]).join("; ");
      await new Promise(r => setTimeout(r, 1200));
      const r2 = await axios.get(
        `https://www.nseindia.com/api/corporates-corporateActions?index=equities&from_date=${from}&to_date=${to}`,
        { timeout: 12000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*", Referer: "https://www.nseindia.com/companies-listing/corporate-filings-actions",
          Cookie: cookies, "X-Requested-With": "XMLHttpRequest", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin" }}
      );
      const data = Array.isArray(r2.data) ? r2.data : (r2.data?.data ?? []);
      if (data.length === 0) return "0 actions — NSE may have blocked. Check /kite/nse/corporate-actions separately";
      const sample = data.slice(0,3).map(d => d.symbol || d.companyName || "").join(", ");
      return `${data.length} actions (last 30 days) | e.g. ${sample}`;
    }),

    // 14. MF Orders
    testAPI("📦 MF Orders (last 7 days)", async () => {
      const r = await axios.get("https://api.kite.trade/mf/orders", { headers: headers() });
      const d = r.data.data || [];
      if (d.length === 0) return "0 MF orders in last 7 days";
      const complete = d.filter(o => o.status === "COMPLETE").length;
      const rejected = d.filter(o => o.status === "REJECTED").length;
      return `${d.length} orders | Complete: ${complete} | Rejected: ${rejected}`;
    }),

    // 15. LTP Quote (multiple)
    testAPI("\u26a1 LTP Quote (NIFTY50 + SENSEX + RELIANCE)", async () => {
      const r = await axios.get(
        "https://api.kite.trade/quote/ltp?i=NSE:NIFTY+50&i=BSE:SENSEX&i=NSE:RELIANCE",
        { headers: headers() }
      );
      const d = r.data.data || {};
      const parts = Object.entries(d).map(([k,v]) => `${k.split(":")[1]}: \u20b9${v.last_price}`);
      return parts.join(" | ");
    }),


  ]);

  // ── Render HTML ───────────────────────────────────────────────
  const pass = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;
  const tokenSet = !!TOKEN();

  const rows = results.map(r => `
    <tr>
      <td style="padding:12px 16px;font-weight:700;font-size:13px;color:${r.ok?"#4ade80":"#f87171"}">${r.ok?"✅":"❌"}</td>
      <td style="padding:12px 16px;font-size:13px;color:#c0d8ea;font-weight:600">${r.name}</td>
      <td style="padding:12px 16px;font-size:12px;color:${r.ok?"#86efac":"#fca5a5"};font-family:monospace;word-break:break-all">
        ${r.ok ? r.preview : `<b>${r.status ? "HTTP "+r.status+" — " : ""}${r.error}</b>`}
      </td>
      <td style="padding:12px 16px;font-size:11px;color:#3d5f78;text-align:right">${r.ms}ms</td>
    </tr>`).join("");

  res.send(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Kite API Test</title>
<meta http-equiv="refresh" content="30">
<style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif}
  body{background:#071013;min-height:100vh;padding:32px}
  h1{color:#4ade80;font-size:22px;margin-bottom:4px}
  .sub{color:#3d5f78;font-size:13px;margin-bottom:24px}
  .summary{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
  .pill{padding:8px 18px;border-radius:999px;font-weight:700;font-size:13px;border:1px solid}
  .green{background:#16a34a20;color:#4ade80;border-color:#16a34a40}
  .red{background:#dc262620;color:#f87171;border-color:#dc262640}
  .blue{background:#1d4ed820;color:#93c5fd;border-color:#1d4ed840}
  .amber{background:#d9770620;color:#fbbf24;border-color:#d9770640}
  table{width:100%;border-collapse:collapse;background:#0a1826;border-radius:12px;overflow:hidden;border:1px solid #1a2d3f}
  tr{border-bottom:1px solid #0f2030}
  tr:last-child{border-bottom:none}
  tr:hover{background:#0c1f2e}
  th{padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#3d5f78;background:#061018;font-weight:800}
  .token-box{background:#0a1826;border:1px solid ${tokenSet?"#16a34a40":"#dc262640"};border-radius:10px;padding:16px;margin-bottom:20px;font-size:13px}
  .token-box b{color:${tokenSet?"#4ade80":"#f87171"}}
  a{color:#60a5fa;text-decoration:none;font-weight:700}
  a:hover{text-decoration:underline}
</style>
</head>
<body>
  <h1>🧪 InvestBeans — Kite API Test Dashboard</h1>
  <p class="sub">Auto-refreshes every 30s · ${new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</p>

  <div class="token-box">
    <b>${tokenSet ? "✅ KITE_ACCESS_TOKEN is SET" : "❌ KITE_ACCESS_TOKEN is NOT SET"}</b>
    ${tokenSet
      ? ` — Preview: <code style="color:#60a5fa">${TOKEN().slice(0,12)}...</code>`
      : ` — <a href="/api/v1/kite/login">👉 Click here to Login with Zerodha</a>`
    }
    &nbsp;·&nbsp; API Key: <code style="color:#60a5fa">${API_KEY() ? API_KEY().slice(0,8)+"..." : "NOT SET"}</code>
  </div>

  <div class="summary">
    <span class="pill green">✅ ${pass} Passed</span>
    ${fail > 0 ? `<span class="pill red">❌ ${fail} Failed</span>` : ""}
    <span class="pill blue">📡 ${results.length} APIs Tested</span>
    <span class="pill amber">⏱ ${results.reduce((s,r)=>s+r.ms,0)}ms total</span>
    <a href="/api/v1/kite/test" class="pill blue" style="cursor:pointer;text-decoration:none">🔄 Refresh</a>
    ${!tokenSet || fail > 0 ? `<a href="/api/v1/kite/login" class="pill" style="background:#16a34a20;color:#4ade80;border-color:#16a34a40;cursor:pointer">🔑 Login / Refresh Token</a>` : ""}
  </div>

  <table>
    <thead><tr>
      <th>Status</th><th>API</th><th>Response Preview</th><th style="text-align:right">Time</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <p style="color:#1a2d3f;font-size:11px;margin-top:16px;text-align:center">
    InvestBeans · Kite Connect API Test · All times in ms
  </p>
</body></html>`);
});

export default router;