import { buildEndProcedure } from "./procedures/endProcedure";
import { buildHoneycombProcedure } from "./procedures/honeycombProcedure";
import { buildStartProcedure } from "./procedures/startProcedure";

import { buildDebriefTrial, instructionsTrial, preloadTrial } from "./trials/honeycombTrials";

/**
 * ! This file should not be edited! Instead, create a new file with the name of your task
 * TODO @brown-ccv: Link "Quick Start" step once's it's built into the docs
 */

/**
 * Experiment-wide settings for jsPsych: https://www.jspsych.org/7.3/overview/experiment-options/
 * Note that Honeycomb combines these with other options required for Honeycomb to operate correctly
 */
export const honeycombOptions = {
  // Called when every trial finishes
  on_trial_finish: function (data) {
    console.log(`Trial ${data.internal_node_id} just finished:`, data);
  },
  // Called when the experiment finishes
  on_finish: function (data) {
    console.log("The experiment has finished:", data);
    // Reload the page for another run-through of the experiment
    window.location.reload();
  },
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
  // Build the trials that make up the start procedure
  const startProcedure = buildStartProcedure(jsPsych);

  // Build the trials that make up the task procedure
  const honeycombProcedure = buildHoneycombProcedure(jsPsych);

  // Builds the trial needed to debrief the participant on their performance
  const debriefTrial = buildDebriefTrial(jsPsych);

  // Builds the trials that make up the end procedure
  const endProcedure = buildEndProcedure(jsPsych);

  const timeline = [
    startProcedure,
    preloadTrial,
    instructionsTrial,
    honeycombProcedure,
    debriefTrial,
    endProcedure,
  ];
  return timeline;
}
