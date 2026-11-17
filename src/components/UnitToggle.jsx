/** °C / °F segmented control */
export default function UnitToggle({ unit, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Temperature unit">
      <button
        type="button"
        className={unit === "c" ? "on" : ""}
        onClick={() => onChange("c")}
        aria-pressed={unit === "c"}
      >
        °C
      </button>
      <button
        type="button"
        className={unit === "f" ? "on" : ""}
        onClick={() => onChange("f")}
        aria-pressed={unit === "f"}
      >
        °F
      </button>
    </div>
  );
}
