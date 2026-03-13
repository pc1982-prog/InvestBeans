// Frontend/src/hooks/useKiteTicks.ts
// npm install socket.io-client
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Strip /api/v1 from URL — Socket.IO connects to root
const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1")
  .replace("/api/v1", "");

export interface KiteTick {
  symbol:           string;
  instrument_token: number;
  tradable:         boolean;
  mode:             "ltp" | "quote" | "full";
  last_price:       number;
  last_quantity?:   number;
  avg_price?:       number;
  volume?:          number;
  buy_quantity?:    number;
  sell_quantity?:   number;
  oi?:              number;
  oi_day_high?:     number;
  oi_day_low?:      number;
  change?:          number;
  ohlc?: { open: number; high: number; low: number; close: number };
  depth?: {
    buy:  { quantity: number; price: number; orders: number }[];
    sell: { quantity: number; price: number; orders: number }[];
  };
  ts?: number;
}

export type TickMap = Record<string, KiteTick>;

export function useKiteTicks() {
  const [ticks,     setTicks]     = useState<TickMap>({});
  const [connected, setConnected] = useState(false);
  const [wsError,   setWsError]   = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports:          ["websocket", "polling"],
      reconnection:        true,
      reconnectionDelay:   1000,
      reconnectionDelayMax:5000,
      reconnectionAttempts:Infinity,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setConnected(true);
      setWsError(null);
    });

    socket.on("disconnect", reason => {
      console.log("🔌 Socket.IO disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", err => {
      setWsError(err.message);
      setConnected(false);
    });

    // Live Kite ticks
    socket.on("kite:ticks", (incoming: TickMap) => {
      setTicks(prev => ({ ...prev, ...incoming }));
      
    });

    // Order updates
    socket.on("kite:order_update", (order: any) => {
      console.log("📋 Order update:", order);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, []);

  const getTick = useCallback((symbol: string): KiteTick | null =>
    ticks[symbol] ?? null, [ticks]);

  const getChangePct = useCallback((symbol: string): number => {
    const t = ticks[symbol];
    if (!t?.ohlc?.close || !t.last_price) return 0;
    return ((t.last_price - t.ohlc.close) / t.ohlc.close) * 100;
  }, [ticks]);

  return { ticks, connected, wsError, getTick, getChangePct };
}