import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { config, eventCodes, language } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1, p } from "../lib/markup/tags";

// TODO #330: Actually check to see if USB is connected? This isn't testing anything?
const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus: () => {
    const eventMarkerMarkup = h1(language.trials.eventMarker.connected, {
      style: "color: green;",
    });
    return baseStimulus(eventMarkerMarkup, true);
  },
  prompt: () => {
    let holdUpMarkerPrompt = p(language.trials.holdUpMarker);

    // Conditionally add the photodiodeGhostBox
    if (config.USE_PHOTODIODE) holdUpMarkerPrompt += photodiodeGhostBox;

    return holdUpMarkerPrompt;
  },
  choices: [language.prompts.continue.button],
  // Conditionally flash the photodiode when the trial first loads
  on_load: () => {
    if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.open_task);
  },
};

export { holdUpMarkerTrial };
