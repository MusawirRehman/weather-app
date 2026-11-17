// ---------- Formatting helpers (dates, units, wind, visibility) ----------

/** Find index of the hourly entry closest to "now" */
export function currentHourIndex(times) {
  const now = Date.now();
  let best = 0;
  let bestDiff = Infinity;
  times.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

/** 25.4 + "c" => "25°C"  |  unit "f" => "77°F" */
export function fmtTemp(value, unit) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°${unit === "f" ? "F" : "C"}`;
}

/** "2026-10-10T06:30" -> "6:30 AM" */
export function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T00:00` : iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** "2026-10-10" -> "Sat" (or "ہفتہ" for ur) */
export function fmtDay(dateStr, lang) {
  if (!dateStr) return "—";
  const d = new Date(dateStr.length === 10 ? `${dateStr}T00:00` : dateStr);
  return d.toLocaleDateString(lang === "ur" ? "ur-PK" : "en-US", { weekday: "short" });
}

/** Full date for hero: "Saturday, 10 October" */
export function fmtFullDate(iso, lang) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "ur" ? "ur-PK" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Hour label for hourly strip: "Now", "1 PM" */
export function fmtHour(iso, lang, isFirst) {
  if (isFirst) return lang === "ur" ? "اب" : "Now";
  const d = new Date(iso);
  return d.toLocaleTimeString(lang === "ur" ? "ur-PK" : "en-US", { hour: "numeric" });
}

/** Degrees -> compass letters (0 -> N, 180 -> S) */
export function windDir(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(((deg % 360) / 22.5)) % 16];
}

export function fmtSpeed(v, unit) {
  if (v == null || Number.isNaN(v)) return "—";
  return `${Math.round(v)} ${unit === "f" ? "mph" : "km/h"}`;
}

export function fmtVis(m) {
  if (m == null || Number.isNaN(m)) return "—";
  return m >= 1000 ? `${(m / 1000).toFixed(m >= 10000 ? 0 : 1)} km` : `${Math.round(m)} m`;
}

/** Last updated time, e.g. "3:45 PM" */
export function fmtUpdated(iso) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00` : iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** Local time at the searched place (uses the API-provided timezone) */
export function fmtLocalTime(timezone, lang) {
  try {
    return new Date().toLocaleTimeString(lang === "ur" ? "ur-PK" : "en-US", {
      timeZone: timezone ?? undefined,
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
}
