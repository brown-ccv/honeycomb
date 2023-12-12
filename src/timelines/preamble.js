import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config } from "../config/main";

import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import { startCodeTrial } from "../trials/startCode";
import { welcomeTrial, nameTrial } from "../trials/welcome";

/**
 * Timeline of initial trials used for setup and instructions
 */
const timeline = [nameTrial, enterFullscreenTrial, welcomeTrial];

// Add photodiode trials
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarkerTrial);
  timeline.push(startCodeTrial);
}

// TODO: Refactor to function
export const preamble = {
  type: htmlKeyboardResponse,
  stimulus: "",
  timeline,
};
