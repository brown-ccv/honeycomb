import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, eventCodes, taskSettings } from "../config/main";
import { photodiodeGhostBox, photodiodeSpot } from "../lib/markup/photodiode";
import { div } from "../lib/markup/tags";

/**
 * Builds a trial with a fixation dot and optional photodiode box.
 *
 * The settings for this trial are loaded from taskSettings.fixation:
 *  If randomize_duration is true the dot is shown for default_duration
 *  Otherwise, a random value is selected from durations
 *
 */
// TODO: How do we want to add the jitter to the fixation?
// TODO: taskCode and numBlinks in config.json?
export function fixation(jsPsych) {
  const fixationSettings = taskSettings.fixation;
  const taskCode = eventCodes.fixation;

  let stimulus = div(div("", { id: "fixation-dot" }), { class: "center_container" });
  if (config.USE_PHOTODIODE) stimulus += photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    response_ends_trial: false,
    trial_duration: fixationSettings.randomize_duration
      ? jsPsych.randomization.sampleWithoutReplacement(fixationSettings.durations, 1)[0]
      : fixationSettings.default_duration,
    data: {
      code: taskCode, // Add event code to the recorded data
      task: "fixation", // TODO: Remove task, use code
    },
    on_load: () => {
      // TODO: photodiodeSpot should check config, early return instead of error
      if (config.USE_PHOTODIODE) photodiodeSpot(taskCode, 1, config);
    },
  };
}
