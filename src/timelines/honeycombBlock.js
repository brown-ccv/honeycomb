import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import { fixation } from "@brown-ccv/behavioral-task-trials";

import { config } from "../config/main";

function createHoneycombBlock(jsPsych) {
  // Possible stimuli values to be displayed
  const stimuli = [{ stimulus: "images/blue.png" }, { stimulus: "images/orange.png" }];

  // Note that we use a custom implementation of the fixation trial
  const fixationTrial = fixation(config, { duration: 650 });

  const taskTrial = {
    type: imageKeyboardResponse,
    stimulus: jsPsych.timelineVariable("stimulus"),
    choices: ["f", "j"],
  };

  // Create a nested timeline containing the fixation and task trials
  const taskBlock = {
    timeline: [fixationTrial, taskTrial],
    timeline_variables: stimuli,
  };
  return taskBlock;
}

export { createHoneycombBlock };
