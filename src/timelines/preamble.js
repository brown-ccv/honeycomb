import { config } from "../config/main";

import { enterFullscreenTrial } from "../trials/fullscreen";
import { holdUpMarkerTrial } from "../trials/holdUpMarker";
import { startCodeTrial } from "../trials/startCode";
import { welcomeTrial, nameTrial } from "../trials/welcome";

/** Builds the blocks of trials needed to start and setup the experiment */
function buildPreambleBlock() {
  const timeline = [nameTrial, enterFullscreenTrial, welcomeTrial];

  // Conditionally add the photodiode setup trials
  if (config.USE_PHOTODIODE) {
    timeline.push(holdUpMarkerTrial);
    timeline.push(startCodeTrial);
  }

  return { timeline };
}

export { buildPreambleBlock };
