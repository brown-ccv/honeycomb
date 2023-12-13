import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { audioCodes, config, eventCodes, language } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";
import { beep } from "../lib/utils";

const startCodeTrial = {
  type: htmlKeyboardResponse,
  // TODO: Display photodiodeGhostBox as prompt
  stimulus: () => {
    const startCodeMarkup = h1(language.prompts.settingUp);
    return baseStimulus(startCodeMarkup, true) + photodiodeGhostBox;
  },
  trial_duration: 2000,
  // Conditionally flash the photodiode and plays an audible beep when the trial first loads
  on_load: () => {
    // TODO: Pass config values as parameters to the function
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.open_task);
    if (config.USE_VOLUME) beep(audioCodes);
  },
};

export { startCodeTrial };
