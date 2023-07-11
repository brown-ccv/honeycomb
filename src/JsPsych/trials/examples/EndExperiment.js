import { showMessage } from '@brown-ccv/behavioral-task-trials';

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../config/home.json';
import { language } from '../../language';

// TEMP: Helper function for interfacing with the old config type
function useOldConfig(newConfig) {
  const { environment, equipment } = newConfig;

  return {
    USE_ELECTRON: environment === 'electron',
    USE_FIREBASE: environment === 'firebase',
    USE_MTURK: false, // TODO 228: What's the logic for this? Is it its own environment?
    USE_PROLIFIC: false, // TODO 227: We'll be removing prolific -> passed as URLSearchParam
    USE_PHOTODIODE: equipment.photodiode ? true : false,
    USE_EEG: equipment.eeg ? true : false,
    USE_VOLUME: equipment.audio ? true : false,
    USE_CAMERA: equipment.camera ? true : false,
  };
}

export function createEndExperimentTrial() {
  const oldConfig = useOldConfig(config);
  return showMessage(oldConfig, {
    duration: 5000,
    message: language.task.end,
  });
}

export const EndExperiment = createEndExperimentTrial();
