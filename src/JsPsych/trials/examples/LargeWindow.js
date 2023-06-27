import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { lang } from '../../../config/main';
import { photodiodeGhostBox } from '../../../lib/markup/photodiode';
import { baseStimulus } from '../../../lib/markup/stimuli';

/**
 * Trial that prompts the user to enlarge their window
 * @returns
 */
export function createLargeWindowTrial() {
  const stimulus =
    baseStimulus(`<h1>${lang.welcome.large_window}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: lang.prompt.continue.press,
    response_ends_trial: true,
  };
}

export const LargeWindow = createLargeWindowTrial();
