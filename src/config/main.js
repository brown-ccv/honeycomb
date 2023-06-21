// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settings can then be imported anywhere in the app as they are exported at the bottom of the file.

import _ from 'lodash';
import { initJsPsych } from 'jspsych';
import { init } from '@brown-ccv/behavioral-task-trials';

import packageInfo from '../../package.json';
import { eventCodes } from './trigger';
import { getProlificId } from '../lib/utils';

// Access package name and version so we can store these as facts with task data.
// TODO: Move to constants
export const taskName = packageInfo.name;
export const taskVersion = packageInfo.version;

// As of jspsych 7, we instantiate jsPsych where needed instead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
// TODO: This is only used for mturk - make a separate function that take's jsPsych as a param
const jsPsych = initJsPsych();

// mapping of letters to key codes
// TODO: Move to constants? ALL_CAPS
export const keys = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// audio codes
// TODO: Move to constants? ALL_CAPS
export const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: 'sine',
};

// is this mechanical turk?
// TODO: Move to constants?
const turkInfo = jsPsych.turk.turkInfo();
export const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`;

// Whether or not we're in an electron instance
let USE_ELECTRON = true;
try {
  window.require('electron');
} catch (error) {
  USE_ELECTRON = false;
}
// Whether or not we're using Mechanical Turk
const USE_MTURK = !turkInfo.outsideTurk;
// Whether or not we're using Prolific
const USE_PROLIFIC = (getProlificId() && !USE_MTURK) || false;
// Whether or not we're using Firebase
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === 'true';

// Whether or not the EEG/event marker is available
const USE_EEG = process.env.REACT_APP_USE_EEG === 'true' && USE_ELECTRON;
// Whether or not the photodiode is in use
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === 'true' && USE_ELECTRON;
// Whether or not to enable the volume trial
const USE_VOLUME = process.env.REACT_APP_VOLUME === 'true';
// Whether or not to enable video
const USE_CAMERA = process.env.REACT_APP_VIDEO === 'true' && USE_ELECTRON;

// TODO: Have this be a function? Use i18n?
// Get language file
const lang = require('../language/en_us.json');
if (!USE_ELECTRON) {
  // If this is mturk, merge in the mturk specific language
  const mlang = require('../language/en_us.mturk.json');
  _.merge(lang, mlang);
}

// TODO: Move to constants
export const defaultBlockSettings = {
  conditions: ['a', 'b', 'c'],
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: false,
  is_tutorial: false,
  photodiode_active: false,
};

// setting config for trials
// TODO: What's this init function?
// TODO: constants?
export const config = init({
  USE_PHOTODIODE,
  USE_EEG,
  USE_ELECTRON,
  USE_MTURK,
  USE_VOLUME,
  USE_CAMERA,
  USE_PROLIFIC,
  USE_FIREBASE,
});

// TODO: Handle in the same file? Have a special language file?
export { lang };
