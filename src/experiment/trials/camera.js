import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import initializeCamera from "@jspsych/plugin-initialize-camera";

import { LANGUAGE, config } from "../../config/main";
import { div, h1, p, tag } from "../../lib/markup/tags";

const WEBCAM_ID = "webcam";

/**
 * A trial that begins recording the participant using their computer's default camera
 * @param {Object} jsPsych The jsPsych instance being used to run the task
 * @returns {Object} A jsPsych trial object
 */
// TODO @brown-ccv #301: Use jsPsych extension, deprecate this function
// TODO @brown-ccv #343: We should be able to make this work on both electron and browser?
// TODO @brown-ccv #301: Rolling save to the deployment (webm is a subset of mkv)
export function buildCameraStartTrial(jsPsych) {
  return {
    timeline: [
      {
        // Prompts user permission for camera device
        type: initializeCamera,
        include_audio: true,
        mime_type: "video/webm",
      },
      {
        // Helps participant center themselves inside the camera
        type: htmlButtonResponse,
        stimulus: function () {
          const videoMarkup = tag("video", "", {
            id: WEBCAM_ID,
            width: 640,
            height: 480,
            autoplay: true,
          });
          const cameraStartMarkup = p(LANGUAGE.trials.camera.start);
          const trialMarkup = div(cameraStartMarkup + videoMarkup, {
            // TODO @brown-ccv #344: Get rid of bootstrap (this is just centering it)
            class: "d-flex flex-column align-items-center",
          });
          return div(trialMarkup);
        },
        choices: [LANGUAGE.prompts.continue.button],
        response_ends_trial: true,
        on_start: function () {
          // Initialize and store the camera feed
          if (!config.USE_ELECTRON) {
            throw new Error("video recording is only available when running inside Electron");
          }

          const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
          if (!cameraRecorder) {
            console.error("Camera is not initialized, no data will be recorded.");
            return;
          }
          const cameraChunks = [];

          // Push data whenever available
          cameraRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) cameraChunks.push(event.data);
          });

          // Saves the raw data feed from the participants camera (executed on cameraRecorder.stop()).
          cameraRecorder.addEventListener("stop", () => {
            const blob = new Blob(cameraChunks, { type: cameraRecorder.mimeType });

            // Pass video data to Electron as a base64 encoded string
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              window.electronAPI.saveVideo(reader.result);
            };
          });
        },
        on_load: function () {
          // Assign camera feed to the <video> element
          const camera = document.getElementById(WEBCAM_ID);

          camera.srcObject = jsPsych.pluginAPI.getCameraRecorder().stream;
        },
        on_finish: function () {
          // Begin video recording
          jsPsych.pluginAPI.getCameraRecorder().start();
        },
      },
    ],
  };
}

/**
 * A trial that finishes recording the participant using their computer's default camera
 *
 * @param {Number} duration How long to show the trial for
 * @returns {Object} A jsPsych trial object
 */
export function buildCameraEndTrial(jsPsych) {
  const recordingEndMarkup = h1(LANGUAGE.trials.camera.end);

  return {
    type: htmlKeyboardResponse,
    stimulus: div(recordingEndMarkup, { class: "bottom-prompt" }),
    trial_duration: 5000,
    on_start: function () {
      // Complete the camera recording

      if (!config.USE_ELECTRON) {
        throw new Error("video recording is only available when running inside Electron");
      }

      const cameraRecorder = jsPsych.pluginAPI.getCameraRecorder();
      if (!cameraRecorder) {
        console.error("Camera is not initialized, no data will be recorded.");
        return;
      }

      cameraRecorder.stop();
    },
  };
}
