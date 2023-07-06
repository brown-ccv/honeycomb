import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

// TODO: Move markup to JsPsych?
import { photodiodeGhostBox } from '../../../../lib/markup/photodiode';
import { baseStimulus } from '../../../../lib/markup/stimuli';

import { language } from '../../../language';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../../config/home.json';

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
      //   if (config.USE_CAMERA) {
      if (config.equipment.camera === true) {
        console.log('finished');
        try {
          window.cameraCapture.stop();
          window.screenCapture.stop();
        } catch (error) {
          window.alert('Your video recording was not saved');
        }
      }
    },
  };
}

export const CameraEnd = createCameraEndTrial();
