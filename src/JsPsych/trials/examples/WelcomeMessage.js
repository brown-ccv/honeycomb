import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { language } from "../../language";
import { photodiodeGhostBox } from "./partials/photodiode";
import { baseStimulus } from "./partials/baseStimulus";

/**
 * Displays a welcome emssage
 */
// TODO 231: Label as JsPsych instructions?
// TODO 231: The text  here is just "instructions"? This is pretty useless?
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
