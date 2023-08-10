import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { config, lang } from "../config/main";

import { enterFullscreen } from "../trials/fullscreen";
import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";

/**
 * Timeline of initial trials used for setup and instructions
 */
const timeline = [
  // Show task name
  // TODO: Make its own trial
  showMessage(config, {
    responseType: htmlButtonResponse,
    message: lang.task.name,
    responseEndsTrial: true,
    buttons: [lang.prompt.continue.button],
  }),
  enterFullscreen, // Enter fullscreen
];

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
