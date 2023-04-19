// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settings can then be imported anywhere in the app as they are exported at the botom of the file.

import { initJsPsych } from 'jspsych';
import _ from 'lodash';
import { eventCodes } from './trigger';
import { init } from '@brown-ccv/behavioral-task-trials';
import { getProlificId } from '../lib/utils';
import packageInfo from '../../package.json';

// Access package name and version so we can store these as facts with task data.
export const taskName = packageInfo.name;
export const taskVersion = packageInfo.version;

// As of jspsych 7, we instantiate jsPsych where needed insead of importing it globally.
// The instance here gives access to utils in jsPsych.turk, for awareness of the mturk environment, if any.
// The actual task and related utils will use a different instance of jsPsych created after login.
const jsPsych = initJsPsych();

// mapping of letters to key codes
export const keys = {
  A: 65,
  B: 66,
  C: 67,
  F: 70,
  J: 74,
  space: 32,
};

// audio codes
export const audioCodes = {
  frequency: 100 * (eventCodes.open_task - 9),
  type: 'sine',
};
export { eventCodes }; // TODO: Just import from trigger elsewhere?

// is this mechanical turk?
const turkInfo = jsPsych.turk.turkInfo();
export const turkUniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`;

// Whether or not to use electron
let USE_ELECTRON = true;
try {
  window.require('electron');
} catch (error) {
  USE_ELECTRON = false;
}
// Whether or not to use mechanical turk
const USE_MTURK = !turkInfo.outsideTurk;
// Whether or not to use prolific
const USE_PROLIFIC = (getProlificId() && !USE_MTURK) || false;
// Whetehr or not to use Firebase
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === 'true';

// whether or not to ask the participant to adjust the volume
const USE_VOLUME = process.env.REACT_APP_VOLUME === 'true';
// these variables depend on USE_ELECTRON
// whether or not to enable video
const USE_CAMERA = process.env.REACT_APP_VIDEO === 'true' && USE_ELECTRON;
// whether or not the EEG/event marker is available
const USE_EEG = process.env.REACT_APP_USE_EEG === 'true' && USE_ELECTRON;
// whether or not the photodiode is in use
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === 'true' && USE_ELECTRON;

// setting config for trials
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

// get language file
// TODO: Create and export seperately?
const lang = require('../language/en_us.json');
if (!USE_ELECTRON) {
  // if this is mturk, merge in the mturk specific language
  const mlang = require('../language/en_us.mturk.json');
  _.merge(lang, mlang);
}
export { lang };

export const defaultBlockSettings = {
  conditions: ['a', 'b', 'c'],
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: false,
  is_tutorial: false,
  photodiode_active: false,
};
