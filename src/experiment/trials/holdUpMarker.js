import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { LANGUAGE } from "../../config/main";
import { h1 } from "../../lib/markup/tags";
import { photodiodeGhostBox } from "../../lib/markup/photodiode";

// TODO @brown-ccv #330: Custom extension for EEG - this is initializeTriggerBox
// TODO @brown-ccv #330: Need to ping the serial part - this isn't doing anything yet
export const holdUpMarkerTrial = {
  type: htmlButtonResponse,
  stimulus: h1(LANGUAGE.trials.holdUpMarker) + photodiodeGhostBox,
  choices: [LANGUAGE.prompts.continue.button],
};
