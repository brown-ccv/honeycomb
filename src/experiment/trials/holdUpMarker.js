import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { LANGUAGE } from "../../config/main";
import { h1 } from "../../lib/markup/tags";
import { photodiodeGhostBox } from "../../lib/markup/photodiode";

export const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus:
    h1(LANGUAGE.trials.eventMarker.connected, { style: "color: green;" }) +
    h1(LANGUAGE.trials.holdUpMarker) +
    photodiodeGhostBox,
  choices: [LANGUAGE.prompts.continue.button],
};
