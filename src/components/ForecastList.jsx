import { describeCode } from "../utils/weatherMappings";
import { fmtDay, fmtTemp } from "../utils/format";
import WeatherIcon from "./WeatherIcon";

/** 7-day forecast rows with condition, rain chance and a min-max range bar */
export default function ForecastList({ days, unit, lang, t }) {
  const lo = Math.min(...days.map((d) => d.min));
  const hi = Math.max(...days.map((d) => d.max));
  const span = hi - lo || 1;

  return (
    <section id="forecast" className="card fade-up">
      <h2 className="card-title">{t.forecast}</h2>
      <div className="fc-list">
        {days.map((d, i) => {
          const info = describeCode(d.code, 1, lang);
          const left = ((d.min - lo) / span) * 100;
          const width = Math.max(5, ((d.max - d.min) / span) * 100);
          return (
            <div className={`fc-row ${i === 0 ? "today" : ""}`} key={d.date}>
              <span className="fc-day">{i === 0 ? t.now : fmtDay(d.date, lang)}</span>
              <WeatherIcon
                src={d.iconUrl}
                emoji={info.icon}
                size="1.4rem"
                className="fc-icon"
              />
              <span className={`fc-pop no-urdu ${d.pop == null ? "muted" : ""}`}>
                💧{d.pop != null ? `${Math.round(d.pop)}%` : "—"}
                {d.precipSum != null && d.precipSum > 0 && ` · ${d.precipSum.toFixed(0)}mm`}
              </span>
              <span className="fc-range">
                <span className="fc-min no-urdu">{fmtTemp(d.min, unit)}</span>
                <span className="fc-bar">
                  <span
                    className="fc-bar-fill"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </span>
                <span className="fc-max no-urdu">{fmtTemp(d.max, unit)}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
