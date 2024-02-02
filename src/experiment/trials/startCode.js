import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";

import { config, LANGUAGE } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { h1 } from "../../lib/markup/tags";

// TODO #364: Refactor to use JsPsych audio trial
// TODO #364: Remove "USE_VOLUME"
// TODO #364: "Setting up" is a separate trial that runs ALL of the needed setup
export const startCodeTrial = {
  type: audioKeyboardResponse,
  stimulus: "assets/audio/beep.mp3",
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: () => {
    let markup = h1(LANGUAGE.prompts.settingUp);
    // Conditionally displays the photodiodeGhostBox
    if (config.USE_PHOTODIODE) markup += photodiodeGhostBox;
    return markup;
  },
  on_load: () => {
    // Conditionally flashes the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.open_task);
  },
};
