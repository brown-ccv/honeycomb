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
const endBlock = {
  timeline: [exitFullscreenTrial, conclusionTrial],
};

export { endBlock };
