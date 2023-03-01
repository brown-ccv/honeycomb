import _ from "lodash";
import { initJsPsych } from "jspsych";

import packageInfo from '../../package.json'
import { getProlificId } from "../lib/utils";
import { eventCodes } from "./trigger";
import lang from  "../language/en_us.json"
import mlang from "../language/en_us.mturk.json"

/**
 * Initialize JsPsych configuration based on environment variables
 * The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment
 * The actual task and related utils will use a different instance of jsPsych (JSPsychExperiment.jsx)
*/

// Instantiate JsPsych
const jsPsych = initJsPsych()

// Access package name and version to save in data object
const taskName = packageInfo.name ? packageInfo.name : "Honeycomb";
const taskVersion = packageInfo.version ? packageInfo.version : '1.0.0';

// Mapping of letters to key codes
const keys = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// Create audio codes
const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: "sine",
};

// Determine if using Mechanical Turk
const turkInfo = jsPsych.turk.turkInfo()
const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
let USE_MTURK = !turkInfo.outsideTurk;

// Determine if using Prolific
let USE_PROLIFIC = getProlificId() && !USE_MTURK;

// Determine if using Electron
let USE_ELECTRON = true;
try {
  window.require("electron");
} catch(e) {
  USE_ELECTRON = false;
}

// Determine if using firebase
let USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true";

// TODO: These are optional arguments, not based on the specific environment Honeycomb is being used?

// Determine if using volume tasks (passed as env variable)
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true";
// Determine if using video camera (only on Electron and passed as env variable )
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON;
// Determine if using EEG machine (only on Electron and passed as env variable )
const USE_EEG =
  process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON;
// Determine if using Photodiode (only on Electron and passed as env variable )
const USE_PHOTODIODE =
  process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON;

// Build language file
const LANGUAGE = lang
if (!USE_ELECTRON) {
  // If this is mturk, merge in the mturk specific language
  _.merge(LANGUAGE, mlang);
}

// TODO: Some of the same defaults that are used in config/config.js?
const defaultBlockSettings = {
  conditions: ["a", "b", "c"],
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: false,
  is_tutorial: false,
  photodiode_active: false,
};

// Build configuration settings from environment variables into a single object
const envConfig = {
  USE_MTURK,
  USE_PROLIFIC,
  USE_ELECTRON,
  USE_FIREBASE,

  USE_VOLUME,
  USE_CAMERA,
  USE_EEG,
  USE_PHOTODIODE,
}

export {
  taskName,
  taskVersion,
  keys,
  defaultBlockSettings,
  LANGUAGE,
  eventCodes,
  envConfig,
  audioCodes,
  turkUniqueId
};
