import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";

import { config, LANGUAGE } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { h1 } from "../../lib/markup/tags";

// TODO @brown-ccv #401: Remove "USE_VOLUME" environment variable
// TODO @brown-ccv #402: Rename beepTrial, remove "Setting up" and photodiode logic
export const startCodeTrial = {
  type: audioKeyboardResponse,
  stimulus: "assets/audio/beep.mp3",
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
  prompt: function () {
    let markup = h1(LANGUAGE.prompts.settingUp);
    // Conditionally displays the photodiodeGhostBox
    if (config.USE_PHOTODIODE) markup += photodiodeGhostBox;
    return markup;
  },
  on_load: function () {
    // Conditionally flashes the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.open_task);
  },
};
