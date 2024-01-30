import { config } from "../config/main";

import { buildCameraStartTrial } from "../trials/camera";
import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import { startCodeTrial } from "../trials/startCode";
import { nameTrial, welcomeTrial } from "../trials/welcome";

/** Builds the blocks of trials needed to start and setup the experiment */

/**
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych (nested) timeline object
 */
function buildStartBlock(jsPsych) {
  const timeline = [];
  if (config.USE_CAMERA) timeline.push(buildCameraStartTrial(jsPsych)); // Add buildCameraStartTrial as the first trial

  // const timeline = [nameTrial, enterFullscreenTrial, welcomeTrial];

  // Conditionally add the photodiode setup trials
  if (config.USE_PHOTODIODE) {
    timeline.push(holdUpMarkerTrial);
    timeline.push(startCodeTrial);
  }

  return { timeline };
}

export { buildStartBlock };
