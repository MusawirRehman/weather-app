/** Pure-SVG 24-hour temperature line chart */
export default function HourlyChart({ hours, unit, lang, t }) {
  const W = 720;
  const H = 150;
  const P = 26;

  const temps = hours.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;

  const x = (i) => P + (i * (W - 2 * P)) / (hours.length - 1 || 1);
  const y = (v) => H - P - ((v - min) / span) * (H - 2 * P);

  const line = hours.map((h, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(h.temp).toFixed(1)}`).join(" ");
  const area = `${line} L${x(hours.length - 1)},${H - P} L${x(0)},${H - P} Z`;

  return (
    <section className="card fade-up">
      <h2 className="card-title">{t.hourlyChart}</h2>
      <div className="chart-wrap no-urdu">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none" role="img" aria-label={t.hourlyChart}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#tempGrad)" />
          <path d={line} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={x(0)} cy={y(temps[0])} r="4.5" fill="#f1f5f9" stroke="#38bdf8" strokeWidth="2" />
          <text x={P} y={y(min) - 8} className="chart-min">
            {Math.round(min)}°{unit === "f" ? "F" : "C"}
          </text>
          <text x={W - P} y={y(max) - 8} textAnchor="end" className="chart-max">
            {Math.round(max)}°{unit === "f" ? "F" : "C"}
          </text>
        </svg>
      </div>
    </section>
  );
}
