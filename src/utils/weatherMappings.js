// ---------- WMO weather code -> label / icon / background scene ----------

const CODE_INFO = {
  0:  { en: "Clear sky",        ur: "صاف آسمان",      icon: "☀️", nightIcon: "🌙" },
  1:  { en: "Mostly clear",     ur: "زیادہ تر صاف",   icon: "🌤️", nightIcon: "🌙" },
  2:  { en: "Partly cloudy",    ur: "جزوی بدل",       icon: "⛅", nightIcon: "☁️" },
  3:  { en: "Overcast",         ur: "مکمل بدل",       icon: "☁️", nightIcon: "☁️" },
  45: { en: "Foggy",            ur: "کوہرہ",          icon: "🌫️", nightIcon: "🌫️" },
  48: { en: "Icy fog",          ur: "برفیلی کوہرہ",   icon: "🌫️", nightIcon: "🌫️" },
  51: { en: "Light drizzle",    ur: "ہلکی بوندیں",    icon: "🌦️", nightIcon: "🌧️" },
  53: { en: "Drizzle",          ur: "بوندیں",         icon: "🌦️", nightIcon: "🌧️" },
  55: { en: "Heavy drizzle",    ur: "زیادہ بوندیں",   icon: "🌧️", nightIcon: "🌧️" },
  56: { en: "Freezing drizzle", ur: "جمی ہوئی بوندیں", icon: "🌧️", nightIcon: "🌧️" },
  57: { en: "Freezing drizzle", ur: "جمی ہوئی بوندیں", icon: "🌧️", nightIcon: "🌧️" },
  61: { en: "Light rain",       ur: "ہلکی بارش",      icon: "🌦️", nightIcon: "🌧️" },
  63: { en: "Rain",             ur: "بارش",           icon: "🌧️", nightIcon: "🌧️" },
  65: { en: "Heavy rain",       ur: "زیادہ بارش",     icon: "🌧️", nightIcon: "🌧️" },
  66: { en: "Freezing rain",    ur: "جمی بارش",       icon: "🌧️", nightIcon: "🌧️" },
  67: { en: "Freezing rain",    ur: "جمی بارش",       icon: "🌧️", nightIcon: "🌧️" },
  71: { en: "Light snow",       ur: "ہلکی برف",       icon: "🌨️", nightIcon: "🌨️" },
  73: { en: "Snow",             ur: "برف",            icon: "❄️", nightIcon: "❄️" },
  75: { en: "Heavy snow",       ur: "زیادہ برف",      icon: "❄️", nightIcon: "❄️" },
  77: { en: "Snow grains",      ur: "برف کے ذرات",    icon: "🌨️", nightIcon: "🌨️" },
  80: { en: "Light showers",    ur: "ہلکی بارش",      icon: "🌦️", nightIcon: "🌧️" },
  81: { en: "Showers",          ur: "بارش",           icon: "🌧️", nightIcon: "🌧️" },
  82: { en: "Violent showers",  ur: "شدید بارش",      icon: "🌧️", nightIcon: "🌧️" },
  85: { en: "Snow showers",     ur: "برفیلی بارش",    icon: "🌨️", nightIcon: "🌨️" },
  86: { en: "Snow showers",     ur: "برفیلی بارش",    icon: "🌨️", nightIcon: "🌨️" },
  95: { en: "Thunderstorm",     ur: "گرجا",           icon: "⛈️", nightIcon: "⛈️" },
  96: { en: "Storm with hail",  ur: "گرجا اور اولہ",  icon: "⛈️", nightIcon: "⛈️" },
  97: { en: "Heavy thunderstorm", ur: "زیادہ شدید گرجا", icon: "⛈️", nightIcon: "⛈️" },
  99: { en: "Storm with hail",  ur: "گرجا اور اولہ",  icon: "⛈️", nightIcon: "⛈️" },
};

/** Human readable condition name + icon (day/night aware) */
export function describeCode(code, isDay = 1, lang = "en") {
  const info = CODE_INFO[code] ?? { en: "Unknown", ur: "نامعلوم", icon: "🌡️", nightIcon: "🌡️" };
  return {
    label: lang === "ur" ? info.ur : info.en,
    icon: isDay ? info.icon : info.nightIcon,
  };
}

