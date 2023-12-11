import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";

import { config, eventCodes, taskSettings } from "../config/main";
import { photodiodeGhostBox, pdSpotEncode } from "../lib/markup/photodiode";
import { buildFixationTrial } from "../trials/fixation";

function buildHoneycombBlock(jsPsych) {
  const { honeycomb: honeycombSettings } = taskSettings;

  const fixationTrial = buildFixationTrial(jsPsych);

  /**
   * Displays a colored circle and waits for participant to response with a keyboard press
   *
   * The settings for this trial are passed as timeline variables
   *
   * Note that the correct_response is saved as a data point
   * Note that the trial calculates and saves if the user responded correctly on trial_finish
   */
  // TODO #332: Add photodiode and event marker code here

  const taskTrial = {
    type: imageKeyboardResponse,
    // Display the image passed as a timeline variable
    stimulus: jsPsych.timelineVariable("stimulus"),
    // Display the photodiodeGhostBox
    prompt: () => {
      if (config.USE_PHOTODIODE) return photodiodeGhostBox();
      else return null;
    },
    // Possible choices are the correct_responses from the task settings
    choices: honeycombSettings.timeline_variables.map((variable) => variable.correct_response),
    data: {
      // Record the correct_response passed as a timeline variable
      code: eventCodes.honeycomb,
      correct_response: jsPsych.timelineVariable("correct_response"),
    },
    // Flash the photodiode when the trial first loads
    on_load: () => config.USE_PHOTODIODE && pdSpotEncode(eventCodes.honeycomb, 1, config),
    // Add a boolean value ("correct") to the data - if the user responded with the correct key or not
    on_finish: (data) => {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
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
    timeline: [fixationTrial, taskTrial],
    randomize_order: honeycombSettings.randomize_order,
    repetitions: honeycombSettings.repetitions,
    timeline_variables: honeycombSettings.timeline_variables,
  };
  return honeycombBlock;
}

export { buildHoneycombBlock };
