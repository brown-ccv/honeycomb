import { countdown, showMessage } from "@brown-ccv/behavioral-task-trials";
import { language, envConfig } from "../config/main";
import { cameraStart, cameraEnd } from "../trials/camera"
import {
  ageCheck,
  sliderCheck,
  demographics,
  iusSurvey,
  debrief,
} from "../trials/quizTrials";
import preamble from "./preamble";
import taskBlock from "./taskBlock";
import { tutorialBlock } from "../config/tutorial";
import { exptBlock2 } from "../config/experiment";

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log('A trial just ended, here are the latest data:');
    console.log(data);
  },
  default_iti: 250
};

// TODO: PR #88 doesn't use the MTurk timeline, which is correct?
// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
const buildTimeline = (jsPsych) => envConfig.USE_MTURK
  ? mturkTimeline
  : buildPrimaryTimeline(jsPsych);

const buildPrimaryTimeline = (experimentConfig) => {
  // Unconditional part of the timeline
  let timeline = [
    preamble(experimentConfig),
    ageCheck,
    sliderCheck,
    countdown({ message: language.countdown.message1 }),
    taskBlock(experimentConfig),
    // countdown({ message: lang.countdown.message1 }),
    // taskBlock(practiceBlock),
    // countdown({ message: lang.countdown.message2 }),
    // taskBlock(exptBlock1),
    demographics,
    iusSurvey,
    debrief
  ];

  // Add camera-specific trials to the timeline if in use.
  if (envConfig.USE_CAMERA) {
    timeline.splice(1, 0, cameraStart())
    timeline.push(cameraEnd(5000))
  }

  // Add ending message
  timeline.push(showMessage(envConfig, {
    duration: 5000,
    message: language.task.end,
  }))

  return timeline
}

const mturkTimeline = [
  preamble,
  countdown({ message: language.countdown.message1 }),
  taskBlock(tutorialBlock),
  countdown({ message: language.countdown.message2 }),
  taskBlock(exptBlock2),
  showMessage(envConfig, {
    duration: 5000,
    message: language.task.end,
  }),
];

// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };