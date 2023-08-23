import imageKeyboardResponse from "@jspsych/plugin-image-keyboard-response";
import { fixation } from "@brown-ccv/behavioral-task-trials";

import { config } from "../config/main";

function createHoneycombBlock(jsPsych, repetitions) {
  // Possible stimuli values to be displayed
  const stimuli = [{ stimulus: "images/blue.png" }, { stimulus: "images/orange.png" }];

  // TODO: Pull fixation trial into Honeycomb directly
  // Create a fixation trial where the duration is of one of the values in trialDurations
  const trialDurations = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
  const fixationTrial = fixation(config, {
    duration: jsPsych.randomization.sampleWithoutReplacement(trialDurations, 1)[0],
  });

  // Display one of the stimuli images and wait for a keyboard response of "f" or "j"
  const taskTrial = {
    type: imageKeyboardResponse,
    stimulus: jsPsych.timelineVariable("stimulus"),
    choices: ["f", "j"],
  };

  // Create a nested timeline containing the fixation and task trials
  const taskBlock = {
    timeline: [fixationTrial, taskTrial],
    timeline_variables: stimuli,
    randomize_order: true,
    repetitions: repetitions,
  };
  console.log(taskBlock);
  return taskBlock;
}

export { createHoneycombBlock };
