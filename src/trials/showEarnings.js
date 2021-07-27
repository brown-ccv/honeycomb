import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode"
import { addCursor } from "../lib/utils"
import { envConfig } from "../config/main"
const { earningsDisplay } = require("../lib/markup/earnings")

/**
 * Displays the earnings from a trial.
 * @param {{earnings: number}} trialDetails An object containing the trial parameters.
 * @param {number} duration How long to display the earnings.
 * @returns trial The jsPsych trial object.
 */
const showEarnings = (trialDetails, duration) => {
  return {
    type: "html_keyboard_response",
    stimulus: "",
    response_ends_trial: false,
    trial_duration: duration,
    on_start: (trial) => {
      let earnings = trialDetails.earnings;
      trial.stimulus = earningsDisplay(earnings);
      if (envConfig.USE_PHOTODIODE) trial.stimulus += photodiodeGhostBox();
    },
    on_finish: () => {
      addCursor("experiment");
    },
  }
}

export default showEarnings