import { useCallback, useState } from "react";

const KEY = "weather-app-recents-v1";

/** Recent searches persisted in localStorage (max 6) */
export function useRecents() {
  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? [];
    } catch {
      return [];
    }
  });

  const push = useCallback((place) => {
    if (!place?.lat && !place?.lon) return;
    setRecents((prev) => {
      const entry = {
        key: `${place.lat},${place.lon}`,
        name: place.name,
        admin1: place.admin1 ?? null,
        country: place.country ?? null,
        lat: place.lat,
        lon: place.lon,
      };
      const next = [entry, ...prev.filter((p) => p.key !== entry.key)].slice(0, 6);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecents([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { recents, push, clear };
}
