// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { initJsPsych } from "jspsych";
import _ from "lodash";
import { eventCodes } from "./trigger";
import { init } from "@brown-ccv/behavioral-task-trials";
import { getProlificId } from "../lib/utils";
import packageInfo from '../../package.json'

// Access package name and version so we can store these as facts with task data.
const taskName = packageInfo.name;
const taskVersion = packageInfo.version;

// As of jspsych 7, we instantiate jsPsych where needed insead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
const jsPsych = initJsPsych()

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

// is this mechanical turk?
const turkInfo = jsPsych.turk.turkInfo()
const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
let USE_MTURK = !turkInfo.outsideTurk;
let USE_PROLIFIC = getProlificId() && !USE_MTURK;
let USE_ELECTRON = true;
let USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true";

try {
  window.require("electron");
} catch {
  USE_ELECTRON = false;
}

// whether or not to ask the participant to adjust the volume
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true";
// these variables depend on USE_ELECTRON
// whether or not to enable video
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON;
// whether or not the EEG/event marker is available
const USE_EEG =
  process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON;
// whether or not the photodiode is in use
const USE_PHOTODIODE =
  process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON;

// get language file
const lang = require("../language/en_us.json");
if (!USE_ELECTRON) {
  // if this is mturk, merge in the mturk specific language
  const mlang = require("../language/en_us.mturk.json");
  _.merge(lang, mlang);
}

const defaultBlockSettings = {
  conditions: ["a", "b", "c"],
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: false,
  is_tutorial: false,
  photodiode_active: false,
};

// setting config for trials
const config = init({
  USE_PHOTODIODE,
  USE_EEG,
  USE_ELECTRON,
  USE_MTURK,
  USE_VOLUME,
  USE_CAMERA,
  USE_PROLIFIC,
  USE_FIREBASE
});

export {
  taskName,
  taskVersion,
  keys,
  defaultBlockSettings,
  lang,
  eventCodes,
  config,
  audioCodes,
  turkUniqueId
};
