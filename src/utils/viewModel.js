import { currentHourIndex } from "./format";

/**
 * Normalize any provider's response into one friendly view model:
 * { timezone, current, hours[24], days[7], air }
 * Works for both Open-Meteo and OpenWeatherMap shapes.
 */
export function toViewModel(wx, air) {
  const { current, hourly, daily } = wx;
  const idx = currentHourIndex(hourly.time);
  const at = (arr, i = idx) => (Array.isArray(arr) ? (arr[i] ?? null) : null);

  return {
    timezone: wx.timezone ?? null,
    current: {
      temp: current.temperature_2m,
      feels: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      isDay: current.is_day,
      code: current.weather_code,
      cloud: current.cloud_cover,
      pressure: current.pressure_msl,
      wind: current.wind_speed_10m,
      windDir: current.wind_direction_10m,
      gusts: current.wind_gusts_10m,
      pop: at(hourly.precipitation_probability),
      uv: at(hourly.uv_index),
      vis: at(hourly.visibility),
      time: current.time,
      iconUrl: current.iconUrl ?? null,
      precipMM: current.precipitation ?? null,
      sunrise: daily.sunrise?.[0] ?? null,
      sunset: daily.sunset?.[0] ?? null,
    },
    hours: hourly.time.slice(idx, idx + 24).map((t, i) => ({
      time: t,
      temp: hourly.temperature_2m[idx + i],
      pop: hourly.precipitation_probability?.[idx + i] ?? null,
      precip: hourly.precipitation?.[idx + i] ?? null,
      code: hourly.weather_code[idx + i],
      iconUrl: hourly.iconUrls?.[idx + i] ?? null,
    })),
    days: daily.time.map((t, i) => ({
      date: t,
      code: daily.weather_code[i],
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      pop: daily.precipitation_probability_max?.[i] ?? null,
      precipSum: daily.precipitation_sum?.[i] ?? null,
      uv: daily.uv_index_max?.[i] ?? null,
      moonrise: daily.moonrise?.[i] ?? null,
      moonset: daily.moonset?.[i] ?? null,
      moonPhase: daily.moon_phase?.[i] ?? null,
      iconUrl: daily.iconUrls?.[i] ?? null,
    })),
    air: air
      ? {
          pm25: air.pm2_5 ?? null,
          pm10: air.pm10 ?? null,
          usAqi: air.us_aqi ?? null,
          euAqi: air.european_aqi ?? null,
        }
      : null,
  };
}
