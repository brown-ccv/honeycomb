/* This is the main configuration file where universal and default settings should be placed.
* These settings can then be imported anywhere in the app as they are exported at the bottom of the file. */

import { jsPsych } from "jspsych-react"
import _ from "lodash"
import { eventCodes } from "./trigger"
import { getProlificId } from "../lib/utils"

// audio codes
const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: "sine",
}

const taskName = "Honeycomb: Stroop"

/* Environment variables. These are all "buildtime," which means they must be set using the NPM build script; they
* are not read from the local machine's environment variables. */

let USE_MTURK = !jsPsych.turk.turkInfo().outsideTurk
let USE_PROLIFIC = getProlificId() && !USE_MTURK
let USE_ELECTRON = true
let USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true"

try {
  window.require("electron")
} catch {
  USE_ELECTRON = false
}

// Whether or not to ask the participant to adjust the volume.
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true"
// Whether or not to enable video.
const USE_CAMERA = process.env.REACT_APP_VIDEO === "true" && USE_ELECTRON
// Whether or not the EEG/event marker is available.
const USE_EEG =
  process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON
// Whether or not the photodiode is in use.
const USE_PHOTODIODE =
  process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON

// Language file.
const lang = require("../language/en_us.json")
if (!USE_MTURK) {
  // If using MTurk, merge in MTurk-specific language.
  const mlang = require("../language/en_us.mturk.json")
  _.merge(lang, mlang)
}

// An object containing the values of the environment variables.
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
  lang,
  eventCodes,
  envConfig,
  audioCodes,
}
