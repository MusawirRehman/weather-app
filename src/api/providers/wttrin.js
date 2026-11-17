import { toViewModel } from "../../utils/viewModel";

// ---------- wttr.in (key-less fallback provider) ----------
const WTTR = "https://wttr.in";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`wttr.in error (${res.status})`);
  return res.json();
}

/** "06:12 AM" -> minutes since midnight */
function todToMinutes(tod) {
  if (!tod) return null;
  const m = String(tod).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2]);
}

function todToIso(tod, date) {
  const mins = todToMinutes(tod);
  if (mins == null || !date) return null;
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return new Date(`${date}T${h}:${m}:00`).toISOString();
}

/** wttr.in hourly time ("0".."2100") + date -> ISO local time */
function hourToIso(time, date) {
  const t = String(time ?? "0").padStart(4, "0");
  const h = t.slice(0, 2).padStart(2, "0");
  const m = t.slice(2, 4).padStart(2, "0");
  return new Date(`${date}T${h}:${m}:00`).toISOString();
}

/** Weather description text -> WMO code */
function descToWmo(desc) {
  const d = (desc ?? "").toLowerCase();
  if (/thunder/.test(d)) return /hail/.test(d) ? 99 : 95;
  if (/storm/.test(d)) return 95;
  if (/rain|shower|drizzle/.test(d)) {
    if (/drizzle/.test(d)) return 53;
    if (/heavy|torrential|downpour/.test(d)) return 65;
    return 63;
  }
  if (/snow|sleet|blizzard/.test(d)) {
    if (/heavy|blizzard/.test(d)) return 75;
    if (/light/.test(d)) return 71;
    return 73;
  }
  if (/fog|mist|haze|smoke|dust|sand/.test(d)) return 45;
  if (/overcast|cloudy/.test(d)) return 3;
  if (/partly|broken|few clouds/.test(d)) return 2;
  if (/clear|sunny|fair/.test(d)) return 0;
  return 2;
}

/** Moon phase name -> 0..1 (0 = new, 0.5 = full) */
function moonPhaseToNum(phase) {
  const p = (phase ?? "").toLowerCase();
  if (p.includes("new")) return 0;
  if (p.includes("first quarter")) return 0.25;
  if (p.includes("last quarter")) return 0.75;
  if (p.includes("full")) return 0.5;
  if (p.includes("waxing crescent")) return 0.12;
  if (p.includes("waxing gibbous")) return 0.38;
  if (p.includes("waning gibbous")) return 0.62;
  if (p.includes("waning crescent")) return 0.88;
  return 0.1;
}

function currentIsDay(astro) {
  const sr = todToMinutes(astro?.sunrise);
  const ss = todToMinutes(astro?.sunset);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (sr != null && ss != null) return nowMin >= sr && nowMin < ss ? 1 : 0;
  return now.getHours() >= 6 && now.getHours() < 18 ? 1 : 0;
}

/**
 * Fetch from wttr.in and normalize into the Open-Meteo-like shape.
 * Gives current + 24 hourly (3 days x 8 slots) + 3-day forecast.
 */
export async function getWeather(lat, lon, unit) {
  const j = await getJson(`${WTTR}/${lat},${lon}?format=j1&lang=en`);

  const cur = j.current_condition?.[0] ?? {};
  const days = j.weather ?? [];
  const today = days[0] ?? {};
  const hourlyAll = days.flatMap((d) =>
    (d.hourly ?? []).map((h) => ({ ...h, __date: d.date }))
  );

  const f = unit === "f";
  const toTemp = (c, ff) => Number(f ? ff : c);
  const wind = Number(cur.windspeedKmph ?? 0) * (f ? 0.621371 : 1);

  const wx = {
    timezone: null,
    current: {
      time: new Date().toISOString(),
      temperature_2m: toTemp(cur.temp_C, cur.temp_F),
      relative_humidity_2m: Number(cur.humidity ?? 0),
      apparent_temperature: toTemp(cur.FeelsLikeC, cur.FeelsLikeF),
      is_day: currentIsDay(today.astronomy?.[0]),
      weather_code: descToWmo(cur.weatherDesc?.[0]?.value),
      cloud_cover: Number(cur.cloudcover ?? 0),
      pressure_msl: Number(cur.pressure ?? 0),
      wind_speed_10m: wind,
      wind_direction_10m: Number(cur.winddirDegree ?? 0),
      wind_gusts_10m: wind,
      iconUrl: cur.weatherIconUrl?.[0]?.value ?? null,
      precipitation: Number(cur.precipMM ?? 0),
    },
    hourly: {
      time: hourlyAll.map((h) => hourToIso(h.time, h.__date)),
      temperature_2m: hourlyAll.map((h) => toTemp(h.tempC, h.tempF)),
      precipitation_probability: hourlyAll.map((h) => Number(h.chanceofrain ?? 0)),
      precipitation: hourlyAll.map((h) => Number(h.precipMM ?? 0)),
      weather_code: hourlyAll.map((h) => descToWmo(h.weatherDesc?.[0]?.value)),
      visibility: hourlyAll.map(() =>
        cur.visibility != null ? Number(cur.visibility) * 1000 : null
      ),
      uv_index: hourlyAll.map((h) => (h.uvIndex != null ? Number(h.uvIndex) : null)),
      iconUrls: hourlyAll.map((h) => h.weatherIconUrl?.[0]?.value ?? null),
    },
    daily: {
      time: days.map((d) => d.date),
      weather_code: days.map((d) =>
        descToWmo(d.hourly?.[4]?.weatherDesc?.[0]?.value ?? d.hourly?.[0]?.weatherDesc?.[0]?.value)
      ),
      temperature_2m_max: days.map((d) => Number(d.maxtempC)),
      temperature_2m_min: days.map((d) => Number(d.mintempC)),
      sunrise: days.map((d) => todToIso(d.astronomy?.[0]?.sunrise, d.date)),
      sunset: days.map((d) => todToIso(d.astronomy?.[0]?.sunset, d.date)),
      precipitation_probability_max: days.map((d) =>
        Math.max(0, ...(d.hourly ?? []).map((h) => Number(h.chanceofrain ?? 0)))
      ),
      precipitation_sum: days.map((d) =>
        (d.hourly ?? []).reduce((s, h) => s + Number(h.precipMM ?? 0), 0)
      ),
      uv_index_max: days.map((d) =>
        Math.max(0, ...(d.hourly ?? []).map((h) => Number(h.uvIndex ?? 0)))
      ),
      moonrise: days.map((d) => todToIso(d.astronomy?.[0]?.moonrise, d.date)),
      moonset: days.map((d) => todToIso(d.astronomy?.[0]?.moonset, d.date)),
      moon_phase: days.map((d) => moonPhaseToNum(d.astronomy?.[0]?.moon_phase)),
      iconUrls: days.map((d) => d.hourly?.[0]?.weatherIconUrl?.[0]?.value ?? null),
    },
  };

  return { wx, air: null, provider: "wttr.in" };
}

/** Re-export the shared normalizer */
export { toViewModel };
