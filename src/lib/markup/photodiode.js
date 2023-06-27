import $ from 'jquery';

import { EVENT_CODES } from '../../JsPsych/constants';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../JsPsych/config/home.json';

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

const oldConfig = useOldConfig(config);

// TODO: behavior-task-trials exports these as the trial option?

// conditionally load electron and psiturk based on MTURK config variable
let ipcRenderer = false;
try {
  if (oldConfig.USE_ELECTRON) {
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
  }
} catch (e) {
  console.warn('window.require is not available');
  console.error(e);
}

// Relies on styling in index.css, generate PD spot
export function photodiodeGhostBox() {
  const class_ = oldConfig.USE_PHOTODIODE ? 'visible' : 'invisible';

  const markup = `<div class="photodiode-box ${class_}" id="photodiode-box">
      <span id="photodiode-spot" class="photodiode-spot"></span>
    </div>`;
  return markup;
}

export function pdSpotEncode(taskCode) {
  function pulseFor(ms, callback) {
    $('.photodiode-spot').css({ 'background-color': 'black' });
    setTimeout(() => {
      $('.photodiode-spot').css({ 'background-color': 'white' });
      callback();
    }, ms);
  }

  function repeatPulseFor(ms, i) {
    if (i > 0) {
      pulseFor(ms, () => {
        setTimeout(() => {
          repeatPulseFor(ms, i - 1);
        }, ms);
      });
    }
  }

  if (oldConfig.USE_PHOTODIODE) {
    const blinkTime = 40;
    let numBlinks = taskCode;
    if (taskCode < EVENT_CODES.open_task) numBlinks = 1;
    repeatPulseFor(blinkTime, numBlinks);
    if (ipcRenderer) ipcRenderer.send('trigger', taskCode);
  }
}
