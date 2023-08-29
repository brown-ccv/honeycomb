import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import { fixation } from "@brown-ccv/behavioral-task-trials";

import { config, taskSettings } from "../config/main";

function createHoneycombBlock(jsPsych) {
  const { fixation: fixationSettings, honeycomb: honeycombSettings } = taskSettings;

  /**
   * Displays a fixation dot at the center of the screen.
   *
   * The settings for this trial are loaded from taskSettings.fixation:
   *    If randomize_duration is true the dot is shown for default_duration
   *    Otherwise, a random value is selected from durations
   */
  // TODO 280: Pull fixation trial into Honeycomb directly
  const fixationTrial = fixation(config, {
    duration: fixationSettings.randomize_duration
      ? jsPsych.randomization.sampleWithoutReplacement(fixationSettings.durations, 1)[0]
      : fixationSettings.default_duration,
  });

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
    // Display a stimulus passed as a timeline variable
    stimulus: jsPsych.timelineVariable("stimulus"),
    // Possible choices are the correct_responses from the task settings
    choices: honeycombSettings.timeline_variables.map((variable) => variable.correct_response),
    data: {
      // Record the correct_response passed as a timeline variable
      task: "response", // TODO 280: Fixation will be recorded as "task: fixation"
      correct_response: jsPsych.timelineVariable("correct_response"),
    },
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

export { createHoneycombBlock };
