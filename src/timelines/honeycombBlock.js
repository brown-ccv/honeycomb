import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import { fixation } from "@brown-ccv/behavioral-task-trials";

import { config, taskSettings } from "../config/main";

function createHoneycombBlock(jsPsych) {
  // TODO 280: Pull fixation trial into Honeycomb directly
  // Create a fixation trial where the duration is of one of the values in trialDurations
  // TODO: Add trial durations as part of the config object
  const trialDurations = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  const fixationTrial = fixation(config, {
    duration: jsPsych.randomization.sampleWithoutReplacement(trialDurations, 1)[0],
  });

  // Display one of the stimuli images and wait for a keyboard response of "f" or "j"
  const taskTrial = {
    type: imageKeyboardResponse,
    stimulus: jsPsych.timelineVariable("stimulus"),
    choices: ["f", "j"],
    data: {
      task: "response",
      correct_response: jsPsych.timelineVariable("correct_response"),
    },
    // Add a "correct" boolean to the data if the user entered the correct response
    on_finish: (data) => {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    },
  };

  // Create a nested timeline containing the fixation and task trials
  const taskBlock = {
    timeline: [taskTrial, fixationTrial],
    randomize_order: taskSettings.randomize_order,
    repetitions: taskSettings.repetitions,
    timeline_variables: taskSettings.timeline_variables,
  };
  return taskBlock;
}

export { createHoneycombBlock };
