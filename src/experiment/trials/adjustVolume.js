import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { LANGUAGE } from "../../config/main";
import { div, h1 } from "../../lib/markup/tags";

/** Trial that prompts the user to adjust the volume on their computer */
export const adjustVolumeTrial = {
  type: htmlKeyboardResponse,
  stimulus: function () {
    const adjustVolumeMarkup = h1(LANGUAGE.trials.adjustVolume);
    return div(adjustVolumeMarkup);
  },
  prompt: LANGUAGE.prompts.continue.prompt,
  response_ends_trial: true,
};
