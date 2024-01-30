import { buildEndBlock } from "./blocks/endBlock";
import { buildHoneycombBlock } from "./blocks/honeycombBlock";
import { buildStartBlock } from "./blocks/startBlock";

import { buildDebriefTrial, instructionsTrial, preloadTrial } from "./trials/honeycombTrials";

/**
 * ! This file should not be edited! Instead, create a new file with the name of your task
 * TODO: Link "Quick Start" step once's it's built into the docs
 */

/**
 * Experiment-wide settings for jsPsych: https://www.jspsych.org/7.3/overview/experiment-options/
 * Note that Honeycomb combines these with other options required for Honeycomb to operate correctly
 */
export const honeycombOptions = {
  on_finish: (data) => console.log("The experiment has finished:", data),
};

/**
 * This timeline builds the example reaction time task from the jsPsych tutorial.
 * Take a look at how the code here compares to the jsPsych documentation!
 * See the jsPsych documentation for more: https://www.jspsych.org/7.3/tutorials/rt-task/
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych timeline object
 */
export function buildHoneycombTimeline(jsPsych) {
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
