import { useCallback, useEffect, useState } from "react";
import BackgroundImage from "./components/BackgroundImage";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import HourlyStrip from "./components/HourlyStrip";
import HourlyChart from "./components/HourlyChart";
import ForecastList from "./components/ForecastList";
import AirQualityCard from "./components/AirQualityCard";
import MapCard from "./components/MapCard";
import UnitToggle from "./components/UnitToggle";
import LanguageToggle from "./components/LanguageToggle";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorState from "./components/ErrorState";
import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { useRecents } from "./hooks/useRecents";
import { resolveLocation, reverseGeocode } from "./api/weatherApi";
import { isAvailable as owmAvailable } from "./api/providers/openweathermap";
import { nearestCity } from "./utils/nearestCity";
import { loadSavedLocation, saveCurrentLocation } from "./utils/locationStorage";
import { sceneFor } from "./utils/weatherMappings";
import { STR } from "./translations";

const DEFAULT_PLACE = {
  name: "Islamabad",
  admin1: "Islamabad Capital Territory",
  country: "Pakistan",
  lat: 33.6844,
  lon: 73.0479,
};

export default function App() {
  const [unit, setUnit] = useState("c"); // "c" | "f"
  const [lang, setLang] = useState("en"); // "en" | "ur"
  const [place, setPlace] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [locOff, setLocOff] = useState(false);

  const t = STR[lang];
  const weather = useWeather();
  const geo = useGeolocation();
  const { recents, push, clear } = useRecents();

  const load = useCallback(
    (loc) => {
      setPlace(loc);
      push(loc);
      setSearchError(null);
    },
    [push]
  );

  // Fetch weather whenever place or unit changes
  useEffect(() => {
    if (place) weather.load(place, unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, unit]);

  /** Build a place from GPS coordinates — snaps to the nearest
   *  known Pakistan city (e.g. Kohat) for accurate naming. */
  const locationFromCoords = useCallback(async (lat, lon) => {
    const near = nearestCity(lat, lon);
    if (near) {
      return {
        name: near.name,
        nameUr: near.nameUr,
        admin1: near.admin1,
        country: "Pakistan",
        lat: near.lat,
        lon: near.lon,
        auto: true,
      };
    }
    try {
      const place = await reverseGeocode(lat, lon);
      return { ...place, lat, lon, auto: true };
    } catch {
      return {
        name: "Current Location",
        admin1: null,
        country: null,
        lat,
        lon,
        auto: true,
      };
    }
  }, []);

  /**
   * First launch:
   *  1. Saved current location (if any) -> show instantly
   *  2. Auto-detect GPS -> update + save
   *  3. Location off/denied -> alert + Islamabad fallback
   */
  useEffect(() => {
    let cancelled = false;
    const saved = loadSavedLocation();

    if (saved && saved.lat != null) {
      load(saved);
    }

    if (!("geolocation" in navigator)) {
      if (!saved) load(DEFAULT_PLACE);
      setLocOff(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        const loc = await locationFromCoords(
          pos.coords.latitude,
          pos.coords.longitude
        );
        saveCurrentLocation(loc);
        if (cancelled) return;
        // Only switch when the city actually changed
        setPlace((prev) =>
          prev && prev.lat === loc.lat && prev.lon === loc.lon ? prev : loc
        );
        setSearchError(null);
      },
      () => {
        if (cancelled) return;
        if (!loadSavedLocation()) load(DEFAULT_PLACE);
        setLocOff(true);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 300000 }
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Use my location" button succeeded -> save + show
  useEffect(() => {
    if (geo.place) {
      const loc = {
        name: geo.place.name,
        nameUr: geo.place.nameUr,
        admin1: geo.place.admin1,
        country: geo.place.country,
        lat: geo.place.lat,
        lon: geo.place.lon,
        auto: true,
      };
      saveCurrentLocation(loc);
      load(loc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.place]);

  // Location denied/off -> show the enable-location alert
  useEffect(() => {
    if (geo.error) setLocOff(true);
  }, [geo.error]);

  // User picked a search result (resolve districts without coordinates)
  const handleSelect = async (item) => {
    setResolving(true);
    setSearchError(null);
    try {
      const resolved = await resolveLocation(item);
      load(resolved);
    } catch {
      setSearchError(t.noResults);
    } finally {
      setResolving(false);
    }
  };

  // Dynamic background scene from the current condition
  const scene = weather.data
    ? sceneFor(weather.data.current.code, weather.data.current.isDay)
    : null;

  return (
    <div className={`app ${lang === "ur" ? "urdu" : ""}`}>
      <BackgroundImage scene={scene} />

      <header className="topbar">
        <div className="brand">
          <span aria-hidden>🌦️</span> <span>{t.appName}</span>
        </div>
        <div className="topbar-controls">
          <UnitToggle unit={unit} onChange={setUnit} />
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>
      </header>

      <main className="container">
        <div id="search">
          <SearchBar
            onSelect={handleSelect}
            lang={lang}
            t={t}
            recents={recents}
            onRecent={(r) =>
              load({ name: r.name, admin1: r.admin1, country: r.country, lat: r.lat, lon: r.lon })
            }
            onClearRecents={clear}
            onLocate={geo.locate}
            locating={geo.loading || resolving}
            locError={geo.error}
          />
        </div>

        {/* Location off alert */}
        {locOff && (
          <div className="loc-alert fade-up" role="alert">
            <span className="loc-alert-icon" aria-hidden>📍</span>
            <span className="loc-alert-text">{t.locationOffAlert}</span>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => {
                setLocOff(false);
                geo.locate();
              }}
            >
              {t.useMyLocation}
            </button>
            <button
              type="button"
              className="loc-alert-close"
              aria-label="Dismiss"
              onClick={() => setLocOff(false)}
            >
              ✕
            </button>
          </div>
        )}

        {searchError && <div className="alert fade-up">⚠️ {searchError}</div>}

        {weather.loading && !weather.data && <LoadingSpinner text={t.loading} />}
        {weather.error && !weather.data && (
          <ErrorState
            message={t.error}
            retryText={t.retry}
            onRetry={() => place && weather.load(place, unit)}
          />
        )}

        {weather.data && place && (
          <>
            <CurrentWeather place={place} data={weather.data} unit={unit} lang={lang} t={t} />
            <WeatherDetails data={weather.data} unit={unit} lang={lang} t={t} />
            <AirQualityCard air={weather.data.air} lang={lang} t={t} />
            <HourlyChart hours={weather.data.hours} unit={unit} lang={lang} t={t} />
            <HourlyStrip hours={weather.data.hours} unit={unit} lang={lang} t={t} />
            <ForecastList days={weather.data.days} unit={unit} lang={lang} t={t} />
            <MapCard place={place} t={t} />
            {weather.loading && <div className="updating no-urdu">• {t.updating} •</div>}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="footer-logo">
              🌦️ <span className="no-urdu">Weather Now</span>
            </span>
            <p className="footer-tagline">{t.footerTagline}</p>
            <p className="footer-about">{t.footerAboutText}</p>
            <p className="footer-sources">
              {t.footerData}: Open-Meteo · OpenWeatherMap · wttr.in · OpenStreetMap
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">{t.footerExplore}</h4>
            <a href="#search">{t.footerSearch}</a>
            <a href="#details">{t.current}</a>
            <a href="#forecast">{t.forecast}</a>
            <a href="#map">{t.map}</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">{t.footerTips}</h4>
            <ul className="footer-tips">
              <li>{t.tipSearch}</li>
              <li>{t.tipLoc}</li>
              <li>{t.tipUnits}</li>
              <li>{t.tipSave}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} <span className="no-urdu">Weather Now</span> · {t.footerRights}
            {" · "}
            <span className="no-urdu">{weather.data ? weather.data.provider : "Open-Meteo"}</span>
            {owmAvailable && <span className="no-urdu"> + OpenWeatherMap</span>}
          </span>
          <span className="footer-made">{t.footerMade}</span>
        </div>
      </footer>
    </div>
  );
}
