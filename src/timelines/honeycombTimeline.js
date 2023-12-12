import { enterFullscreen, exitFullscreen } from "../trials/fullscreen";
import {
  buildDebriefTrial,
  finishTrial,
  instructionsTrial,
  preloadTrial,
  welcomeTrial,
} from "../trials/honeycombTrials";

import { buildHoneycombBlock } from "./honeycombBlock";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 *
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 */
function buildHoneycombTimeline(jsPsych) {
  const honeycombTrials = buildHoneycombBlock(jsPsych); // The first block repeats 5 times
  const debriefTrial = buildDebriefTrial(jsPsych);

  const timeline = [
    welcomeTrial,
    enterFullscreen,
    preloadTrial,
    instructionsTrial,
    honeycombTrials,
    debriefTrial,
    finishTrial,
    exitFullscreen,
  ];
  return timeline;
}

export { buildHoneycombTimeline };
