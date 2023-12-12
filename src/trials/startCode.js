import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { audioCodes, eventCodes, language } from "../config/main";
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
  on_load: () => {
    // Displays the photodiode spot and plays an audible beep when the trial first loads
    pdSpotEncode(eventCodes.open_task);
    beep(audioCodes);
  },
};

export { startCodeTrial };
