/**
 * ! Your timeline and options should be built in a newly created file, not this one
 * TODO @brown-ccv: Link "Quick Start" step once's it's built into the docs
 */
import { buildHoneycombTimeline, honeycombOptions } from "./honeycomb";

// Add CSS styling from jsPsych
import "jspsych/css/jspsych.css";
// Add custom CSS styling for this task
import "../lib/markup/trials.css";

/**
 * Experiment-wide settings for jsPsych: https://www.jspsych.org/7.3/overview/experiment-options/
 * Note that Honeycomb combines these with other options required for Honeycomb to operate correctly
 *
 * Custom options for your experiment should be added in your own file inside the experiment folder
 */
export const jsPsychOptions = honeycombOptions;

/**
 * Builds the experiment's timeline that jsPsych will run
 * The instance of jsPsych passed in will include jsPsychOptions from above
 * @param {Object} jsPsych The jsPsych instance that is running the experiment
 * @param {string} studyID The ID of the study that was just logged into
 * @param {string} participantID The ID of the participant that was just logged in
 * @returns The timeline for JsPsych to run
 */
export function buildTimeline(jsPsych, studyID, participantID) {
  console.log(`Building timeline for participant ${participantID} on study ${studyID}`);

  /**
   * ! Your timeline should be built in a newly created function, not this one
   * TODO @brown-ccv: Link "Quick Start" step once's it's built into the docs
   */
  const timeline = buildHoneycombTimeline(jsPsych);
  return timeline;
}
