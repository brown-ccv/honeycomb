import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { config, eventCodes, LANGUAGE } from "../../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { div, h1, p } from "../../lib/markup/tags";

// TODO #330: Rename as checkEEG? (this is a similar trial to cameraStart)
// TODO #330: Actually check to see if USB is connected? This isn't testing anything?
const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus: () => {
    const eventMarkerMarkup = h1(LANGUAGE.trials.eventMarker.connected, {
      style: "color: green;",
    });
    return div(eventMarkerMarkup, { class: "bottom-prompt" });
  },
  prompt: () => {
    let holdUpMarkerPrompt = p(LANGUAGE.trials.holdUpMarker);

    // Conditionally add the photodiodeGhostBox
    if (config.USE_PHOTODIODE) holdUpMarkerPrompt += photodiodeGhostBox;

    return holdUpMarkerPrompt;
  },
  choices: [LANGUAGE.prompts.continue.button],
  on_load: () => {
    // Conditionally flash the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.test_connect);
  },
};

export { holdUpMarkerTrial };
