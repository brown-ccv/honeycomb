import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { config, LANGUAGE } from "../../config/main";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";
import { div, h1, p } from "../../lib/markup/tags";

// TODO @brown-ccv #330: Custom extension for EEG - this is initializeTriggerBox
// TODO @brown-ccv #330: Need to ping the serial part - this isn't doing anything yet
// TODO @brown-ccv: Prevent user from pressing continue until pdSpotEncode finishes (need to use jsPsych.pluginAPI.setTimeout)
export const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus: function () {
    const eventMarkerMarkup = h1(LANGUAGE.trials.eventMarker.connected, {
      style: "color: green;",
    });
    return div(eventMarkerMarkup);
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
