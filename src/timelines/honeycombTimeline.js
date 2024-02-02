import { exitFullscreenTrial } from "../trials/fullscreen";
import {
  buildDebriefTrial,
  finishTrial,
  instructionsTrial,
  preloadTrial,
} from "../trials/honeycombTrials";

import { buildHoneycombBlock } from "./honeycombBlock";
import { buildStartBlock } from "./startBlock";

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych timeline object
 */
function buildHoneycombTimeline(jsPsych) {
  // Build the trials that make up the start block
  const startBlock = buildStartBlock(jsPsych);

  // Build the trials that make up the Honeycomb block
  const honeycombBlock = buildHoneycombBlock(jsPsych);

  // TODO #367: Move to end of the honeycombBlock?
  const debriefTrial = buildDebriefTrial(jsPsych);

  const timeline = [
    startBlock,
    preloadTrial,
    instructionsTrial,
    honeycombBlock,
    debriefTrial,
    // TODO #367: Move to endBlock
    finishTrial,
    exitFullscreenTrial,
  ];
  return timeline;
}

export { buildHoneycombTimeline };
