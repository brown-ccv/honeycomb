import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { language } from '../../language';
import { photodiodeGhostBox } from '../../../lib/markup/photodiode';
import { baseStimulus } from '../../../lib/markup/stimuli';

/**
 * Displays a welcome emssage
 */
// TODO: Label as JsPsych instructions?
// TODO: The text  here is just "instructions"? This is pretty useless?
export function createWelcomeMessageTrial() {
  const stimulus =
    baseStimulus(`<h1>${language.welcome.message}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: language.prompt.continue.press,
    response_ends_trial: true,
  };
}

export const WelcomeMessage = createWelcomeMessageTrial();
