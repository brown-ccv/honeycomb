/**
 * This is the main configuration file where universal and default settings should be placed.
 * These setting can then be imported anywhere in the app
 */
import { initJsPsych } from "jspsych";

import packageInfo from "../../package.json";
import { getProlificId } from "../lib/utils";

import language from "./language.json";
import settings from "./settings.json";

// TODO @brown-ccv #363: Separate into index.js (for exporting) and env.js

// Re-export the package name and version
export const taskName = packageInfo.name;
export const taskVersion = packageInfo.version;

// Re-export the language object
// TODO @brown-ccv #373: Save language in Firebase
export const LANGUAGE = language;
// Re-export the settings object
// TODO @brown-ccv #374: Save settings in Firebase
export const SETTINGS = settings;

const USE_ELECTRON = window.electronAPI !== undefined; // Whether or not the experiment is running in Electron (local app)
const USE_PROLIFIC = getProlificId() || false; // Whether or not the experiment is running with Prolific
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true"; // Whether or not the experiment is running in Firebase (web app)

const USE_VOLUME = process.env.REACT_APP_VOLUME === "true"; // Whether or not to use audio cues in the task
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON; // Whether or not to use video recording
// TODO @brown-ccv #341: Remove USE_EEG - separate variables for USE_PHOTODIODE and USE_EVENT_MARKER
const USE_EEG = process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON; // Whether or not the EEG/event marker is available (TODO @brown-ccv: This is only used for sending event codes)
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON; // whether or not the photodiode is in use

// Configuration object for Honeycomb
export const config = {
  USE_PHOTODIODE,
  USE_EEG,
  USE_ELECTRON,
  USE_VOLUME,
  USE_CAMERA,
  USE_PROLIFIC,
  USE_FIREBASE,
};
