// Backend/src/utils/kiteWebSocket.js
// ── UPDATED: MCX commodity tokens added ──
// Uses official kiteconnect npm package
// Auto-fetches current MCX contract tokens from Kite instruments API
// so tokens stay valid as contracts roll over each month

import { KiteTicker } from "kiteconnect";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────
// NSE INSTRUMENT TOKEN MAP (static — these never change)
// ─────────────────────────────────────────────────────────────────
export const TOKEN_SYMBOL = {
  // NSE Indices
  256265:  "NSE:NIFTY 50",
  260105:  "NSE:NIFTY BANK",
  258529:  "NSE:NIFTY IT",
  258049:  "NSE:NIFTY AUTO",
  259849:  "NSE:NIFTY PHARMA",
  // BSE Indices
  265:     "BSE:SENSEX",
  // NSE Top Stocks
  738561:  "NSE:RELIANCE",
  2953217: "NSE:TCS",
  341249:  "NSE:HDFCBANK",
  408065:  "NSE:INFY",
  1270529: "NSE:ICICIBANK",
  969473:  "NSE:WIPRO",
  356865:  "NSE:HINDUNILVR",
  424961:  "NSE:ITC",
};

// MCX commodity token map — populated dynamically at runtime
// Key = instrument_token, Value = "MCX:SYMBOL" string
export const MCX_TOKEN_SYMBOL = {};

// Reverse map: "MCX:GOLD" → token number
export const MCX_SYMBOL_TOKEN = {};

// Combined map used for tick lookup
export let ACTIVE_TOKEN_SYMBOL = { ...TOKEN_SYMBOL };

export const SYMBOL_TOKEN = Object.fromEntries(
  Object.entries(TOKEN_SYMBOL).map(([k, v]) => [v, Number(k)])
);

// ─────────────────────────────────────────────────────────────────
// MCX COMMODITY CONFIG
// tradingSymbol: the base symbol name in Kite instruments dump
// displayName: what we show in the UI
// unit: MCX trading unit
// ─────────────────────────────────────────────────────────────────
const MCX_COMMODITY_CONFIG = [
  {
    tradingSymbol: "GOLD",
    displayName:   "Gold",
    key:           "MCX:GOLD",
    unit:          "₹/10g",
    // MCX Gold lot = 1 kg = 100 × 10g, price quoted per 10g
  },
  {
    tradingSymbol: "SILVER",
    displayName:   "Silver",
    key:           "MCX:SILVER",
    unit:          "₹/kg",
  },
  {
    tradingSymbol: "CRUDEOIL",
    displayName:   "Crude Oil",
    key:           "MCX:CRUDEOIL",
    unit:          "₹/bbl",
  },
  {
    tradingSymbol: "NATURALGAS",
    displayName:   "Natural Gas",
    key:           "MCX:NATURALGAS",
    unit:          "₹/mmBtu",
  },
  {
    tradingSymbol: "COPPER",
    displayName:   "Copper",
    key:           "MCX:COPPER",
    unit:          "₹/kg",
  },
];

