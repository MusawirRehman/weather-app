import * as openMeteo from "./providers/openmeteo";
import * as openWeatherMap from "./providers/openweathermap";
import * as wttrIn from "./providers/wttrin";

/** Photon (OpenStreetMap) geocoding — key-less last resort */
async function photonGeocode(query, count = 8) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${count}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photon error (${res.status})`);
  const j = await res.json();
  return (j.features ?? [])
    .map((f) => {
      const p = f.properties ?? {};
      const coords = f.geometry?.coordinates ?? [];
      if (!coords[0] || !coords[1]) return null;
      return {
        id: `photon-${p.osm_id ?? p.name}-${coords[1]}-${coords[0]}`,
        name: p.name ?? p.city ?? "Unknown",
        admin1: p.state ?? null,
        admin2: p.county ?? null,
        country: p.country ?? null,
        countryCode: null,
        lat: coords[1],
        lon: coords[0],
        type: "place",
      };
    })
    .filter(Boolean);
}

/**
 * Worldwide place search with automatic fallback:
 * OpenWeatherMap (key) -> Open-Meteo -> Photon/OSM
 */
export async function searchPlaces(query, count = 8) {
  if (openWeatherMap.isAvailable) {
    try {
      return await openWeatherMap.geocode(query, count);
    } catch {
      /* try next */
    }
  }
  try {
    return await openMeteo.geocode(query, count);
  } catch {
    /* try next */
  }
  return photonGeocode(query, count);
}

/**
 * Full weather bundle — tries every provider until one succeeds:
 * OpenWeatherMap (key) -> Open-Meteo -> wttr.in
 * Returns the normalized view model + provider name.
 */
export async function fetchFullWeather(location, unit) {
  const errors = [];

  if (openWeatherMap.isAvailable) {
    try {
      const r = await openWeatherMap.getWeather(location.lat, location.lon, unit);
      return { ...openMeteo.toViewModel(r.wx, r.air), provider: r.provider };
    } catch (e) {
      errors.push(`OpenWeatherMap: ${e.message}`);
    }
  }

  try {
    const r = await openMeteo.getWeather(location.lat, location.lon, unit);
    return { ...openMeteo.toViewModel(r.wx, r.air), provider: r.provider };
  } catch (e) {
    errors.push(`Open-Meteo: ${e.message}`);
  }

  try {
    const r = await wttrIn.getWeather(location.lat, location.lon, unit);
    return { ...openMeteo.toViewModel(r.wx, r.air), provider: r.provider };
  } catch (e) {
    errors.push(`wttr.in: ${e.message}`);
  }

  throw new Error(errors.join(" | ") || "all-providers-failed");
}

/** Lat/lon -> place name (for the "use my location" button) */
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const PHOTON_REVERSE_URL = "https://photon.komoot.io/reverse";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error (${res.status})`);
  return res.json();
}

/** Photon/OSM reverse geocoding — fallback */
async function photonReverse(lat, lon) {
  const res = await fetch(
    `${PHOTON_REVERSE_URL}?lat=${lat}&lon=${lon}&limit=1&lang=en`
  );
  if (!res.ok) throw new Error(`Photon error (${res.status})`);
  const j = await res.json();
  const p = j.features?.[0]?.properties ?? {};
  return {
    name: p.name || p.city || p.town || p.village || p.county || "Current Location",
    admin1: p.state ?? null,
    country: p.country ?? null,
  };
}

export async function reverseGeocode(lat, lon) {
  try {
    const data = await getJson(
      `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    return {
      name: data.city || data.locality || data.principalSubdivision || "Current Location",
      admin1: data.principalSubdivision ?? null,
      country: data.countryName ?? null,
    };
  } catch {
    return photonReverse(lat, lon);
  }
}

/** Districts have no stored coordinates — resolve them via the geocoding API */
export async function resolveLocation(item) {
  if (item.lat != null && item.lon != null) return item;
  const results = await searchPlaces(item.name, 5);
  const match =
    results.find((r) => r.countryCode === "PK") ??
    results.find((r) => r.country === "Pakistan") ??
    results[0];
  if (!match) throw new Error("not-found");
  return {
    ...item,
    lat: match.lat,
    lon: match.lon,
    admin1: item.admin1 ?? match.admin1,
    country: item.country ?? match.country,
  };
}
