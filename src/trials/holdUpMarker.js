import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import { language } from "../config/main";
import { photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import eventMarkerMessage from "../lib/markup/eventMarkerMessage";

const holdUpMarker = () => {
  const stimulus = baseStimulus("<div><h2 id='usb-alert'></h2></div>", true) + photodiodeGhostBox();

  return {
    type: htmlButtonResponse,
    stimulus,
    prompt: [`<br><h3>${language.trials.holdUpMarker}</h3>`],
    choices: [language.prompts.continue.button],
    on_load: () =>
      eventMarkerMessage().then((s) => {
        document.getElementById("usb-alert").innerHTML = s;
      }),
  };
};

export default holdUpMarker;
