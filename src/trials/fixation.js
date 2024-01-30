import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { SETTINGS, config, eventCodes } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { div } from "../lib/markup/tags";

/**
 * Builds a trial with a fixation dot and optional photodiode box.
 * @param {Object} jsPsych The global jsPsych object used to build the trial
 * @returns {Object} A jsPsych trial object
 */
export function buildFixationTrial(jsPsych) {
  // TODO #371: These settings should be passed as a parameter to the function
  const fixationSettings = SETTINGS.fixation;
  const fixationCode = eventCodes.fixation;

  return {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    // Display the fixation dot
    stimulus: div("", { id: "fixation-dot" }),
    prompt: () => {
      // Conditionally display the photodiodeGhostBox
      if (config.USE_PHOTODIODE) return photodiodeGhostBox;
      else return null;
    },
    trial_duration: () => {
      if (fixationSettings.randomize_duration) {
        // Select a random duration from the durations array to show the fixation dot for
        return jsPsych.randomization.sampleWithoutReplacement(fixationSettings.durations, 1)[0];
      } else {
        // Show the fixation dot for default duration seconds
        return fixationSettings.default_duration;
      }
    },
    data: {
      code: fixationCode, // Add event code to the recorded data
    },
    on_load: () => {
      // Conditionally flash the photodiode when the trial first loads
      if (config.USE_PHOTODIODE) pdSpotEncode(fixationCode);
    },
  };
}
