import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { showMessage, fixation } from '@brown-ccv/behavioral-task-trials';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../config/home.json';
import { EVENT_CODES } from '../constants';
import { formatDollars } from '../utils';

// TEMP: Helper function for interfacing with the old config type
// TODO: Move to utils? This will only ever be used internally?
function useOldConfig(newConfig) {
  const { environment, equipment } = newConfig;

  return {
    USE_ELECTRON: environment === 'electron',
    USE_FIREBASE: environment === 'firebase',
    USE_MTURK: false, // TODO: What's the logic for this? Is it its own environment?
    USE_PROLIFIC: false, // We'll be removing prolific -> passed as URLSearchParam
    USE_PHOTODIODE: equipment.photodiode ? true : false,
    USE_EEG: equipment.eeg ? true : false,
    USE_VOLUME: equipment.audio ? true : false,
    USE_CAMERA: equipment.camera ? true : false,
  };
}

/**
 * Create an HTML stimulus for displaying the participant's current earnings
 * @param {number} earnings
 * @returns
 */
// TODO: This may be easier without showMessage? Using JsPsych classes?
function earningsStimulus(earnings) {
  const bclass = earnings >= 0 ? 'success' : 'danger';
  return `<div class='center_container'>
    <h1 class='text-${bclass}'>${formatDollars(earnings)}</h1>
    </div>`;
}

/**
 * Create a single trial of honeycomb's custom task
 */
// TODO 210: Implement stroop game, rename as stroopTrial
export function createHoneycombTrial(condition) {
  const oldConfig = useOldConfig(config);
  const trials = [
    // Display the fixation dot
    // TODO 208: Bring fixation trial into honeycomb
    fixation(oldConfig, { duration: 650 }),
    // Display the condition
    // TODO 209: Bring showMessage trial into honeycomb
    showMessage(oldConfig, {
      message: condition, // TODO: This is undefined?
      onstart: true,
      taskCode: EVENT_CODES.evidence,
    }),
    // Display the next fixation dot
    // TODO 208: Bring fixation trial into honeycomb
    fixation(oldConfig, { duration: 650 }),

    // Display the user's earnings for the trial
    // TODO 209: Bring showMessage trial into honeycomb
    showMessage(oldConfig, {
      stimulus: earningsStimulus(Math.random()),
      taskCode: EVENT_CODES.show_earnings,
    }),
  ];

  // Create a single honeycomb trial
  return {
    type: htmlKeyboardResponse,
    timeline: trials,
  };
}
