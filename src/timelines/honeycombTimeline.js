import { enterFullscreenTrial, exitFullscreenTrial } from "../trials/fullscreen";
import {
  buildDebriefTrial,
  finishTrial,
  instructionsTrial,
  preloadTrial,
  welcomeTrial,
} from "../trials/honeycombTrials";
import { buildHoneycombBlock } from "./honeycombBlock";
import { preamble } from "./preamble";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 *
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 */
function buildHoneycombTimeline(jsPsych) {
  const honeycombBlock = buildHoneycombBlock(jsPsych); // The first block repeats 5 times
  const debriefTrial = buildDebriefTrial(jsPsych);

  const timeline = [
    preamble,
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
