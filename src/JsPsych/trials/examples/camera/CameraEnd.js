import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { photodiodeGhostBox } from "../../../markup/photodiode";
import { baseStimulus } from "../../../markup/baseStimulus";

import { language } from "../../../language";
import { OLD_CONFIG } from "../constants";

/**
 * Experiment trial for ending a participant's camera feed
 * @param duration How long for the trial to run for
 */
export function createCameraEndTrial(duration) {
  const stimulus =
    baseStimulus(`<h1>${language.task.recording_end}</h1>`, true) + photodiodeGhostBox();

  return {
    type: htmlKeyboardResponse,
    stimulus,
    trial_duration: duration,
    on_load: () => {
      if (OLD_CONFIG.USE_CAMERA) {
        console.log("finished");
        try {
          window.cameraCapture.stop();
          window.screenCapture.stop();
        } catch (error) {
          window.alert("Your video recording was not saved");
        }
      }
    },
  };
}

export const CameraEnd = createCameraEndTrial();
