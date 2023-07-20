/**
 * The node environment in which the application is running
 */
// TODO: Will be determined by process.env.REACT_APP_NODE_ENV
export const NODE_ENV = "development"; // "development" | "production" | "test"
console.log("REACT_APP_NODE_ENV", process.env.REACT_APP_NODE_ENV);

/**
 * The physical location in which the application is running
 */
// TODO: Will be determined by process.env.REACT_APP_LOCATION and window.location
export const LOCATION = "home"; // "home" | "clinic"
console.log("REACT_APP_LOCATION", process.env.REACT_APP_LOCATION);
// TODO: Will MTurk be special? Or just UrlSearchParams? https://www.jspsych.org/7.0/overview/mturk/

// TODO: Will be passed into the <Honeycomb /> component directly?
// ? xampp and mysql from JsPsych docs https://www.jspsych.org/7.0/overview/data/#storing-data-permanently-as-a-file
export const DEPLOYMENT = "firebase"; // "firebase" || "local" || "csv" | "custom"

// TODO: Export CONFIG and OLD_CONFIG
export const OLD_CONFIG = {
  USE_ELECTRON: LOCATION === "clinic",
  USE_FIREBASE: DEPLOYMENT === "firebase",
  USE_MTURK: false, // TODO 228: What's the logic for this? Is it its own environment?
  USE_PROLIFIC: false, // TODO 227: We'll be removing prolific -> passed as URLSearchParam
  USE_PHOTODIODE: false, // TODO: Will be handled at the task level
  USE_EEG: false, // TODO: Will be handled at the task level
  USE_VOLUME: false, // TODO: Will be handled at the task level
  USE_CAMERA: false, // TODO: Will be handled at the task level
};

// TODO: Serial ports and things like that should be set here?
