import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { SETTINGS, ENV } from "../../config/";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { div } from "../../lib/markup/tags";
import { getJsPsych } from "../../lib/utils";

const fixationSettings = SETTINGS.fixation;
const fixationCode = fixationSettings.code;

/**
 * Builds a trial with a fixation dot and optional photodiode box.
 *
 * @type {Object} A jsPsych trial object
 */
export const buildFixationTrial = {
  type: htmlKeyboardResponse,
  choices: "NO_KEYS",
  // Display the fixation dot
  stimulus: div("", { id: "fixation-dot" }),
  prompt: function () {
    // Conditionally display the photodiodeGhostBox
    if (ENV.USE_PHOTODIODE) return photodiodeGhostBox;
    else return null;
  },
  trial_duration: function () {
    if (fixationSettings.randomize_duration) {
      // Select a random duration from the durations array to show the fixation dot for
      return getJsPsych().randomization.sampleWithoutReplacement(fixationSettings.durations, 1)[0];
    } else {
      // Show the fixation dot for default duration seconds
      return fixationSettings.default_duration;
    }
  },
  data: {
    code: fixationCode, // Add event code to the recorded data
  },
  on_load: function () {
    // Conditionally flash the photodiode when the trial first loads
    if (ENV.USE_PHOTODIODE) pdSpotEncode(fixationCode);
  },
};
