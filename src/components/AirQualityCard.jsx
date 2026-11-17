import { aqiInfo } from "../utils/weatherMappings";

/** Air quality card (AQI, PM2.5, PM10) — hidden when data unavailable */
export default function AirQualityCard({ air, lang, t }) {
  if (!air) return null;
  const info = aqiInfo(air.usAqi);

  return (
    <section className="card fade-up">
      <h2 className="card-title">{t.airQuality}</h2>
      <div className="aqi-grid">
        <div className="aqi-main" style={{ borderColor: info?.color ?? "transparent" }}>
          <span className="aqi-value no-urdu" style={{ color: info?.color }}>
            {air.usAqi ?? "—"}
          </span>
          <span className="aqi-label">{info ? t[info.key] : ""}</span>
          <span className="aqi-sub no-urdu">{t.usAqi}</span>
        </div>
        <div className="aqi-item">
          <span className="aqi-k no-urdu">{t.pm25}</span>
          <span className="aqi-v no-urdu">{air.pm25 != null ? `${air.pm25.toFixed(1)} µg/m³` : "—"}</span>
        </div>
        <div className="aqi-item">
          <span className="aqi-k no-urdu">{t.pm10}</span>
          <span className="aqi-v no-urdu">{air.pm10 != null ? `${air.pm10.toFixed(1)} µg/m³` : "—"}</span>
        </div>
        <div className="aqi-item">
          <span className="aqi-k no-urdu">{t.euAqi}</span>
          <span className="aqi-v no-urdu">{air.euAqi ?? "—"}</span>
        </div>
      </div>
    </section>
  );
}
