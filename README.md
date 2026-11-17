# 🌦️ Weather Now — Full Functional Weather App

React + Vite par bani ek complete weather app. **Sab kuch API se** — koi hardcoded weather data nahi.
**3-provider fallback chain** — ek API fail ho to agli try hoti hai, app kabhi atakta nahi:

1. **OpenWeatherMap** (agar free API key set hai)
2. **Open-Meteo** (key-less, default)
3. **wttr.in** (key-less, last resort)

Plus **offline cache** — agar sab APIs down hain to last saved data 📦 badge ke saath dikhta hai.

**Search bhi resilient hai:** OpenWeatherMap → Open-Meteo → Photon (OpenStreetMap) geocoding.

## ⚡ Features (sab API-driven)

- 🔎 **Smart API search** — autocomplete mein **Country (Pakistan) → Provinces → Cities → Districts (160+)** + puri duniya ke shehrain (multi-API geocoding)
- 🖼️ **Related pictures** — musam ke mutabiq background photos + **real weather icon images** (API se)
- 🌡️ **°C / °F toggle** — temperature aur wind speed dono convert
- 📊 High/Low, feels-like, **rain chance %**, humidity, wind (gusts + direction arrow), pressure, visibility, cloud cover, UV index, sunrise/sunset
- 🌧️ Precipitation (mm) — hourly aur daily
- 🌙 Moon phase, moonrise, moonset (API se)
- 🕐 Ssearched jagah ki **local time** (API timezone se)
- ⏱️ Next 24 hours strip + **SVG temperature chart**
- 📅 **10-day forecast** with rain chance aur temperature range bars
- 🗺️ **Map view** (OpenStreetMap embed)
- 🌬️ Air quality (AQI, PM2.5, PM10)
- 📍 "Use my location" (GPS + reverse geocoding API)
- 🕘 Recent searches (localStorage)
- 🇵🇰 **اردو / English** toggle
- 🌗 Day/night aware icons & themes, ⌨️ keyboard navigation, mobile responsive
- 📦 Offline cache — APIs fail hone par bhi last data dikhta hai

## ▶️ Run karo

```bash
npm install
npm run dev
```

## 🔑 Optional: OpenWeatherMap key

1. Free key lo: https://home.openweathermap.org/api_keys
2. `.env` file banao (`.env.example` copy karo):
   ```
   VITE_OWM_API_KEY=your_key_here
   ```
3. `npm run dev` dobara start karo

Key nahi hai to app automatically key-less Open-Meteo use karega — sab kuch phir bhi chalega.

## 📁 Modular structure

```
src/
├── api/
│   ├── weatherApi.js                # provider facade (auto fallback chain)
│   └── providers/
│       ├── openmeteo.js             # key-less provider (geocode + weather + air)
│       ├── openweathermap.js        # optional provider (key se, + icon images)
│       └── wttrin.js                # key-less last-resort provider
├── data/pakistanLocations.js        # Pakistan: provinces → cities → districts (instant search index)
├── hooks/                           # useWeather, useDebounce, useGeolocation, useRecents
├── components/                      # SearchBar, CurrentWeather, WeatherDetails,
│                                    # HourlyStrip, HourlyChart, ForecastList,
│                                    # AirQualityCard, WeatherIcon, BackgroundImage, toggles, states
├── utils/format.js                  # units, dates, wind, local time
├── utils/weatherMappings.js         # WMO codes → labels/icons/scenes/photos, UV & AQI, moon
├── utils/viewModel.js               # kisi bhi provider ka response → app view model
├── translations.js                  # EN + UR strings
├── App.jsx                          # composition + state
└── main.jsx
```

## 🌐 APIs used (all free)

- **Open-Meteo** — geocoding + weather forecast + air quality (key-less, default)
- **OpenWeatherMap** — optional, free key se (weather, geocoding, air pollution, condition icon images)
- **wttr.in** — key-less fallback weather provider
- **Photon (OpenStreetMap)** — key-less fallback geocoding
- **bigdatacloud** — reverse geocoding (GPS location ka naam)
- **Unsplash** — background photos (image fail hone par gradient fallback)
