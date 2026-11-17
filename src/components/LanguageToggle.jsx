/** English / اردو language switcher */
export default function LanguageToggle({ lang, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === "en" ? "on" : ""}
        onClick={() => onChange("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "ur" ? "on" : ""}
        onClick={() => onChange("ur")}
        aria-pressed={lang === "ur"}
      >
        اردو
      </button>
    </div>
  );
}
