import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { lang } from '../../../config/main';
import { photodiodeGhostBox } from '../../../lib/markup/photodiode';
import { baseStimulus } from '../../../lib/markup/stimuli';

export function createWelcomeMessageTrial() {
  const stimulus = baseStimulus(`<h1>${lang.welcome.message}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: lang.prompt.continue.press,
    response_ends_trial: true,
  };
}

export const WelcomeMessage = createWelcomeMessageTrial();
