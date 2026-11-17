import { toViewModel } from "../../utils/viewModel";

// ---------- OpenWeatherMap (optional — set VITE_OWM_API_KEY in .env) ----------
const KEY = import.meta.env.VITE_OWM_API_KEY || "";
const BASE = "https://api.openweathermap.org/data/2.5";
const GEO = "https://api.openweathermap.org/geo/1.0/direct";
const ICON = "https://openweathermap.org/img/wn";

export const isAvailable = Boolean(KEY);

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OWM error (${res.status})`);
  return res.json();
}

const iconUrl = (code) => (code ? `${ICON}/${code}@2x.png` : null);

/** Worldwide place search (name, state, country) */
export async function geocode(query, count = 8) {
  const data = await getJson(
    `${GEO}?q=${encodeURIComponent(query)}&limit=${count}&appid=${KEY}`
  );
  return (data ?? []).map((r) => ({
    id: `owm-${r.name}-${r.lat}-${r.lon}`,
    name: r.name,
    admin1: r.state ?? null,
    admin2: null,
    country: r.country ?? null,
    countryCode: r.country ?? null,
    lat: r.lat,
    lon: r.lon,
    type: "place",
  }));
}

/** OWM condition code (3-digit) -> WMO weather code (shared by our UI) */
function owmToWmo(id) {
  if (id === 800) return 0; // clear
  if (id === 801) return 1;
  if (id === 802) return 2;
  if (id === 803 || id === 804) return 3;
  if (id >= 701 && id < 800) return 45; // fog / haze / dust
  if (id >= 600 && id < 700) {
    // snow
    if (id === 600 || id === 620) return 71;
    if (id === 601 || id === 621) return 73;
    if (id === 602 || id === 622) return 75;
    return 73;
  }
  if (id >= 500 && id < 600) {
    // rain
    if (id === 500 || id === 520) return 61;
    if (id === 501 || id === 521) return 63;
    return 65;
  }
  if (id >= 300 && id < 400) return id < 314 ? 51 : 55; // drizzle
  if (id >= 200 && id < 300) return id % 100 >= 90 ? 99 : 95; // thunderstorm
  return 3;
}

function mode(arr) {
  const counts = new Map();
  let best = arr[0];
  let bestCount = 0;
  for (const v of arr) {
    const c = (counts.get(v) ?? 0) + 1;
    counts.set(v, c);
    if (c > bestCount) {
      bestCount = c;
      best = v;
    }
  }
  return best;
}

function isDay(sunrise, sunset) {
  const now = Date.now() / 1000;
  if (!sunrise || !sunset) return 1;
  return now >= sunrise && now < sunset ? 1 : 0;
}

/** Air pollution API -> shared air shape */
async function getAirQuality(lat, lon) {
  try {
    const data = await getJson(
      `${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`
    );
    const a = data.list?.[0];
    if (!a) return null;
    const level = Math.min(5, Math.max(1, a.main?.aqi ?? 2));
    const usAqi = [20, 65, 120, 175, 260][level - 1];
    return {
      pm2_5: a.components?.pm2_5 ?? null,
      pm10: a.components?.pm10 ?? null,
      us_aqi: usAqi,
      european_aqi: usAqi,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch current + 5-day/3-hour forecast + air quality from OWM
 * and normalize into the Open-Meteo-like shape (so the rest of the
 * app stays provider-agnostic). Also returns real weather icon image URLs.
 */
export async function getWeather(lat, lon, unit) {
  const units = unit === "f" ? "imperial" : "metric";
  const toKmh = units === "imperial" ? 1 : 3.6; // OWM metric = m/s

  const [cur, fc] = await Promise.all([
    getJson(`${BASE}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`),
    getJson(`${BASE}/forecast?lat=${lat}&lon=${lon}&units=${units}&cnt=40&appid=${KEY}`),
  ]);
  const [air] = await Promise.all([getAirQuality(lat, lon)]);

  const w = cur.weather?.[0] ?? {};
  const list = fc.list ?? [];

  // group 3-hour entries by calendar day
  const byDate = new Map();
  for (const e of list) {
    const date = e.dt_txt.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(e);
  }
  const dates = [...byDate.keys()].slice(0, 7);
  const dayStats = dates.map((d) => {
    const entries = byDate.get(d);
    const midday = entries.reduce((best, e) => {
      const h = Number(e.dt_txt.slice(11, 13));
      const bh = Number(best.dt_txt.slice(11, 13));
      return Math.abs(h - 12) < Math.abs(bh - 12) ? e : best;
    }, entries[0]);
    return {
      temps: entries.map((e) => e.main.temp),
      pops: entries.map((e) => (e.pop ?? 0) * 100),
      codes: entries.map((e) => owmToWmo(e.weather?.[0]?.id ?? 0)),
      rain: entries.reduce((s, e) => s + (e.rain?.["3h"] ?? e.snow?.["3h"] ?? 0), 0),
      midday,
    };
  });

  const sr = cur.sys?.sunrise ?? Date.now() / 1000;
  const ss = cur.sys?.sunset ?? Date.now() / 1000;

  const wx = {
    timezone: cur.timezone ?? "auto",
    current: {
      time: new Date(cur.dt * 1000).toISOString(),
      temperature_2m: cur.main.temp,
      relative_humidity_2m: cur.main.humidity,
      apparent_temperature: cur.main.feels_like,
      is_day: isDay(cur.sys?.sunrise, cur.sys?.sunset),
      weather_code: owmToWmo(w.id ?? 0),
      cloud_cover: cur.clouds?.all ?? 0,
      pressure_msl: cur.main.pressure,
      wind_speed_10m: (cur.wind?.speed ?? 0) * toKmh,
      wind_direction_10m: cur.wind?.deg ?? 0,
      wind_gusts_10m: (cur.wind?.gust ?? cur.wind?.speed ?? 0) * toKmh,
      iconUrl: iconUrl(w.icon),
    },
    hourly: {
      time: list.map((e) => e.dt_txt),
      temperature_2m: list.map((e) => e.main.temp),
      precipitation_probability: list.map((e) => (e.pop ?? 0) * 100),
      precipitation: list.map((e) => e.rain?.["3h"] ?? e.snow?.["3h"] ?? 0),
      weather_code: list.map((e) => owmToWmo(e.weather?.[0]?.id ?? 0)),
      visibility: list.map((e) => e.visibility ?? null),
      uv_index: list.map(() => null),
      iconUrls: list.map((e) => iconUrl(e.weather?.[0]?.icon)),
    },
    daily: {
      time: dates,
      weather_code: dayStats.map((d) => mode(d.codes)),
      temperature_2m_max: dayStats.map((d) => Math.max(...d.temps)),
      temperature_2m_min: dayStats.map((d) => Math.min(...d.temps)),
      sunrise: dates.map((_, i) => new Date((sr + i * 86400) * 1000).toISOString()),
      sunset: dates.map((_, i) => new Date((ss + i * 86400) * 1000).toISOString()),
      precipitation_probability_max: dayStats.map((d) => Math.max(...d.pops)),
      precipitation_sum: dayStats.map((d) => d.rain),
      uv_index_max: dates.map(() => null),
      moonrise: dates.map(() => null),
      moonset: dates.map(() => null),
      moon_phase: dates.map(() => null),
      iconUrls: dayStats.map((d) => iconUrl(d.midday.weather?.[0]?.icon)),
    },
  };

  return { wx, air, provider: "OpenWeatherMap" };
}

/** Re-export the shared normalizer */
export { toViewModel };
