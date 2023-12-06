import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1, p } from "../lib/markup/tags";

// TODO #330: Actually check to see if USB is connected? This isn't testing anything?
function holdUpMarker() {
  const eventMarkerMarkup = h1(language.trials.eventMarker.connected, { style: "color: green;" });

  return {
    type: htmlButtonResponse,
    stimulus: baseStimulus(eventMarkerMarkup, true) + photodiodeGhostBox(),
    prompt: [p(language.trials.holdUpMarker)],
    choices: [language.prompts.continue.button],
  };
}

export default holdUpMarker;
