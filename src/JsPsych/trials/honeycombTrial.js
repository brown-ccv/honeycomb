import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// TODO: Move these trials into honeycomb
import { showMessage, fixation } from '@brown-ccv/behavioral-task-trials';

// TODO: Move markup files. Can I leave it here?
import { earningsDisplay } from '../../lib/markup/earnings';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../config/home.json';
import { EVENT_CODES } from '../constants';

// TEMP: Helper function for interfacing with the old config type
// TODO: MOve to utils? This will only ever be used internally?
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
      stimulus: earningsDisplay(Math.random()),
      taskCode: EVENT_CODES.show_earnings,
    }),
  ];

  // Create a single honeycomb trial
  return {
    type: htmlKeyboardResponse,
    timeline: trials,
  };
}
