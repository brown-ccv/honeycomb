import { config } from "../config/main";
import { buildCameraEndTrial, buildCameraStartTrial } from "../trials/camera";

import { buildHoneycombTimeline } from "./honeycombTimeline";

// Add CSS styling for the trials
import "../lib/markup/trials.css";

/**
 * Experiment-wide settings for jsPsych: https://www.jspsych.org/7.3/overview/experiment-options/
 * Note that Honeycomb combines these with other options required for Honeycomb to operate correctly
 */
const jsPsychOptions = {
  on_trial_finish: (data) => console.log(`Trial ${data.internal_node_id} just finished:`, data),
};

/**
 * Builds the experiment's timeline that jsPsych will run
 * The instance of jsPsych passed in will include jsPsychOptions from above
 * @param {Object} jsPsych The jsPsych instance that is running the experiment
 * @param {string} studyID The ID of the study that was just logged into
 * @param {string} participantID The ID of the participant that was just logged in
 * @returns The timeline for JsPsych to run
 */
function buildTimeline(jsPsych, studyID, participantID) {
  console.log(`Building timeline for participant ${participantID} on study ${studyID}`);
  const timeline = buildHoneycombTimeline(jsPsych);

  // Dynamically adds the camera trials to the experiment if config.USE_CAMERA
  if (config.USE_CAMERA) {
    // TODO #367: These should be a part of the start and end blocks
    timeline.unshift(buildCameraStartTrial(jsPsych)); // Add buildCameraStartTrial as the first trial
    timeline.push(buildCameraEndTrial(jsPsych)); // Add buildCameraEndTrial as the last trial
  }

  return timeline;
}

export { buildTimeline, jsPsychOptions };