// ─────────────────────────────────────────────────────────────────
// FETCH MCX INSTRUMENT TOKENS
// Kite instruments API returns ALL MCX contracts.
// We pick the near-month (soonest expiry after today) for each commodity.
// ─────────────────────────────────────────────────────────────────
export async function fetchMCXTokens(apiKey, accessToken) {
  if (!apiKey || !accessToken) {
    console.warn("⚠️  fetchMCXTokens: missing credentials, skipping");
    return;
  }

  try {
    console.log("🔍 Fetching MCX instrument tokens from Kite...");

    const res = await axios.get("https://api.kite.trade/instruments/MCX", {
      headers: {
        "X-Kite-Version": "3",
        "Authorization": `token ${apiKey}:${accessToken}`,
      },
      timeout: 10000,
    });

    // Response is a CSV string
    const lines = res.data.split("\n").filter(l => l.trim());
    const headers = lines[0].split(",");
    // Headers: instrument_token, exchange_token, tradingsymbol, name, last_price,
    //          expiry, strike, tick_size, lot_size, instrument_type, segment, exchange

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse all futures contracts
    const instruments = lines.slice(1).map(line => {
      const cols = line.split(",");
      return {
        instrument_token: parseInt(cols[0]),
        tradingsymbol:    cols[2],
        expiry:           cols[5] ? new Date(cols[5]) : null,
        instrument_type:  cols[9],
        segment:          cols[10],
      };
    }).filter(i =>
      i.instrument_type === "FUT" &&
      i.expiry instanceof Date &&
      !isNaN(i.expiry.getTime()) &&
      i.expiry >= today
    );

    // For each commodity, find the nearest expiry futures contract
    Object.keys(MCX_TOKEN_SYMBOL).forEach(k => delete MCX_TOKEN_SYMBOL[k]);
    Object.keys(MCX_SYMBOL_TOKEN).forEach(k => delete MCX_SYMBOL_TOKEN[k]);

    let foundCount = 0;
    for (const cfg of MCX_COMMODITY_CONFIG) {
      // Filter contracts whose tradingsymbol STARTS WITH the base symbol
      const contracts = instruments.filter(i =>
        i.tradingsymbol.startsWith(cfg.tradingSymbol) &&
        !i.tradingsymbol.includes("MINI") &&
        !i.tradingsymbol.includes("MICRO") &&
        !i.tradingsymbol.includes("PETAL") &&
        !i.tradingsymbol.includes("GUINEA") &&
        !i.tradingsymbol.includes("TEN")
      );

      if (contracts.length === 0) {
        console.warn(`⚠️  No MCX contracts found for ${cfg.tradingSymbol}`);
        continue;
      }

      // Sort by expiry — nearest first
      contracts.sort((a, b) => a.expiry - b.expiry);
      const near = contracts[0];

      MCX_TOKEN_SYMBOL[near.instrument_token] = cfg.key;
      MCX_SYMBOL_TOKEN[cfg.key] = near.instrument_token;

      console.log(`✅ MCX ${cfg.tradingSymbol}: token=${near.instrument_token} symbol=${near.tradingsymbol} expiry=${near.expiry.toISOString().slice(0,10)}`);
      foundCount++;
    }

    // Rebuild active token map
    Object.assign(ACTIVE_TOKEN_SYMBOL, TOKEN_SYMBOL, MCX_TOKEN_SYMBOL);

    console.log(`✅ MCX tokens loaded: ${foundCount}/${MCX_COMMODITY_CONFIG.length} commodities`);
    return MCX_TOKEN_SYMBOL;

  } catch (err) {
    console.error("❌ fetchMCXTokens failed:", err.message);
    // Use hardcoded fallback tokens (approximate — may need update after contract rollover)
    // These are approximate March/April 2026 contract tokens
    // ⚠️ Update these after each monthly rollover by running:
    //    curl -H "X-Kite-Version: 3" -H "Authorization: token API_KEY:ACCESS_TOKEN" \
    //         https://api.kite.trade/instruments/MCX | grep -E "^[0-9]" | grep "FUT" | grep -E "GOLD|SILVER|CRUDEOIL|NATURALGAS|COPPER"
    const FALLBACK_TOKENS = {
      // These tokens are for April 2026 contracts — update monthly
      // To get real tokens: kite.instruments("MCX") and filter FUT nearest expiry
      225177: "MCX:GOLD",       // GOLD26APRFUT
      234230: "MCX:SILVER",     // SILVER26MAYFUT
      239545: "MCX:CRUDEOIL",   // CRUDEOIL26APRFUT
      253577: "MCX:NATURALGAS", // NATURALGAS26MARFUT
      231288: "MCX:COPPER",     // COPPER26MARFUT
    };

    Object.assign(MCX_TOKEN_SYMBOL, FALLBACK_TOKENS);
    Object.assign(MCX_SYMBOL_TOKEN, Object.fromEntries(
      Object.entries(FALLBACK_TOKENS).map(([k, v]) => [v, Number(k)])
    ));
    Object.assign(ACTIVE_TOKEN_SYMBOL, TOKEN_SYMBOL, FALLBACK_TOKENS);

    console.warn("⚠️  Using fallback MCX tokens — prices may be stale after contract rollover");
    return FALLBACK_TOKENS;
  }
}

// ─────────────────────────────────────────────────────────────────
// TOKEN LISTS
// ─────────────────────────────────────────────────────────────────
const INDEX_TOKENS = [256265, 260105, 258529, 258049, 259849, 265];
const STOCK_TOKENS = [738561, 2953217, 341249, 408065, 1270529, 969473, 356865, 424961];
const BASE_TOKENS  = [...INDEX_TOKENS, ...STOCK_TOKENS];

