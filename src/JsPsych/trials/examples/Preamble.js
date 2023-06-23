import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { showMessage } from '@brown-ccv/behavioral-task-trials';

// import holdUpMarker from '../trials/holdUpMarker';
// import startCode from '../trials/startCode';
// import { lang, config } from '../config/main';

// TODO: Use @signature for imports?
import { language } from '../../language'; // @language
import { HoldUpMarker, StartCode } from './photodiode'; // @tasks

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../config/home.json';

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

// TODO: Rename as introduction?
export function Preamble() {
  const oldConfig = useOldConfig(config);

  // Trial that shows the task name with a continue button
  // TODO: Refactor to not take old config
  const introductionMessage = showMessage(oldConfig, {
    responseType: htmlButtonResponse,
    message: language.task.name,
    responseEndsTrial: true,
    buttons: [language.prompt.continue.button],
  });

  const timeline = [introductionMessage];

  //   Add photodiode trials if using it
  //   TODO: Move to timeline? Expect to add there
  //   if (oldConfig.USE_PHOTODIODE) {
  if (config.equipment.photodiode) {
    timeline.push(HoldUpMarker());
    timeline.push(StartCode());
  }

  return {
    type: htmlKeyboardResponse,
    stimulus: '',
    timeline,
  };
}
