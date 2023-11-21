import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { config, language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1, p } from "../lib/markup/tags";

// TODO: Actually check to see if USB is connected? This isn't testing anything?
// TODO: Rename as checkEEG? (this is a similar trial to cameraStart)
function holdUpMarker() {
  const eventMarkerMarkup = h1(language.trials.eventMarker.connected, { style: "color: green;" });

  return {
    type: htmlButtonResponse,
    stimulus: baseStimulus(eventMarkerMarkup, true) + photodiodeGhostBox(),
    prompt: [p(language.trials.holdUpMarker)],
    choices: [language.prompts.continue.button],
    on_start: async () => {
      // Ensure event marker is connected if using it
      if (config.USE_EEG) await window.electronAPI.checkSerialPort();
    },
  };
}

export default holdUpMarker;