// MCX tokens to subscribe — built dynamically after fetchMCXTokens()
function getMCXTokenList() {
  return Object.keys(MCX_TOKEN_SYMBOL).map(Number).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────
// KiteWebSocketManager
// ─────────────────────────────────────────────────────────────────
export class KiteWebSocketManager {
  constructor() {
    this.ticker    = null;
    this.io        = null;
    this.lastTicks = {};
    this.connected = false;
    this.apiKey    = null;
    this.token     = null;
  }

  attachSocketIO(io) {
    this.io = io;
    console.log("✅ Socket.IO attached to KiteWebSocketManager");
  }

  connect(apiKey, accessToken) {
    this.apiKey = apiKey;
    this.token  = accessToken;

    if (!apiKey || !accessToken) {
      console.warn("⚠️  KiteWS: missing credentials — skipping connect");
      return;
    }

    if (this.ticker) {
      try { this.ticker.disconnect(); } catch (_) {}
    }

    console.log("🔌 Connecting KiteTicker...");
    this.ticker = new KiteTicker({ api_key: apiKey, access_token: accessToken });
    this.ticker.autoReconnect(true, 50, 5);

    this.ticker.on("connect", async () => {
      console.log("✅ KiteTicker CONNECTED");
      this.connected = true;

      // Fetch MCX tokens fresh on every connect (handles monthly rollover)
      await fetchMCXTokens(apiKey, accessToken);

      const mcxTokens  = getMCXTokenList();
      const allTokens  = [...BASE_TOKENS, ...mcxTokens];

      this.ticker.subscribe(allTokens);

      // Full mode for stocks + MCX (gives OHLC + OI for commodities)
      this.ticker.setMode(this.ticker.modeFull,  [...STOCK_TOKENS, ...mcxTokens]);
      // Quote mode for indices
      this.ticker.setMode(this.ticker.modeQuote, INDEX_TOKENS);

      console.log(`📡 Subscribed ${allTokens.length} instruments (${BASE_TOKENS.length} equity + ${mcxTokens.length} MCX)`);
    });

    this.ticker.on("ticks", (ticks) => {
      if (!ticks?.length) return;
      ticks.forEach(tick => {
        const symbol = ACTIVE_TOKEN_SYMBOL[tick.instrument_token];
        if (!symbol) return;

        this.lastTicks[symbol] = {
          symbol,
          instrument_token: tick.instrument_token,
          exchange:      symbol.split(":")[0],        // "NSE" or "MCX"
          tradable:      tick.tradable,
          mode:          tick.mode,
          last_price:    tick.last_price,
          last_quantity: tick.last_quantity,
          avg_price:     tick.average_price,
          volume:        tick.volume         ?? 0,
          buy_quantity:  tick.buy_quantity   ?? 0,
          sell_quantity: tick.sell_quantity  ?? 0,
          // MCX specific — OI is real open interest from the exchange
          oi:            tick.oi             ?? 0,
          oi_day_high:   tick.oi_day_high    ?? 0,
          oi_day_low:    tick.oi_day_low     ?? 0,
          change:        tick.change         ?? 0,
          // OHLC — direct from MCX exchange tick, no calculation needed
          ohlc: tick.ohlc ?? undefined,
          depth: tick.depth ?? undefined,
          ts:   Date.now(),
        };
      });

      if (this.io) this.io.emit("kite:ticks", this.lastTicks);
    });

    this.ticker.on("order_update", (order) => {
      console.log("📋 Order update:", order.order_id, order.status);
      if (this.io) this.io.emit("kite:order_update", order);
    });

    this.ticker.on("error",      (err) => { console.error("❌ KiteTicker error:", err); this.connected = false; });
    this.ticker.on("disconnect", ()    => { console.log("🔌 KiteTicker disconnected"); this.connected = false; });
    this.ticker.on("reconnect",  (c)   => { console.log(`🔄 Reconnecting... attempt ${c}`); });
    this.ticker.on("noreconnect",()    => { console.error("❌ Max reconnect attempts reached"); });

    this.ticker.connect();
  }

  updateToken(accessToken) { this.token = accessToken; this.connect(this.apiKey, accessToken); }
  disconnect() { try { this.ticker?.disconnect(); } catch(_) {} this.ticker = null; this.connected = false; }
  getLastTicks() { return this.lastTicks; }
  getMCXTicks()  {
    // Returns only MCX commodity ticks
    return Object.fromEntries(
      Object.entries(this.lastTicks).filter(([k]) => k.startsWith("MCX:"))
    );
  }
  isConnected()  { return this.connected; }
}

export const kiteWS = new KiteWebSocketManager();