import { fmtSpeed, fmtTime, fmtVis, windDir } from "../utils/format";
import { moonEmoji, uvInfo } from "../utils/weatherMappings";
import { effectiveRainChance } from "../utils/weatherSummary";

/** Grid of detail cards — everything from the weather API */
export default function WeatherDetails({ data, unit, lang, t }) {
  const c = data.current;
  const today = data.days[0];
  const uv = uvInfo(c.uv);
  const moon = moonEmoji(today.moonPhase);

  const items = [
    { icon: "💧", label: t.humidity, value: `${Math.round(c.humidity)}%`, bar: c.humidity },
    {
      icon: "🌬️",
      label: t.wind,
      value: fmtSpeed(c.wind, unit),
      arrow: c.windDir,
      sub: `${Math.round(c.windDir)}° ${windDir(c.windDir)}`,
    },
    { icon: "🌀", label: t.gusts, value: fmtSpeed(c.gusts, unit) },
    { icon: "📊", label: t.pressure, value: `${Math.round(c.pressure)} hPa` },
    { icon: "👁️", label: t.visibility, value: fmtVis(c.vis), bar: c.vis != null ? (c.vis / 24000) * 100 : null },
    { icon: "☁️", label: t.clouds, value: `${Math.round(c.cloud)}%`, bar: c.cloud },
    {
      icon: "🌞",
      label: t.uv,
      value: c.uv != null ? `${Math.round(c.uv)}` : "—",
      sub: uv ? t[uv.key] : "",
      subColor: uv?.color,
    },
    { icon: "💧", label: t.rainChance, value: `${effectiveRainChance(data)}%`, bar: effectiveRainChance(data) },
    {
      icon: "🌧️",
      label: t.precipitation,
      value: today.precipSum != null ? `${today.precipSum.toFixed(1)} mm` : "—",
    },
    { icon: "🌅", label: t.sunrise, value: fmtTime(c.sunrise) },
    { icon: "🌇", label: t.sunset, value: fmtTime(c.sunset) },
    {
      icon: moon,
      label: t.moon,
      value: moon,
      sub: `${t.moonrise} ${fmtTime(today.moonrise)} · ${t.moonset} ${fmtTime(today.moonset)}`,
    },
  ];

  return (
    <section id="details" className="card fade-up">
      <h2 className="card-title">{t.current}</h2>
      <div className="details-grid">
        {items.map((it, i) => (
          <div className="detail" key={`${it.label}-${i}`}>
            <div className="detail-head">
              <span className="detail-icon" aria-hidden>{it.icon}</span>
              <span className="detail-label">{it.label}</span>
              {it.arrow != null && (
                <span
                  className="wind-arrow"
                  aria-hidden
                  style={{ transform: `rotate(${it.arrow}deg)` }}
                  title={`${Math.round(it.arrow)}°`}
                >
                  ➤
                </span>
              )}
            </div>
            <div className="detail-value no-urdu">{it.value}</div>
            {it.sub && (
              <div className="detail-sub" style={it.subColor ? { color: it.subColor } : undefined}>
                {it.sub}
              </div>
            )}
            {it.bar != null && it.bar >= 0 && (
              <div className="bar">
                <div className="bar-fill" style={{ width: `${Math.min(100, Math.max(0, it.bar))}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
