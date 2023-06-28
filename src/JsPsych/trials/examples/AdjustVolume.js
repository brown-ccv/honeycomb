import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { language } from '../../language';
import { baseStimulus } from '../../partials/stimuli';

/**
 * JsPsych trial that prompts the user to adjust their volume
 */
// TODO: JsPsych trial that forces the user's volume to be a certain amount?
export function createAdjustVolumeTrial() {
  const stimulus = baseStimulus(
    `<div class='instructions'><h1>${language.instructions.adjust_volume}</h1></div>`,
    true
  );

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: language.prompt.continue.press,
    response_ends_trial: true,
  };
}

export const AdjustVolume = createAdjustVolumeTrial();
