import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// TODO: Move markup to JsPsych?
import { photodiodeGhostBox, pdSpotEncode } from '../../../partials/photodiode';
import { baseStimulus } from '../../../partials/stimuli';

import { language } from '../../../language';
import { EVENT_CODES, AUDIO_CODES } from '../../../constants';
import { beep } from '../../../utils';

/**
 *
 * @returns
 */
export function createStartCodeTrial() {
  const stimulus =
    baseStimulus(`<h1>${language.prompt.setting_up}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    trial_duration: 2000,
    on_load: () => {
      pdSpotEncode(EVENT_CODES.open_task);
      beep(AUDIO_CODES);
    },
  };
}

export const StartCode = createStartCodeTrial();
