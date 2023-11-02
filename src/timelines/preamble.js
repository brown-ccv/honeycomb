import { config } from "../config/main";

import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { showName, showWelcome } from "../trials/welcome";

/**
 * Timeline of initial trials used for setup and instructions
 */
const timeline = [showName(), showWelcome()];

// Add photodiode trials
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarker());
  timeline.push(startCode());
}

export const preamble = { timeline };
