/**
 * This is the main configuration file where universal and default settings should be placed.
 * These setting can then be imported anywhere in the app
 */

import { init } from "@brown-ccv/behavioral-task-trials";
import { initJsPsych } from "jspsych";
import _ from "lodash";

import packageInfo from "../../package.json";
import { getProlificId } from "../lib/utils";
import language from "./language.json";
import { eventCodes } from "./trigger";

// Access package name and version so we can store these as facts with task data.
const taskName = packageInfo.name;
const taskVersion = packageInfo.version;

/** Audio code of a basic "beep" sine wave */
const audioCodes = {
  frequency: 900,
  type: "sine",
};

// As of jspsych 7, we instantiate jsPsych where needed instead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
// TODO: Initialize using using react code in jsPsychExperiment
const jsPsych = initJsPsych();

// Whether or not the experiment is running on mechanical turk
const turkInfo = jsPsych.turk.turkInfo();
const USE_MTURK = !turkInfo.outsideTurk;
const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`; // ID of the user in mechanical turk

// Whether or not the experiment is running in Electron (local app)
let USE_ELECTRON = true;
try {
  window.require("electron");
} catch (error) {
  USE_ELECTRON = false;
}

const USE_PROLIFIC = (getProlificId() && !USE_MTURK) || false; // Whether or not the experiment is running with Prolific
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true"; // Whether or not the experiment is running in Firebase (web app)

const USE_VOLUME = process.env.REACT_APP_VOLUME === "true"; // Whether or not to use audio cues in the task
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON; // Whether or not to use video recording
const USE_EEG = process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON; // Whether or not the EEG/event marker is available (TODO: This is only used for sending event codes)
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON; // whether or not the photodiode is in use

/**
 * Configuration object for Honeycomb
 */
// TODO: Remove init call
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

/** Determine the task settings to be used   */

// Honeycomb's default task settings
// TODO: Remove this default, just use config.json
let taskSettings = {
  fixation: {
    durations: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
    default_duration: 1000,
    randomize_duration: false,
  },
};
try {
  taskSettings = _.merge(
    // Honeycomb's default task settings
    taskSettings,
    // Override default task settings with settings from the config file
    require("./config.json")
  );
} catch (error) {
  // Try will fail if require doesn't find the json file
  console.warn("Unable to load task settings from config.json");
}

/** Export the settings so they can be used anywhere in the app */
export {
  audioCodes,
  config,
  eventCodes,
  language,
  taskName,
  taskSettings,
  taskVersion,
  turkUniqueId,
};
