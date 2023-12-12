import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, eventCodes, taskSettings } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { div } from "../lib/markup/tags";

/**
 * Builds a trial with a fixation dot and optional photodiode box.
 * @param {Object} jsPsych The global jsPsych object used to build the trial
 * @returns {Object} A jsPsych trial object
 */
export function buildFixationTrial(jsPsych) {
  const fixationSettings = taskSettings.fixation;
  const fixationCode = eventCodes.fixation;

  return {
    type: htmlKeyboardResponse,
    // Display the fixation dot
    stimulus: div(div("", { id: "fixation-dot" }), { class: "center_container" }),
    // Conditionally display the photodiodeGhostBox
    prompt: () => {
      if (config.USE_PHOTODIODE) return photodiodeGhostBox;
      else return null;
    },
    response_ends_trial: false,
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
    // Conditionally flash the photodiode when the trial first loads
    on_load: () => {
      if (config.USE_PHOTODIODE) pdSpotEncode(fixationCode);
    },
  };
}
