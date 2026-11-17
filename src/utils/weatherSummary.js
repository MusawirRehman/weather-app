import { describeCode } from "./weatherMappings";

/** Codes that mean rain is occurring right now */
const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
const SNOW_CODES = [71, 73, 75, 77, 85, 86];

/**
 * Is it raining / snowing RIGHT NOW?
 * Based on observed precipitation (mm) or the current weather code —
 * much more reliable than the model's probability percentage.
 */
export function isRainingNow(data) {
  const c = data.current;
  if (c.precipMM != null && c.precipMM > 0) return true;
  return RAIN_CODES.includes(c.code) || SNOW_CODES.includes(c.code);
}

/**
 * Rain chance that matches what's actually happening outside:
 * if it's raining now -> 100%, otherwise the model probability.
 */
export function effectiveRainChance(data) {
  if (isRainingNow(data)) return 100;
  const c = data.current;
  const today = data.days[0];
  return Math.round(today.pop ?? c.pop ?? 0);
}

/**
 * Plain-language summary shown under the temperature.
 * Reflects rain expectation + expected precipitation amount.
 */
export function getWeatherSummary(data, t) {
  const c = data.current;
  const today = data.days[0];
  const pop = today.pop ?? c.pop;
  const isSnow = [71, 73, 75, 77, 85, 86].includes(today.code ?? c.code);
  const parts = [];

  // Observed precipitation right now (more reliable than probability)
  const currentlyWet = c.precipMM != null && c.precipMM > 0;
  if (currentlyWet) {
    parts.push(isSnow || c.temp <= 1 ? t.currentlySnowing : t.currentlyRaining);
    parts.push(`💧 ${c.precipMM.toFixed(1)} mm`);
  } else if (pop != null) {
    if (pop >= 70) {
      parts.push(`${isSnow ? t.snowLikely : t.rainLikely} · ${Math.round(pop)}%`);
    } else if (pop >= 30) {
      parts.push(`${isSnow ? t.snowPossible : t.rainPossible} · ${Math.round(pop)}%`);
    }
  }

  if (today.precipSum != null && today.precipSum > 0.2 && !currentlyWet) {
    parts.push(`💧 ${today.precipSum.toFixed(1)} mm`);
  }

  return parts.join("  ·  ");
}

/**
 * Severe / warning banner for harsh weather:
 * thunderstorms, heavy rain, snow, heat, cold, fog, strong wind.
 */
export function getWeatherAlert(data, t) {
  const c = data.current;
  const today = data.days[0];
  const code = c.code;
  const pop = today.pop ?? c.pop ?? 0;
  const feelsLike = Math.max(c.temp ?? 0, c.feels ?? 0);

  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return { level: "severe", icon: "⛈️", text: t.stormAlert };
  }

  // Snow
  if (
    [71, 73, 75, 77, 85, 86].includes(code) &&
    (today.max < 3 || pop > 50)
  ) {
    return { level: "severe", icon: "❄️", text: t.snowAlert };
  }

  // Heavy rain
  if ([63, 65, 81, 82].includes(code) || pop >= 80) {
    return { level: "warn", icon: "🌧️", text: t.heavyRainAlert };
  }

  // Fog
  if ([45, 48].includes(code)) {
    return { level: "warn", icon: "🌫️", text: t.fogAlert };
  }

  // Heat
  if (feelsLike >= 35) {
    return { level: "warn", icon: "🔥", text: t.heatAlert };
  }

  // Freezing cold
  if (c.temp <= 0) {
    return { level: "warn", icon: "🥶", text: t.coldAlert };
  }

  // Strong wind
  if ((c.wind ?? 0) >= 50) {
    return { level: "warn", icon: "🌬️", text: t.windyAlert };
  }

  return null;
}

/**
 * Full condition sentence, e.g. "Light rain · Rain likely today · 80%"
 */
export function getConditionSentence(data, lang, t) {
  const c = data.current;
  const info = describeCode(c.code, c.isDay, lang);
  const summary = getWeatherSummary(data, t);
  return [info.label, summary].filter(Boolean).join(" · ");
}
