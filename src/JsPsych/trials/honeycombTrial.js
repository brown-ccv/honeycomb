import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { showMessage, fixation } from "@brown-ccv/behavioral-task-trials";

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import { OLD_CONFIG } from "../../constants";
import { EVENT_CODES } from "../constants";
import { formatDollars } from "../utils";

/**
 * Create an HTML stimulus for displaying the participant's current earnings
 * @param {number} earnings
 * @returns
 */
function earningsStimulus(earnings) {
  const class_ = earnings >= 0 ? "success" : "danger";
  return `<div class='center_container'>
    <h1 class='text-${class_}'>${formatDollars(earnings)}</h1>
    </div>`;
}

/**
 * Create a single trial of honeycomb's custom task
 */
// TODO 210: Implement stroop game, rename as stroopTrial
export function createHoneycombTrial(condition) {
  const trials = [
    // Display the fixation dot
    // TODO 208: Bring fixation trial into honeycomb
    fixation(OLD_CONFIG, { duration: 650 }),
    // Display the condition
    // TODO 209: Bring showMessage trial into honeycomb
    showMessage(OLD_CONFIG, {
      message: condition,
      onstart: true,
      taskCode: EVENT_CODES.evidence,
    }),
    // Display the next fixation dot
    // TODO 208: Bring fixation trial into honeycomb
    fixation(OLD_CONFIG, { duration: 650 }),

    // Display the user's earnings for the trial
    // TODO 209: Bring showMessage trial into honeycomb
    showMessage(OLD_CONFIG, {
      stimulus: earningsStimulus(Math.random()),
      taskCode: EVENT_CODES.show_earnings,
    }),
  ];

  // Create a single honeycomb trial
  return {
    type: htmlKeyboardResponse,
    timeline: trials,
  };
}
