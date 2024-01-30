import { config } from "../../config/main";
import { buildCameraEndTrial } from "../trials/camera";
import { conclusionTrial } from "../trials/conclusion";
import { exitFullscreenTrial } from "../trials/fullscreen";

/**
 * Builds the block of trials needed to end the experiment
 * 1) Trial used to complete the user's camera recording is displayed
 * 2) The experiment exits fullscreen
 *
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych (nested) timeline object
 */
export function buildEndBlock(jsPsych) {
  const endBlock = [];

  // Conditionally add the camera breakdown trials
  if (config.USE_CAMERA) {
    endBlock.push(buildCameraEndTrial(jsPsych));
  }

  // Add the other trials needed to end the experiment
  endBlock.push(exitFullscreenTrial, conclusionTrial);

  // Return the block as a nested timeline
  return { timeline: endBlock };
}
