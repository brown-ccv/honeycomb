import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config } from "../config/main";

import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { showName, showWelcome } from "../trials/welcome";

/**
 * Timeline of initial trials used for setup and instructions
 */
const timeline = [showName(), enterFullscreenTrial, showWelcome()];

// Add photodiode trials
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarkerTrial);
  timeline.push(startCode());
}

// TODO: Refactor to function
export const preamble = {
  type: htmlKeyboardResponse,
  stimulus: "",
  timeline,
};
