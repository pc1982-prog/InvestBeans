// Backend/src/utils/kiteWebSocket.js
// Uses official kiteconnect npm package — no manual binary parsing needed!
// npm install kiteconnect socket.io

import { KiteTicker } from "kiteconnect";

// ─────────────────────────────────────────────────────────────────
// INSTRUMENT TOKEN MAP
// Token number → "EXCHANGE:SYMBOL" string
// ─────────────────────────────────────────────────────────────────
export const TOKEN_SYMBOL = {
  // Indices NSE
  256265:  "NSE:NIFTY 50",
  260105:  "NSE:NIFTY BANK",
  258529:  "NSE:NIFTY IT",
  258049:  "NSE:NIFTY AUTO",
  259849:  "NSE:NIFTY PHARMA",
  // Indices BSE
  265:     "BSE:SENSEX",
  // Top Stocks NSE
  738561:  "NSE:RELIANCE",
  2953217: "NSE:TCS",
  341249:  "NSE:HDFCBANK",
  408065:  "NSE:INFY",
  1270529: "NSE:ICICIBANK",
  969473:  "NSE:WIPRO",
  356865:  "NSE:HINDUNILVR",
  424961:  "NSE:ITC",
  // Add Forex CDS tokens here after fetching:
  // curl https://api.kite.trade/instruments/CDS | grep USDINR | head -1
};

export const SYMBOL_TOKEN = Object.fromEntries(
  Object.entries(TOKEN_SYMBOL).map(([k, v]) => [v, Number(k)])
);

const INDEX_TOKENS = [256265, 260105, 258529, 258049, 259849, 265];
const STOCK_TOKENS = [738561, 2953217, 341249, 408065, 1270529, 969473, 356865, 424961];
const ALL_TOKENS   = [...INDEX_TOKENS, ...STOCK_TOKENS];

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

    this.ticker.on("connect", () => {
      console.log("✅ KiteTicker CONNECTED");
      this.connected = true;
      this.ticker.subscribe(ALL_TOKENS);
      this.ticker.setMode(this.ticker.modeFull,  STOCK_TOKENS);
      this.ticker.setMode(this.ticker.modeQuote, INDEX_TOKENS);
      console.log(`📡 Subscribed ${ALL_TOKENS.length} instruments`);
    });

    this.ticker.on("ticks", (ticks) => {
      if (!ticks?.length) return;
      ticks.forEach(tick => {
        const symbol = TOKEN_SYMBOL[tick.instrument_token];
        if (!symbol) return;
        this.lastTicks[symbol] = {
          symbol,
          instrument_token: tick.instrument_token,
          tradable:      tick.tradable,
          mode:          tick.mode,
          last_price:    tick.last_price,
          last_quantity: tick.last_quantity,
          avg_price:     tick.average_price,
          volume:        tick.volume       ?? 0,
          buy_quantity:  tick.buy_quantity ?? 0,
          sell_quantity: tick.sell_quantity ?? 0,
          oi:            tick.oi            ?? 0,
          oi_day_high:   tick.oi_day_high   ?? 0,
          oi_day_low:    tick.oi_day_low    ?? 0,
          change:        tick.change        ?? 0,
          ohlc:          tick.ohlc ?? undefined,
          depth:         tick.depth ?? undefined,
          ts:            Date.now(),
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
    this.ticker.on("reconnect",  (c,i) => { console.log(`🔄 Reconnecting... attempt ${c}`); });
    this.ticker.on("noreconnect",()    => { console.error("❌ Max reconnect attempts reached"); });

    this.ticker.connect();
  }

  updateToken(accessToken) { this.token = accessToken; this.connect(this.apiKey, accessToken); }
  disconnect() { try { this.ticker?.disconnect(); } catch(_) {} this.ticker = null; this.connected = false; }
  getLastTicks() { return this.lastTicks; }
  isConnected()  { return this.connected; }
}

export const kiteWS = new KiteWebSocketManager();