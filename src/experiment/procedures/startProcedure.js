import { config } from "../../config/main";

import { buildCameraStartTrial } from "../trials/camera";
import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import { nameTrial } from "../trials/name";
import { initPhotodiodeTrial } from "../trials/initPhotodiode";
import { introductionTrial } from "../trials/introduction";

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
export function buildStartProcedure(jsPsych) {
  const procedure = [nameTrial, enterFullscreenTrial, introductionTrial];

  // Conditionally add the photodiode setup trials
  if (config.USE_PHOTODIODE) {
    procedure.push(holdUpMarkerTrial);
    procedure.push(initPhotodiodeTrial);
  }

  // Conditionally add the camera setup trials
  if (config.USE_CAMERA) {
    procedure.push(buildCameraStartTrial(jsPsych));
  }

  // Return the block as a nested timeline
  return { timeline: procedure };
}
