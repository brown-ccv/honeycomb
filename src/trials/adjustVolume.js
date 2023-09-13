import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { language } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

function adjustVolume() {
  const adjustVolumeMarkup = h1(language.trials.adjustVolume);

  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(adjustVolumeMarkup, true),
    prompt: language.prompts.continue.prompt,
    response_ends_trial: true,
  };
}

export default adjustVolume;
