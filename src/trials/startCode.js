import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { audioCodes, eventCodes, language } from "../config/main";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";
import { beep } from "../lib/utils";

function startCode() {
  const startCodeMessage = h1(language.prompts.settingUp);
  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(startCodeMessage, true) + photodiodeGhostBox(),
    trial_duration: 2000,
    on_load: () => {
      pdSpotEncode(eventCodes.open_task);
      beep(audioCodes);
    },
  };
}

export default startCode;
