import htmlButtonResponse from '@jspsych/plugin-html-button-response';

// TODO: Move markup to JsPsych?
import { photodiodeGhostBox } from '../../../markup/photodiode';
import { baseStimulus } from '../../../markup/stimuli';

import { language } from '../../../language';
import { TASK_NAME } from '../../../constants';

// TODO: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../../config/home.json';
import { initJsPsych } from 'jspsych';

// Get the ipcRender if running in an  electron window
// TODO 192: Is it okay for this to start undefined?
// TODO 192: Add warning to trial if not running in electron?
let ipcRenderer = false;
// TODO: Camera can now be accessed by the browser
// if (config.USE_ELECTRON) {
// if (config.equipment.camera === true) {
//   ipcRenderer = window.require('electron').ipcRenderer;
// }

// ! This will break, need only a single JsPsych instance for the whole app
const JSPSYCH = initJsPsych();

/**
 * Experiment trial for starting a participant's camera feed
 */
// TODO: JsPsych now has built in camera initialization
// TODO: How to pass JsPsych instance into the trials?
export function createCameraStartTrial() {
  document.title = TASK_NAME;
  const markup = `
  <div class="d-flex flex-column align-items-center">
  <p>${language.instructions.camera}</p>
  <video id="camera" width="640" height="480" autoplay></video>
  </div>
  `;
  const stimulus = baseStimulus(markup, true) + photodiodeGhostBox();

  return {
    type: htmlButtonResponse,
    stimulus,
    choices: [language.prompt.continue.button],
    response_ends_trial: true,
    on_load: () => {
      // Grab elements, create settings, etc.
      // Elements for taking the snapshot
      const participantID = JSPSYCH.data.get().values()[0].participant_id;

      const camera = document.getElementById('camera');

      const handleEvents = function (stream, recorder) {
        console.log(stream);
        if (recorder === 'cameraCapture') {
          camera.srcObject = stream;
        }

        const options = { mimeType: 'video/webm' };
        const recordedChunks = [];
        window[recorder] = new MediaRecorder(stream, options); // eslint-disable-line no-undef

        window[recorder].addEventListener('dataavailable', function (e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });

        window[recorder].addEventListener('stop', function () {
          const blob = new Blob(recordedChunks); // eslint-disable-line no-undef
          const reader = new FileReader(); // eslint-disable-line no-undef
          const fileName = `pid_${participantID}_${recorder}_${Date.now()}.webm`;
          reader.onload = function () {
            if (reader.readyState === 2) {
              const buffer = Buffer.from(reader.result); // eslint-disable-line no-undef
              ipcRenderer.send('save_video', fileName, buffer);
              console.log(`Saving ${JSON.stringify({ fileName, size: blob.size })}`);
            }
          };
          reader.readAsArrayBuffer(blob);
        });
      };

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => handleEvents(stream, 'cameraCapture'));

      const { desktopCapturer } = window.require('electron');
      desktopCapturer.getSources({ types: ['window'] }).then(async (sources) => {
        for (const source of sources) {
          if (source.name === TASK_NAME) {
            navigator.mediaDevices
              .getUserMedia({
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                  },
                },
              })
              .then((stream) => handleEvents(stream, 'screenCapture'))
              .catch((error) => console.log(error));
          }
        }
      });
    },
    on_finish: () => {
      if (config.USE_CAMERA) {
        try {
          window.cameraCapture.start();
          window.screenCapture.start();
        } catch (error) {
          window.alert(
            'Camera permissions were not given, if you choose to proceed, your recording will not be saved. Please restart the experiment after you have given permission.'
          );
        }
      }
    },
  };
}

export const CameraStart = createCameraStartTrial();
