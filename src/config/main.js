// This is the main configuration file where universal and default settings should be placed.
// These setting can then be imported anywhere in the app as they are exported at the bottom of the file.

import { init } from "@brown-ccv/behavioral-task-trials";
import { initJsPsych } from "jspsych";
import _ from "lodash";

import packageInfo from "../../package.json";
import { getProlificId } from "../lib/utils";
import { eventCodes } from "./trigger";

// Access package name and version so we can store these as facts with task data.

// TODO: Make constants ALL CAPS
const taskName = packageInfo.name;
const taskVersion = packageInfo.version;

// mapping of letters to key codes
const keys = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// audio codes
const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: "sine",
};

// As of jspsych 7, we instantiate jsPsych where needed instead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
const jsPsych = initJsPsych();

// is this mechanical turk?
const turkInfo = jsPsych.turk.turkInfo();
const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`;
const USE_MTURK = !turkInfo.outsideTurk;
const USE_PROLIFIC = (getProlificId() && !USE_MTURK) || false;
let USE_ELECTRON = true;
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true";

try {
  window.require("electron");
} catch (error) {
  USE_ELECTRON = false;
}

// whether or not to ask the participant to adjust the volume
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true";
// these variables depend on USE_ELECTRON
// whether or not to enable video
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON;
// whether or not the EEG/event marker is available
const USE_EEG = process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON;
// whether or not the photodiode is in use
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON;

// setting config for trials
const config = init({
  USE_PHOTODIODE,
  USE_EEG,
  USE_ELECTRON,
  USE_MTURK,
  USE_VOLUME,
  USE_CAMERA,
  USE_PROLIFIC,
  USE_FIREBASE,
});

// Get the language file
const lang = require("../language/en_us.json");

// Get task settings
let taskSettings = {
  fixation: {
    durations: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
    default_duration: 1000,
    randomize_duration: false,
  },
};
try {
  // Override default task settings from the config file
  taskSettings = _.merge(taskSettings, require("./config.json"));
} catch (error) {
  // Try will fail if require doesn't find the json file
  console.warn("Unable to load task settings from config.json");
}

export {
  audioCodes,
  config,
  taskSettings,
  eventCodes,
  keys,
  lang,
  taskName,
  taskVersion,
  turkUniqueId,
};
