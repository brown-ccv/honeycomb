/**
 * This is the main configuration file where universal/default settings should be placed.
 */

import _ from "lodash";
import { initJsPsych,} from "jspsych";

import packageInfo from '../../package.json'
import usLanguage from "../language/en_us.json"
import mturkLanguage from "../language/en_us.mturk.json"
import { getProlificId } from "../lib/utils";
import { eventCodes } from "./trigger";

// Access package name and version so we can store these as facts with task data.
const taskName = packageInfo.name;
const taskVersion = packageInfo.version;

// As of jspsych 7, we instantiate jsPsych where needed instead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
const jsPsych = initJsPsych()

/** DETERMINE CONFIG FROM ENV */

// Is this mechanical turk?
const turkInfo = jsPsych.turk.turkInfo()
const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
let USE_MTURK = !turkInfo.outsideTurk;

// Is this prolific?
let USE_PROLIFIC = getProlificId() && !USE_MTURK;

// Is this electron?
let USE_ELECTRON = true;
try {
  window.require("electron");
} catch(e) {
  USE_ELECTRON = false;
}

// Is this firebase?
let USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true";

// Use volume trials in the task?
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true";
// Use camera trials in the task? (only used with Electron)
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON;
// Use EEG/event markers? (only used with Electron)
const USE_EEG =
  process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON;
// Use the photodiode? (only used with Electron)
const USE_PHOTODIODE =
  process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON;


/** SET OTHER CONFIG */

// Mapping of letters to key codes
const keys = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// Audio codes
const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: "sine",
};

// Language configuration
const language = usLanguage
if (!USE_ELECTRON)  _.merge(language, mturkLanguage);

// Get block settings
const defaultBlockSettings = {
  conditions: ["a", "b", "c"],
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: false,
  is_tutorial: false,
  photodiode_active: false,
};

// setting config for trials
const envConfig = {
  USE_PHOTODIODE,
  USE_EEG,
  USE_ELECTRON,
  USE_MTURK,
  USE_VOLUME,
  USE_CAMERA,
  USE_PROLIFIC,
  USE_FIREBASE
}

export {
  taskName,
  taskVersion,
  keys,
  defaultBlockSettings,
  language,
  eventCodes,
  envConfig,
  audioCodes,
  turkUniqueId
};
