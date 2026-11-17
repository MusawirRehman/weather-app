const CURRENT_KEY = "weather-app-current-v1";

/** Load the saved current (GPS) location */
export function loadSavedLocation() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY));
  } catch {
    return null;
  }
}

/** Save the current (GPS) location so it opens by default next time */
export function saveCurrentLocation(loc) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(loc));
  } catch {
    /* storage unavailable */
  }
}
