import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { photodiodeSpot, photodiodeGhostBox } from "../lib/markup/photodiode";
import { jitter as jitterx } from "../lib/utils";
import { config } from "../config/main";

/**
 * @description
 * Builds a trial with a fixation dot and optional photodiode box.
 *
 * @module
 * @param {Object} config - The configuration object for USE_PHOTODIODE, USE_EEG, USE_ELECTRON and USE_MTURK flags.
 * @param {boolean} config.USE_PHOTODIODE - USE_PHOTODIODE flag
 * @param {boolean} config.USE_EEG - USE_EEG flag
 * @param {boolean} config.USE_ELECTRON - USE_ELECTRON flag
 * @param {boolean} config.USE_MTURK - USE_MTURK flag
 * @param {Object} options
 * @param {number} options.duration - trial duration in milliseconds jittered with the jitter param. (default: 1000)
 * @param {number} options.jitter - jitter range (0-jitter) to add from to the trial duration (default: 50)
 * @param {number} options.taskCode - Task code to be saved into data log (default: 1)
 * @param {number} options.numBlinks - Number of times the pulse needs to be repeated for photodiode box, when USE_PHOTODIODE is set true. (default: 1)
 */
export function fixation(options) {
  const { duration, jitter, taskCode, numBlinks } = {
    duration: 1000,
    jitter: 50,
    taskCode: 1,
    numBlinks: 1,
    ...options,
  };

  // TODO: Use helper function
  let stimulus = '<div class="center_container"><div id="fixation-dot"> </div></div>';
  if (config.USE_PHOTODIODE) stimulus += photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    response_ends_trial: false,
    trial_duration: jitterx(duration, jitter),
    on_load: () => {
      if (config.USE_PHOTODIODE) photodiodeSpot(taskCode, numBlinks, config);
    },
    on_finish: (data) => (data.code = taskCode),
  };
}
// TODO: Export as constant, not function
