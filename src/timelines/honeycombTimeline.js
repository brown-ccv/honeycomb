import { buildDebriefTrial, instructionsTrial, preloadTrial } from "../trials/honeycombTrials";

import { buildEndBlock } from "./endBlock";
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

  // Builds the trial needed to debrief the participant on their performance
  const debriefTrial = buildDebriefTrial(jsPsych);

  // Builds the trials that make up the end block
  const endBlock = buildEndBlock(jsPsych);

  const timeline = [
    startBlock,
    preloadTrial,
    instructionsTrial,
    honeycombBlock,
    debriefTrial,
    endBlock,
  ];
  return timeline;
}

export { buildHoneycombTimeline };
