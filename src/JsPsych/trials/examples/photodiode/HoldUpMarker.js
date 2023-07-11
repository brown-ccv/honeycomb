import htmlButtonResponse from '@jspsych/plugin-html-button-response';

import { photodiodeGhostBox } from '../partials/photodiode';
import { baseStimulus } from '../partials/baseStimulus';

import { language } from '../../../language';

/**
 *
 * @returns
 */
export function createHoldUpMarkerTrial() {
  const stimulus = baseStimulus("<div><h2 id='usb-alert'></h2></div>", true) + photodiodeGhostBox();
  const { prompt } = language;

  return {
    type: htmlButtonResponse,
    stimulus,
    prompt: [`<br><h3>${prompt.focus}</h3>`],
    choices: [prompt.continue.button],
    on_load: () => {
      // Injects the event marker message into the 'usb-alert' element
      document.getElementById(
        'usb-alert'
      ).innerHTML = `<span style="color: green;">${language.eventMarker.found}</span>`;
    },
  };
}

export const HoldUpMarker = createHoldUpMarkerTrial();
