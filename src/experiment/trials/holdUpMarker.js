import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { config, LANGUAGE } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { div, h1, p } from "../../lib/markup/tags";

// TODO @brown-ccv #330: Rename as checkEEG? (this is a similar trial to cameraStart)
// TODO @brown-ccv #330: Actually check to see if USB is connected? This isn't testing anything?
export const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus: function () {
    const eventMarkerMarkup = h1(LANGUAGE.trials.eventMarker.connected, {
      style: "color: green;",
    });
    return div(eventMarkerMarkup, { class: "bottom-prompt" });
  },
  prompt: function () {
    let holdUpMarkerPrompt = p(LANGUAGE.trials.holdUpMarker);

    // Conditionally add the photodiodeGhostBox
    if (config.USE_PHOTODIODE) holdUpMarkerPrompt += photodiodeGhostBox;

    return holdUpMarkerPrompt;
  },
  choices: [LANGUAGE.prompts.continue.button],
  on_load: function () {
    // Conditionally flash the photodiode when the trial first loads
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.test_connect);
  },
};
