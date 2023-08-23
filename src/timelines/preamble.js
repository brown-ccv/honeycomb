import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config } from "../config/main";

import { enterFullscreen } from "../trials/fullscreen";
import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { showName, showWelcome } from "../trials/welcome";

/**
 * Timeline of initial trials used for setup and instructions
 */
const timeline = [showName, enterFullscreen, showWelcome];

// Add photodiode trials
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarker());
  timeline.push(startCode());
}

export const preamble = {
  type: htmlKeyboardResponse,
  stimulus: "",
  timeline,
};
