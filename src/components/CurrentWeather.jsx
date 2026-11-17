import { describeCode } from "../utils/weatherMappings";
import {
  effectiveRainChance,
  getWeatherAlert,
  getWeatherSummary,
  isRainingNow,
} from "../utils/weatherSummary";
import { fmtFullDate, fmtLocalTime, fmtTemp } from "../utils/format";
import { useCountUp } from "../hooks/useCountUp";
import WeatherIcon from "./WeatherIcon";

/**
 * Hero card: place, local time, big temperature (count-up),
 * dynamic condition label, weather summary + severe-weather alert.
 */
export default function CurrentWeather({ place, data, unit, lang, t }) {
  const c = data.current;
  const info = describeCode(c.code, c.isDay, lang);
  const animatedTemp = useCountUp(c.temp);
  const summary = getWeatherSummary(data, t);
  const alert = getWeatherAlert(data, t);
  const raining = isRainingNow(data);

  return (
    <section className="card hero fade-up">
      <div className="hero-top">
        <div>
          <h1 className="hero-place">
            {lang === "ur" && place.nameUr ? place.nameUr : place.name}
          </h1>
          <p className="hero-sub">
            {[place.admin1, place.country].filter(Boolean).join(" • ")}
          </p>
          <p className="hero-date">
            {fmtFullDate(new Date().toISOString(), lang)}
            {data.timezone && (
              <>
                {" · "}
                <span className="no-urdu">🕐 {fmtLocalTime(data.timezone, lang)}</span>
                <span className="hero-local"> ({t.localTime})</span>
              </>
            )}
          </p>
        </div>
        <div className="hero-icon" aria-hidden>
          <WeatherIcon src={c.iconUrl} emoji={info.icon} size="4.5rem" />
        </div>
      </div>

      <div className="hero-temp no-urdu">{fmtTemp(animatedTemp, unit)}</div>

      {/* Dynamic condition — changes with the actual weather */}
      <p className="hero-cond">
        <span aria-hidden>{info.icon}</span> {info.label}
        {raining && (
          <span className="rain-badge">🌧️ {t.now}</span>
        )}
        {data.cached && (
          <span className="cached-badge">📦 {t.cached}</span>
        )}
      </p>

      {/* Rain expectation summary */}
      {summary && <p className="hero-summary">{summary}</p>}

      {/* Severe weather alert banner */}
      {alert && (
        <div className={`alert-banner ${alert.level}`} role="alert">
          <span aria-hidden>{alert.icon}</span>
          <span>{alert.text}</span>
        </div>
      )}

      <div className="hero-stats">
        <div className="hstat">
          <span className="hstat-label">{t.feelsLike}</span>
          <span className="hstat-value no-urdu">{fmtTemp(c.feels, unit)}</span>
        </div>
        <div className="hstat">
          <span className="hstat-label">{t.high}</span>
          <span className="hstat-value no-urdu">{fmtTemp(data.days[0].max, unit)}</span>
        </div>
        <div className="hstat">
          <span className="hstat-label">{t.low}</span>
          <span className="hstat-value no-urdu">{fmtTemp(data.days[0].min, unit)}</span>
        </div>
        <div className="hstat">
          <span className="hstat-label">{t.rainChance}</span>
          <span className="hstat-value no-urdu">{effectiveRainChance(data)}%</span>
        </div>
      </div>
    </section>
  );
}
