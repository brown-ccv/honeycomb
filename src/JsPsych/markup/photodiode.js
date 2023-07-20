import $ from 'jquery';

import { EVENT_CODES } from '../constants';

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../config/home.json';
import { useOldConfig } from '../../utils';

const oldConfig = useOldConfig(config);

// conditionally load electron and psiturk based on MTURK config variable
let ipcRenderer = false;
try {
  if (oldConfig.USE_ELECTRON) {
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
  }
} catch (e) {
  console.warn('window.require is not available');
}

// Relies on styling in index.css, generate PD spot
// TODO 226: Refactor to take USE_PHOTODIODE as a parameter
export function photodiodeGhostBox() {
  const class_ = oldConfig.USE_PHOTODIODE ? 'visible' : 'invisible';

  return `<div class="photodiode-box ${class_}" id="photodiode-box">
        <span id="photodiode-spot" class="photodiode-spot"></span>
      </div>`;
}

// TODO 226: Refactor to take USE_PHOTODIODE as a parameter
// ? What's the taskCode really for?
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
