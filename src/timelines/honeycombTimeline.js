import { enterFullscreenTrial, exitFullscreenTrial } from "../trials/fullscreen";
import {
  buildDebriefTrial,
  finishTrial,
  instructionsTrial,
  preloadTrial,
  welcomeTrial,
} from "../trials/honeycombTrials";

import { buildHoneycombBlock } from "./honeycombBlock";
import { buildPreambleBlock } from "./preamble";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 *
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 */
function buildHoneycombTimeline(jsPsych) {
  // The first block repeats 5 times
  // TODO: Pull from config here and pass into function
  const honeycombBlock = buildHoneycombBlock(jsPsych);

  const debriefTrial = buildDebriefTrial(jsPsych);

  const timeline = [
    buildPreambleBlock(),
    welcomeTrial,
    enterFullscreenTrial,
    preloadTrial,
    instructionsTrial,
    honeycombBlock,
    debriefTrial,
    finishTrial,
    exitFullscreenTrial,
  ];
  return timeline;
}

export { buildHoneycombTimeline };
