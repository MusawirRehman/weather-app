import { toViewModel } from "../../utils/viewModel";

// ---------- Open-Meteo (key-less, default provider) ----------
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WX_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error (${res.status})`);
  return res.json();
}

/** Worldwide place search with hierarchy (admin1 = province/state, admin2 = district) */
export async function geocode(query, count = 8) {
  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
  const data = await getJson(url);
  return (data.results ?? []).map((r) => ({
    id: `om-${r.id ?? r.name}-${r.latitude}-${r.longitude}`,
    name: r.name,
    admin1: r.admin1 ?? null,
    admin2: r.admin2 ?? null,
    country: r.country ?? null,
    countryCode: r.country_code ?? null,
    lat: r.latitude,
    lon: r.longitude,
    type: "place",
  }));
}

export async function getAirQuality(lat, lon) {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "pm2_5,pm10,us_aqi,european_aqi",
    });
    const data = await getJson(`${AIR_URL}?${params}`);
    return data.current ?? null;
  } catch {
    return null;
  }
}

/** Current + 24h hourly + 7-day forecast (+ moon data) */
export async function getWeather(lat, lon, unit) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation",
    hourly:
      "temperature_2m,precipitation_probability,precipitation,weather_code,visibility,uv_index",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,precipitation_sum,uv_index_max,moonrise,moonset,moon_phase",
    timezone: "auto",
    forecast_days: "10",
    temperature_unit: unit === "f" ? "fahrenheit" : "celsius",
    wind_speed_unit: unit === "f" ? "mph" : "kmh",
  });

  const wx = await getJson(`${WX_URL}?${params}`);
  const [air] = await Promise.all([getAirQuality(lat, lon)]);

  return { wx, air, provider: "Open-Meteo" };
}

/** Re-export the shared normalizer */
export { toViewModel };
