import { countdown, showMessage } from "@brown-ccv/behavioral-task-trials"

// Task blocks
import preamble from "./preamble"
import taskBlock from "./taskBlock"
// import { practiceBlock } from "../config/practice";
import { tutorialBlock } from "../config/tutorial";
// import { exptBlock1, exptBlock2 } from "../config/experiment";
import { exptBlock2, getConfig } from "../config/experiment";

// Trials
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
 * Add custom jsPsych options for all trials
 * These are merged with default options needed by Honeycomb
 */
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log('A trial just ended, here are the latest data:');
    console.log(data);
  },
  default_iti: 250
};


// TODO: Comments about passing jsPsych object
// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.

/**
 * Construct the timeline for the JsPsych experiment
 * @param experimentConfig The experiment config, either the default one provided in /src/config/config.json or a participant-specific override.
 * @returns {array} The experiment timeline.
*/
const buildTimeline = async (jsPsych) => {
  if(envConfig.USE_MTURK) return await buildMTurkTimeline()
  else return await buildPrimaryTimeline(jsPsych);
}

const buildPrimaryTimeline = async (jsPsych) => {
  const {participant_id, study_id} = jsPsych.data.dataProperties
  const experimentConfig = await getConfig(participant_id, study_id)

  // Build the timeline from blocks and individual trials
  const timeline = [
    // TODO: This should just be a preamble for the experiment in total
    preamble(experimentConfig), // Preamble
    ageCheck, // ageCheck trial
    sliderCheck, // sliderCheckTrial
    countdown({ message: LANGUAGE.countdown.message1 }), // Add a countdown message
    // TODO: The preamble for the specific task should be here
    await taskBlock(jsPsych), // Add the main task block
    demographics,
    iusSurvey,
    debrief
  ]

  // TODO: Add task block for the camera trials?
  // TODO: Conditionally add these in the timeline creation directly
  if (envConfig.USE_CAMERA) {
    // Add camera specific trials after the preamble
    timeline.splice(1, 0, cameraStart())
    timeline.push(cameraEnd(5000))
  }

  // Add an ending message as a final trial
  timeline.push(showMessage(envConfig, {duration: 5000, message: LANGUAGE.task.end }))
  return timeline
};

const buildMTurkTimeline = async () => {
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
