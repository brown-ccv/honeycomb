import { showMessage } from "@brown-ccv/behavioral-task-trials";

import { config, lang } from "../config/main";
// import { practiceBlock } from "../config/practice";
// import { tutorialBlock } from "../config/tutorial";

import { cameraEnd, cameraStart } from "../trials/camera";

// import { enterFullscreen, exitFullscreen } from "../trials/fullscreen";
import { blueTrial, instructionsTrial, orangeTrial, welcomeTrial } from "./exampleTrials";

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log("A trial just ended, here are the latest data:");
    console.log(data);
  },
  default_iti: 250,
};

// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
const buildTimeline = (jsPsych) =>
  config.USE_MTURK ? mturkTimeline : buildPrimaryTimeline(jsPsych);

const buildPrimaryTimeline = (jsPsych) => {
  // TODO: Add a practice and/or tutorial block?

  const primaryTimeline = [
    // TODO: Enter fullscreen
    welcomeTrial,
    // enterFullscreen,
    instructionsTrial,
    blueTrial,
    orangeTrial,
  ];

  if (config.USE_CAMERA) {
    primaryTimeline.splice(1, 0, cameraStart(jsPsych));
    primaryTimeline.push(cameraEnd(5000));
  }

  primaryTimeline.push(
    showMessage(config, {
      duration: 5000,
      message: lang.finish.end,
    })
  );
  // primaryTimeline.push(exitFullscreen);

  console.log(primaryTimeline);

  return primaryTimeline;
};

const mturkTimeline = [
  // preamble,
  // countdown({ message: lang.countdown.message1 }),
  // taskBlock(tutorialBlock),
  // countdown({ message: lang.countdown.message2 }),
  // taskBlock(exptBlock2),
  // showMessage(config, {
  //   duration: 5000,
  //   message: lang.finish.end,
  // }),
  // exitFullscreen,
];

// Honeycomb, please include these options, and please get the timeline from this function.
export { buildTimeline, jsPsychOptions };
