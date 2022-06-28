import { lang, config } from "../config/main";
import preamble from "./preamble";
import taskBlock from "./taskBlock";
import { countdown, showMessage } from "@brown-ccv/behavioral-task-trials";
import { cameraStart, cameraEnd } from "../trials/camera"
import { practiceBlock } from "../config/practice";
import { tutorialBlock } from "../config/tutorial";
import { exptBlock1, exptBlock2 } from "../config/experiment";

import {
  ageCheck,
  sliderCheck,
  demographics,
  iusSurvey,
  debrief,
} from "../trials/quizTrials";

// As of jspsych 7, we instantiate jsPsych where needed insead of importing it globally.
// The jsPsych instance passed in here should be the same one used for the running task.
const buildPrimaryTimeline = (jsPsych) => {
  let primaryTimeline = [
    preamble,
    ageCheck,
    sliderCheck,
    countdown({ message: lang.countdown.message1 }),
    taskBlock(practiceBlock),
    countdown({ message: lang.countdown.message2 }),
    taskBlock(exptBlock1),
    demographics,
    iusSurvey,
    debrief,
  ];

  if (config.USE_CAMERA) {
    primaryTimeline.splice(1, 0, cameraStart(jsPsych))
    primaryTimeline.push(cameraEnd(5000))
  }

  primaryTimeline.push(showMessage(config, {
    duration: 5000,
    message: lang.task.end,
  }))

  return primaryTimeline
}

const mturkTimeline = [
  preamble,
  countdown({ message: lang.countdown.message1 }),
  taskBlock(tutorialBlock),
  countdown({ message: lang.countdown.message2 }),
  taskBlock(exptBlock2),
  showMessage(config, {
    duration: 5000,
    message: lang.task.end,
  }),
];

export const buildTimeline = (jsPsych) => config.USE_MTURK ? mturkTimeline : buildPrimaryTimeline(jsPsych);
