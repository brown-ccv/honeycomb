// TEMP: Helper function for interfacing with the old config type
export function useOldConfig(newConfig) {
  const { environment, equipment } = newConfig;

  return {
    USE_ELECTRON: environment === "electron",
    USE_FIREBASE: environment === "firebase",
    USE_MTURK: false, // TODO 228: What's the logic for this? Is it its own environment?
    USE_PROLIFIC: false, // TODO 227: We'll be removing prolific -> passed as URLSearchParam
    USE_PHOTODIODE: equipment.photodiode ? true : false,
    USE_EEG: equipment.eeg ? true : false,
    USE_VOLUME: equipment.audio ? true : false,
    USE_CAMERA: equipment.camera ? true : false,
  };
}

/**
 * Get a query parameter out of the window"s URL
 * @param {*} variable The key to parse
 */
// TODO 199: Can this just use URLSearchParams?
export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) return decodeURIComponent(pair[1]);
  }
}

/**
 * Determine if the code is being run in an Electron process
 * https://github.com/cheton/is-electron/blob/master/index.js
 * @returns {boolean}
 */
export function isElectron() {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    window.process.type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to false
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}
