import { useCallback, useState } from "react";
import { reverseGeocode } from "../api/weatherApi";
import { nearestCity } from "../utils/nearestCity";

/**
 * Browser geolocation + reverse geocoding.
 * Snaps to the nearest known Pakistan city (within 50 km) so the
 * ACTUAL city name shows — e.g. Kohat instead of a random big city.
 * { place, loading, error, locate() }
 */
export function useGeolocation() {
  const [state, setState] = useState({ place: null, loading: false, error: null });

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ place: null, loading: false, error: "unsupported" });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Prefer the nearest known city for accurate naming
        const near = nearestCity(latitude, longitude);
        if (near) {
          setState({
            place: {
              name: near.name,
              nameUr: near.nameUr,
              admin1: near.admin1,
              country: "Pakistan",
              lat: near.lat,
              lon: near.lon,
            },
            loading: false,
            error: null,
          });
          return;
        }

        try {
          const place = await reverseGeocode(latitude, longitude);
          setState({
            place: { ...place, lat: latitude, lon: longitude },
            loading: false,
            error: null,
          });
        } catch {
          setState({
            place: {
              name: "Current Location",
              admin1: null,
              country: null,
              lat: latitude,
              lon: longitude,
            },
            loading: false,
            error: null,
          });
        }
      },
      (err) => {
        setState({ place: null, loading: false, error: err.code === 1 ? "denied" : "failed" });
      },
      { timeout: 10000, maximumAge: 600000, enableHighAccuracy: true }
    );
  }, []);

  return { ...state, locate };
}
