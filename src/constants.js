/**
 * The node environment in which the application is running
 */
export const NODE_ENV = process.env.REACT_APP_NODE_ENV; // "development" | "production" | "test"

/**
 * The physical location in which the application is running
 */
export const LOCATION = process.env.REACT_APP_LOCATION; // "home" | "clinic"

// TODO: Will be passed into the <Honeycomb /> component directly?
// ? xampp and mysql from JsPsych docs https://www.jspsych.org/7.0/overview/data/#storing-data-permanently-as-a-file
// ? Will psiturk be special? Or just UrlSearchParams? https://www.jspsych.org/7.0/overview/mturk/
export const DEPLOYMENT = "firebase"; // "csv" | "local" | "firebase" | "pstiturk" | "custom"
// TODO: Currently using prolific as a possible deployment, delete?

// TODO: Export CONFIG and OLD_CONFIG
export const OLD_CONFIG = {
  USE_ELECTRON: LOCATION === "clinic",
  USE_FIREBASE: DEPLOYMENT === "firebase",
  USE_MTURK: false, // TODO 228: What's the logic for this? MTURK === PSITURK
  USE_PROLIFIC: false, // TODO 227: We'll be removing prolific -> passed as URLSearchParam
  USE_PHOTODIODE: false, // TODO: Will be handled at the task level
  USE_EEG: false, // TODO: Will be handled at the task level
  USE_VOLUME: false, // TODO: Will be handled at the task level
  USE_CAMERA: false, // TODO: Will be handled at the task level
};

// TODO: Serial ports and things like that should be set here?
