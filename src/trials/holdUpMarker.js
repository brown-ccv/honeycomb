import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";

// TODO: Actually check to see if USB is connected? This isn't communicating anything?
function holdUpMarker() {
  const eventMarkerMessage = `<h1 id='usb-alert' style="color: green;">${language.trials.eventMarker.connected}</h1`;
  const stimulus = baseStimulus(eventMarkerMessage, true) + photodiodeGhostBox();

  return {
    type: htmlButtonResponse,
    stimulus,
    prompt: [language.trials.holdUpMarker],
    choices: [language.prompts.continue.button],
  };
}

export default holdUpMarker;
