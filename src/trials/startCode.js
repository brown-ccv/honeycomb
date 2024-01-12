import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { audioCodes, config, eventCodes, LANGUAGE } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";
import { beep } from "../lib/utils";

// TODO #364: Refactor to use JsPsych audio trial
// TODO #364: Remove "USE_VOLUME"
// TODO #364: "Setting up" is a separate trial that runs ALL of the needed setup
const startCodeTrial = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    const startCodeMarkup = h1(LANGUAGE.prompts.settingUp);
    return baseStimulus(startCodeMarkup, true);
  },
  // Conditionally displays the photodiodeGhostBox
  prompt: () => {
    if (config.USE_PHOTODIODE) return photodiodeGhostBox;
    else return null;
  },
  trial_duration: 2000,
  on_load: () => {
    // Conditionally flashes the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.open_task);
    // Conditionally Plays an audible beep when the trial first loads
    if (config.USE_VOLUME) beep(audioCodes);
  },
};

export { startCodeTrial };
