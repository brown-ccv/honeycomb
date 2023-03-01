import { countdown, showMessage } from "@brown-ccv/behavioral-task-trials"

// Task blocks
import preamble from "./preamble"
import taskBlock from "./taskBlock"
// import { practiceBlock } from "../config/practice";
import { tutorialBlock } from "../config/tutorial";
// import { exptBlock1, exptBlock2 } from "../config/experiment";
import { exptBlock2 } from "../config/experiment";

// Trials
// TODO: Add task block for the camera trials?
import { cameraStart, cameraEnd } from "../trials/camera"
import {
  ageCheck,
  sliderCheck,
  demographics,
  iusSurvey,
  debrief,
} from "../trials/quizTrials";

import { LANGUAGE, envConfig } from "../config/main";

/**
 * Add custom jsPsych options
 * These are merged with default options needed by Honeycomb
 */
// TODO: This is part of the default config? 
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log('A trial just ended, here are the latest data:');
    console.log(data);
  },
  default_iti: 250
};


// TODO: How to pass the JsPsych options? Configuration settings?
// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.

/**
 * Construct the timeline for the JsPsych experiment
 * @param experimentConfig The experiment config, either the default one provided in /src/config/config.json or a participant-specific override.
 * @returns {array} The experiment timeline.
*/
// TODO: Refactor to expect jsPsych object
const buildTimeline = (experimentConfig) => {
  // TODO: This function is expecting a config object, not the experiment itself
  if(envConfig.USE_MTURK) buildMTurkTimeline()
  else buildPrimaryTimeline(experimentConfig);
}

// TODO: Refactor to expect jsPsych object
const buildPrimaryTimeline = (experimentConfig) => {
  // Build the timeline from blocks and individual trials
  const timeline = [
    preamble(experimentConfig), // Preamble
    ageCheck, // ageCheck trial
    sliderCheck, // sliderCheckTrial
    countdown({ message: LANGUAGE.countdown.message1 }), // Add a countdown message

    // TODO: The preamble for the specific task should be here
    taskBlock(experimentConfig), // Add the main task block
    demographics,
    iusSurvey,
    debrief
  ]

  // TODO: Condiditionally add these in the timeline creation directly
  if (envConfig.USE_CAMERA) {
    // Add camera specific trials after the preamble
    timeline.splice(1, 0, cameraStart())
    timeline.push(cameraEnd(5000))
  }

  // Add an ending message as a final trial
  timeline.push(showMessage(envConfig, {duration: 5000, message: LANGUAGE.task.end }))

  return timeline
};

const buildMTurkTimeline =  () => {
  // TODO: Preamble is different with the mturk trial?
  [
    preamble,
    countdown({ message: LANGUAGE.countdown.message1 }),
    taskBlock(tutorialBlock),
    countdown({ message: LANGUAGE.countdown.message2 }),
    taskBlock(exptBlock2),
    showMessage(envConfig, {duration: 5000, message: LANGUAGE.task.end }),
  ]
}


// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };
