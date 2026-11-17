import { PAKISTAN } from "../data/pakistanLocations";

/** Distance between two coordinates in kilometers */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Find the nearest known Pakistan city within maxKm.
 * Makes GPS location show the ACTUAL city name
 * (e.g. Kohat) instead of a random nearby big city.
 */
export function nearestCity(lat, lon, maxKm = 50) {
  if (lat == null || lon == null) return null;

  let best = null;
  let bestKm = Infinity;

  for (const prov of PAKISTAN.provinces) {
    for (const city of prov.cities) {
      const km = haversineKm(lat, lon, city.lat, city.lon);
      if (km < bestKm) {
        bestKm = km;
        best = {
          name: city.name,
          nameUr: city.ur,
          admin1: prov.name,
          lat: city.lat,
          lon: city.lon,
        };
      }
    }
  }

  return bestKm <= maxKm ? best : null;
}