/** Map a WMO code + day/night to a visual scene (gradient + related photos) */
export function sceneFor(code, isDay = 1) {
  if (code === 0 || code === 1) return isDay ? SCENES.clearDay : SCENES.clearNight;
  if (code === 2) return SCENES.partly;
  if (code === 3) return SCENES.cloudy;
  if (code === 45 || code === 48) return SCENES.fog;
  if ([51, 53, 55, 56, 57].includes(code)) return SCENES.drizzle;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return SCENES.rain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return SCENES.snow;
  if ([95, 96, 99].includes(code)) return SCENES.storm;
  return SCENES.cloudy;
}

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const SCENES = {
  clearDay: {
    gradient: "linear-gradient(135deg,#1e6fd9 0%,#56b4e9 55%,#f2b64b 135%)",
    images: [unsplash("photo-1504608524841-42fe6f032b4b"), unsplash("photo-1470252649378-9c29740c9fa8"), unsplash("photo-1500530855697-b586d89ba3ee")],
  },
  clearNight: {
    gradient: "linear-gradient(135deg,#0b1026 0%,#1b2a4a 60%,#2c3e70 100%)",
    images: [unsplash("photo-1419242902214-272b3f66ee7a"), unsplash("photo-1519681393784-d120267933ba"), unsplash("photo-1462331940025-496dfbfc7564")],
  },
  partly: {
    gradient: "linear-gradient(135deg,#355c7d 0%,#6c9a8b 100%)",
    images: [unsplash("photo-1428592953211-077101b2021b"), unsplash("photo-1470071459604-3b5ec3a7fe05")],
  },
  cloudy: {
    gradient: "linear-gradient(135deg,#485563 0%,#29323c 100%)",
    images: [unsplash("photo-1428592953211-077101b2021b"), unsplash("photo-1441974231531-c6227db76b6e")],
  },
  fog: {
    gradient: "linear-gradient(135deg,#4b5866 0%,#2f3a45 100%)",
    images: [unsplash("photo-1470071459604-3b5ec3a7fe05"), unsplash("photo-1441974231531-c6227db76b6e")],
  },
  drizzle: {
    gradient: "linear-gradient(135deg,#50616e 0%,#2c3a45 100%)",
    images: [unsplash("photo-1534088568595-a066f410bcda"), unsplash("photo-1428592953211-077101b2021b")],
  },
  rain: {
    gradient: "linear-gradient(135deg,#233344 0%,#0f1c28 100%)",
    images: [unsplash("photo-1534088568595-a066f410bcda"), unsplash("photo-1508697014387-db70aad34f4d")],
  },
  snow: {
    gradient: "linear-gradient(135deg,#5d7285 0%,#2e3d4d 100%)",
    images: [unsplash("photo-1418985991508-e47386d96a71"), unsplash("photo-1476820865390-c52aeebb9891")],
  },
  storm: {
    gradient: "linear-gradient(135deg,#141e30 0%,#243b55 100%)",
    images: [unsplash("photo-1501630834273-4b5604d2ee31"), unsplash("photo-1519692933481-e162a57d6721")],
  },
};

/** Moon phase (0..1) -> emoji (0 = new moon, 0.5 = full moon) */
export function moonEmoji(phase) {
  if (phase == null || Number.isNaN(phase)) return "🌙";
  const p = ((phase % 1) + 1) % 1;
  if (p < 0.03 || p > 0.97) return "🌑";
  if (p < 0.22) return "🌒";
  if (p < 0.28) return "🌓";
  if (p < 0.47) return "🌔";
  if (p < 0.53) return "🌕";
  if (p < 0.72) return "🌖";
  if (p < 0.78) return "🌗";
  return "🌘";
}

/** UV index -> label key + color */
export function uvInfo(v) {
  if (v == null || Number.isNaN(v)) return null;
  if (v < 3) return { key: "uvLow", color: "#22c55e" };
  if (v < 6) return { key: "uvModerate", color: "#eab308" };
  if (v < 8) return { key: "uvHigh", color: "#f97316" };
  if (v < 11) return { key: "uvVeryHigh", color: "#ef4444" };
  return { key: "uvExtreme", color: "#a855f7" };
}

/** US AQI -> label key + color */
export function aqiInfo(v) {
  if (v == null || Number.isNaN(v)) return null;
  if (v <= 50) return { key: "aqiGood", color: "#22c55e" };
  if (v <= 100) return { key: "aqiModerate", color: "#eab308" };
  if (v <= 150) return { key: "aqiUsg", color: "#f97316" };
  if (v <= 200) return { key: "aqiUnhealthy", color: "#ef4444" };
  if (v <= 300) return { key: "aqiVery", color: "#a855f7" };
  return { key: "aqiHazardous", color: "#7f1d1d" };
}
