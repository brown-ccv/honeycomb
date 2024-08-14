import { ENV } from "../../config/";
import { buildCameraEndTrial } from "../trials/camera";
import { conclusionTrial } from "../trials/conclusion";
import { exitFullscreenTrial } from "../trials/fullscreen";

/**
 * Builds the procedure needed to end the experiment
 * 1) Trial used to complete the user's camera recording is displayed
 * 2) The experiment exits fullscreen
 *
 * @returns {Object} A jsPsych (nested) timeline object
 */
export function buildEndProcedure() {
  const procedure = [];

  // Conditionally add the camera breakdown trials
  if (ENV.USE_CAMERA) {
    procedure.push(buildCameraEndTrial());
  }

  // Add the other trials needed to end the experiment
  procedure.push(exitFullscreenTrial, conclusionTrial);

  // Return the block as a nested timeline
  return { timeline: procedure };
}
