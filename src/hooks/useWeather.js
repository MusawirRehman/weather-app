import { useCallback, useMemo, useRef, useState } from "react";
import { fetchFullWeather } from "../api/weatherApi";

const CACHE_KEY = "weather-app-cache-v1";
const MAX_CACHE = 20;

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeCache(entry) {
  try {
    const cache = readCache();
    cache[entry.key] = entry;
    const keys = Object.keys(cache)
      .sort((a, b) => (cache[b].time ?? 0) - (cache[a].time ?? 0))
      .slice(0, MAX_CACHE);
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(Object.fromEntries(keys.map((k) => [k, cache[k]])))
    );
  } catch {
    /* storage unavailable */
  }
}

/**
 * Weather loader hook — race-condition safe + offline cache.
 * { data, loading, error, load(location, unit) }
 */
export function useWeather() {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const reqId = useRef(0);
  const inFlight = useRef(new Set());

  const load = useCallback(async (location, unit) => {
    const key = `${location.lat},${location.lon}|${unit}`;

    // Skip duplicate in-flight requests
    if (inFlight.current.has(key)) return;
    inFlight.current.add(key);

    const myReq = ++reqId.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const data = await fetchFullWeather(location, unit);
      if (myReq === reqId.current) {
        setState({ data, loading: false, error: null });
        writeCache({ key, data, time: Date.now() });
      }
    } catch (err) {
      if (myReq !== reqId.current) return;
      const cached = readCache()[key];
      // Only use cache if it's fresh (< 30 min) — never show stale weather
      if (cached && Date.now() - (cached.time ?? 0) < 30 * 60 * 1000) {
        setState({ data: { ...cached.data, cached: true }, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: err.message ?? "failed" });
      }
    } finally {
      inFlight.current.delete(key);
    }
  }, []);

  // Memoized so consumers can depend on `load` without re-triggering effects
  return useMemo(() => ({ ...state, load }), [state, load]);
}
