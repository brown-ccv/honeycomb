import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { language } from '../../language';
import { photodiodeGhostBox } from '../../partials/photodiode';
import { baseStimulus } from '../../partials/stimuli';

/**
 * Trial that prompts the user to enlarge their window
 * @returns
 */
// TODO: JsPsych now has a fullscreen plugin https://www.jspsych.org/7.3/plugins/fullscreen/
export function createLargeWindowTrial() {
  const stimulus =
    baseStimulus(`<h1>${language.welcome.large_window}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: language.prompt.continue.press,
    response_ends_trial: true,
  };
}

export const LargeWindow = createLargeWindowTrial();
