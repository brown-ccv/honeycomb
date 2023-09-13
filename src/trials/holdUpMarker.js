import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

// TODO: Actually check to see if USB is connected? This isn't testing anything?
function holdUpMarker() {
  // const eventMarkerMessage = `<h1 style="color: green;">${language.trials.eventMarker.connected}</h1>`;
  const eventMarkerMessage = h1(language.trials.eventMarker.connected, { style: "color: green;" });
  const stimulus = baseStimulus(eventMarkerMessage, true) + photodiodeGhostBox();

  return {
    type: htmlButtonResponse,
    stimulus,
    prompt: [`<p>${language.trials.holdUpMarker}</p>`],
    choices: [language.prompts.continue.button],
  };
}

export default holdUpMarker;
