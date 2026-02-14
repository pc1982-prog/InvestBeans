// ============================================================
// InvestBeans — useGlobalMarkets Hook (FINAL SIMPLIFIED)
// Sirf ek service call — backend proxy se sab aata hai
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { GlobalMarketData, LoadingState } from "../services/globalMarkets/types";
import { fetchGlobalMarkets, invalidateCache } from "../services/globalMarkets/globalMarketsService";

const CACHE_MS = Number(import.meta.env.VITE_CACHE_DURATION) || 900_000;

export interface UseGlobalMarketsReturn {
  data:        GlobalMarketData | null;
  loading:     LoadingState;
  error:       string | null;
  lastUpdated: Date | null;
  refresh:     () => Promise<void>;
}

export function useGlobalMarkets(): UseGlobalMarketsReturn {
  const [data,        setData]        = useState<GlobalMarketData | null>(null);
  const [loading,     setLoading]     = useState<LoadingState>("idle");
  const [error,       setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchingRef                   = useRef(false);

  const fetchAll = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading("loading");
    setError(null);

    try {
      const result = await fetchGlobalMarkets();
      setData(result);
      setLoading("success");
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("[useGlobalMarkets]", err);
      setError(err?.message ?? "Failed to load market data");
      setLoading("error");
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const refresh = useCallback(async () => {
    invalidateCache();
    await fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, CACHE_MS);
    return () => clearInterval(timer);
  }, [fetchAll]);

  return { data, loading, error, lastUpdated, refresh };
}