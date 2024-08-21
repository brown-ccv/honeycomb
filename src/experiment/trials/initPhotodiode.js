import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { ENV } from "../../config/";
import { eventCodes } from "../../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../../lib/markup/photodiode";

export const initPhotodiodeTrial = {
  type: htmlKeyboardResponse,
  choices: "NO_KEYS",
  trial_duration: 1600,
  stimulus: photodiodeGhostBox,
  on_load: function () {
    if (!ENV.USE_ELECTRON) {
      throw new Error("photodiode recording is only available when running inside Electron");
    }
    if (!ENV.USE_PHOTODIODE) {
      console.warn("photodiode trial was run but USE_PHOTODIODE is set to false ");
    }

    // Flashes the photodiode when the trial first loads
    pdSpotEncode(eventCodes.open_task.code);
  },
};
