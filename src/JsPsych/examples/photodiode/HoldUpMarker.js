import htmlButtonResponse from '@jspsych/plugin-html-button-response';
// import { lang } from '../../../config/main';

// TODO: Move markup to here?
import { photodiodeGhostBox } from '../../../lib/markup/photodiode';
import { baseStimulus } from '../../../lib/markup/stimuli';
import eventMarkerMessage from '../../../lib/markup/eventMarkerMessage';

// TODO: Update imports to use stuff inside JsPsych folder
import { language } from '../../language';

/**
 *
 * @returns
 */
export function HoldUpMarker() {
  const stimulus = baseStimulus("<div><h2 id='usb-alert'></h2></div>", true) + photodiodeGhostBox();
  const { prompt } = language;

  return {
    type: htmlButtonResponse,
    stimulus,
    prompt: [`<br><h3>${prompt.focus}</h3>`],
    choices: [prompt.continue.button],
    on_load: () => {
      eventMarkerMessage().then((s) => (document.getElementById('usb-alert').innerHTML = s));
    },
  };
}
