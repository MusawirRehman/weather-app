import { describeCode } from "../utils/weatherMappings";
import { fmtHour, fmtTemp } from "../utils/format";
import WeatherIcon from "./WeatherIcon";

/** Horizontally scrollable strip of the next 24 hours (from the API) */
export default function HourlyStrip({ hours, unit, lang, t }) {
  return (
    <section className="card fade-up">
      <h2 className="card-title">{t.nextHours}</h2>
      <div className="hscroll">
        {hours.map((h, i) => {
          const info = describeCode(h.code, 1, lang);
          return (
            <div className={`hour ${i === 0 ? "now" : ""}`} key={h.time}>
              <span className="hour-time">{fmtHour(h.time, lang, i === 0)}</span>
              <WeatherIcon src={h.iconUrl} emoji={info.icon} size="1.6rem" className="hour-icon" />
              <span className="hour-temp no-urdu">{fmtTemp(h.temp, unit)}</span>
              <span className={`hour-pop no-urdu ${h.pop == null ? "muted" : ""}`}>
                💧{h.pop != null ? `${Math.round(h.pop)}%` : "—"}
              </span>
              {h.precip != null && h.precip > 0 && (
                <span className="hour-mm no-urdu">{h.precip.toFixed(1)} mm</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
