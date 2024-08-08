import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";

import { ENV, SETTINGS } from "../../config/";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { buildFixationTrial } from "../trials/fixation";

/**
 * Builds the block of trials that form the core of the Honeycomb experiment
 * 1) A fixation dot is shown at the center of the screen
 * 2) The stimulus image is shown and the user is prompted to press the correct key
 *
 * Note that the block is conditionally rendered and repeated based on the task settings
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych (nested) timeline object
 */
export function buildHoneycombProcedure() {
  const honeycombSettings = SETTINGS.honeycomb;
  console.log("hi");
  const fixationTrial = buildFixationTrial();

  /**
   * Displays a colored circle and waits for participant to response with a keyboard press
   *
   * The settings for this trial are passed as timeline variables
   *
   * Note that the correct_response is saved as a data point
   * Note that the trial calculates and saves if the user responded correctly on trial_finish
   */
  const taskTrial = {
    type: imageKeyboardResponse,
    // Display the image passed as a timeline variable
    stimulus: window.jsPsych.timelineVariable("stimulus"),
    prompt: function () {
      // Conditionally displays the photodiodeGhostBox
      if (ENV.USE_PHOTODIODE) return photodiodeGhostBox;
      else return null;
    },
    // Possible choices are the correct_responses from the task settings
    choices: honeycombSettings.timeline_variables.map((variable) => variable.correct_response),
    data: {
      // Record the correct_response passed as a timeline variable
      code: eventCodes.honeycomb,
      correct_response: window.jsPsych.timelineVariable("correct_response"),
    },
    on_load: function () {
      // Conditionally flashes the photodiode when the trial first loads
      if (ENV.USE_PHOTODIODE) pdSpotEncode(eventCodes.honeycomb);
    },
    // Add a boolean value ("correct") to the data - if the user responded with the correct key or not
    on_finish: function (data) {
      data.correct = window.jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    },
  };

  /**
   * Displays the fixationTrial, followed by a taskTrial as a nested timeline
   *
   * The settings for this trial are loaded from taskSettings.honeycomb:
   *    repetitions denotes how many times the nested timeline is repeated
   *    timeline_variables contains the possible values of settings used by taskTrial
   *    If randomize_duration is true the order of stimuli is randomized for every repeat of the trial
   *
   */
  const honeycombBlock = {
    randomize_order: honeycombSettings.randomize_order,
    repetitions: honeycombSettings.repetitions,
    timeline_variables: honeycombSettings.timeline_variables,
    timeline: [fixationTrial, taskTrial],
  };
  return honeycombBlock;
}
