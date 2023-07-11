import HtmlButtonResponse from '@jspsych/plugin-html-button-response';

import { language } from '../../../language';
import { showMessage } from '@brown-ccv/behavioral-task-trials';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../../config/home.json';

// TEMP: Helper function for interfacing with the old config type
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
 * Final button page with "Confirm Completion" text
 */
// TODO: Use JsPsych survey prompts https://www.jspsych.org/7.3/plugins/survey/
// TODO: Need a better name
export function createDebriefSurvey() {
  const oldConfig = useOldConfig(config);
  const confirmButtonText = language.quiz.answer.debriefing.confirm_completion;

  // TODO: Move showMessage into its Honeycomb itself
  return showMessage(oldConfig, {
    responseType: HtmlButtonResponse,
    responseEndsTrial: true,
    buttons: [confirmButtonText],
  });
}

export const DebriefSurvey = createDebriefSurvey();
