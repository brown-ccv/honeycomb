import { config } from "../config/main";

import { buildCameraStartTrial } from "../trials/camera";
import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import { nameTrial } from "../trials/name";
import { startCodeTrial } from "../trials/startCode";
import { welcomeTrial } from "../trials/welcome";

/**
 * Builds the block of trials needed to start and setup the experiment
 * 1) The name of the experiment is displayed
 * 2) The experiment enters fullscreen
 * 3) A welcome message is displayed
 * 4) Trials used to set up a photodiode and trigger box are displayed (if applicable)
 * 5) Trials used to set up the user's camera are displayed (if applicable)
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych (nested) timeline object
 */
function buildStartBlock(jsPsych) {
  const startBlock = [nameTrial, enterFullscreenTrial, welcomeTrial];

  // Conditionally add the photodiode setup trials
  if (config.USE_PHOTODIODE) {
    startBlock.push(holdUpMarkerTrial);
    startBlock.push(startCodeTrial);
  }

  // Conditionally add the camera setup trials
  if (config.USE_CAMERA) {
    startBlock.push(buildCameraStartTrial(jsPsych));
  }

  // Return the block as a nested timeline
  return { timeline: startBlock };
}

export { buildStartBlock };
