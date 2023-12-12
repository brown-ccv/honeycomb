import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { language } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

/** Trial that prompts the user to adjust the volume on their computer */
const adjustVolume = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const adjustVolumeMarkup = h1(language.trials.adjustVolume);
    return baseStimulus(adjustVolumeMarkup, true);
  },
  prompt: language.prompts.continue.prompt,
  response_ends_trial: true,
};

export { adjustVolume };
